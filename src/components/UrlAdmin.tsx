import React, { useEffect, useState } from "react";
import {
  getBlockedUrls,
  setBlockedUrls,
  UrlEntry,
} from "../services/storageService";

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const UrlAdmin: React.FC = () => {
  const [urls, setUrlsState] = useState<UrlEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState("");

  // Cargar URLs desde almacenamiento adecuado
  useEffect(() => {
    getBlockedUrls().then((stored: UrlEntry[]) => setUrlsState(stored));
  }, []);

  // Eliminar URL
  const handleDeleteUrl = async (id: string) => {
    const updatedUrls = urls.filter((entry) => entry.id !== id);
    setUrlsState(updatedUrls);
    await setBlockedUrls(updatedUrls);
  };

  // Iniciar edición
  const handleEditClick = (id: string, url: string) => {
    setEditingId(id);
    setEditingUrl(url);
  };

  // Guardar edición
  const handleSaveEdit = async (id: string) => {
    const updatedUrls = urls.map((entry) =>
      entry.id === id ? { ...entry, url: editingUrl } : entry,
    );
    setUrlsState(updatedUrls);
    await setBlockedUrls(updatedUrls);
    setEditingId(null);
    setEditingUrl("");
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingUrl("");
  };

  // Add the current tab's URL to the blocked list
  const handleAddCurrentTabUrl = async () => {
    if (!chrome.tabs) return;
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.url) return;
      try {
        const urlObj = new URL(tab.url);
        const hostname = urlObj.hostname.replace(/^www\./, "");
        // Avoid duplicates
        if (urls.some((u) => u.url === hostname)) return;
        const updatedUrls = [...urls, { id: generateId(), url: hostname }];
        setUrlsState(updatedUrls);
        await setBlockedUrls(updatedUrls);
      } catch (e) {
        // ignore invalid URLs
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button
          className="bg-teal-500 text-white px-4 py-1 rounded hover:bg-teal-600"
          onClick={handleAddCurrentTabUrl}
          type="button"
        >
          Add blocked URL (current tab)
        </button>
      </div>

      <ul>
        {urls.length === 0 && (
          <li className="text-gray-500">No blocked URLs.</li>
        )}
        {urls.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between border-b py-2"
          >
            {editingId === entry.id ? (
              <>
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1 mr-2"
                  value={editingUrl}
                  onChange={(e) => setEditingUrl(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1 hover:bg-green-600"
                  onClick={() => handleSaveEdit(entry.id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-left">{entry.url}</span>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-1 hover:bg-blue-600"
                  onClick={() => handleEditClick(entry.id, entry.url)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDeleteUrl(entry.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UrlAdmin;
