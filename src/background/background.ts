// Background script using declarativeNetRequest to block/redirect URLs (Manifest V3)

type UrlEntry = { id: string; url: string };

// Helper: generate DNR rules from blocked URLs
function generateDNRRules(
  blockedUrls: string[],
): chrome.declarativeNetRequest.Rule[] {
  // DNR rule IDs must be positive integers and unique per extension
  // We'll use 1000+idx to avoid conflicts with other rules
  return blockedUrls.map((url, idx) => ({
    id: 1000 + idx,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: chrome.runtime.getURL("warning/warning.html") },
    },
    condition: {
      // urlFilter matches the domain or pattern (use ||domain^ for exact domain and subdomains)
      urlFilter: `||${url}^`,
      resourceTypes: ["main_frame"],
    },
  }));
}

// Update DNR rules based on current blocked URLs
function updateDNRRules(blockedUrls: string[]) {
  const rules = generateDNRRules(blockedUrls);
  // Always remove all possible rule IDs in our range before adding new ones
  const allRuleIds = Array.from({ length: 100 }, (_, i) => 1000 + i);

  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: allRuleIds,
      addRules: rules,
    },
    () => {
      if (chrome.runtime.lastError) {
        // Optionally log error
        // console.error("Failed to update DNR rules:", chrome.runtime.lastError);
      }
    },
  );
}

// Listen for changes in storage to update rules
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.blockedUrls) {
    const urls: UrlEntry[] = changes.blockedUrls.newValue || [];
    updateDNRRules(urls.map((u) => u.url));
  }
});

// Initialize rules at startup
chrome.storage.local.get(["blockedUrls"], (result) => {
  const urls: UrlEntry[] = result.blockedUrls || [];
  updateDNRRules(urls.map((u) => u.url));
});
