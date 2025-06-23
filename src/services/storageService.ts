// Service to handle storage of blocked URLs
export type UrlEntry = {
  id: string;
  url: string;
};

const STORAGE_KEY = "blockedUrls";

// Detect if we are in development mode (without chrome.storage.local)
function isDevMode(): boolean {
  return (
    typeof chrome === "undefined" ||
    !chrome.storage ||
    !chrome.storage.local ||
    window.location.hostname === "localhost" ||
    window.location.protocol === "http:"
  );
}

// Get stored URLs
export function getBlockedUrls(): Promise<UrlEntry[]> {
  return new Promise((resolve) => {
    if (isDevMode()) {
      const raw = localStorage.getItem(STORAGE_KEY);
      resolve(raw ? JSON.parse(raw) : []);
    } else if (chrome?.storage?.local) {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        resolve(result[STORAGE_KEY] || []);
      });
    } else {
      resolve([]);
    }
  });
}

// Save URLs
export function setBlockedUrls(urls: UrlEntry[]): Promise<void> {
  return new Promise((resolve) => {
    if (isDevMode()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
      resolve();
    } else if (chrome?.storage?.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: urls }, () => resolve());
    } else {
      resolve();
    }
  });
}
