import { useEffect, useState } from "react";
import {
  getBlockedUrls,
  setBlockedUrls,
  UrlEntry,
} from "../services/storageService";

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

type SettingsProps = {
  onBack: () => void;
};

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [urls, setUrlsState] = useState<UrlEntry[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState("");

  // Load blocked URLs
  useEffect(() => {
    getBlockedUrls().then((stored: UrlEntry[]) => setUrlsState(stored));
  }, []);

  // Add new URL
  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    const updatedUrls = [...urls, { id: generateId(), url: newUrl.trim() }];
    setUrlsState(updatedUrls);
    await setBlockedUrls(updatedUrls);
    setNewUrl("");
  };

  // Add a blocked URL instantly (for demo, adds "example.com")
  const handleAddBlockedUrlQuick = async () => {
    const urlToAdd = "example.com";
    const updatedUrls = [...urls, { id: generateId(), url: urlToAdd }];
    setUrlsState(updatedUrls);
    await setBlockedUrls(updatedUrls);
  };

  // Delete URL
  const handleDeleteUrl = async (id: string) => {
    const updatedUrls = urls.filter((entry) => entry.id !== id);
    setUrlsState(updatedUrls);
    await setBlockedUrls(updatedUrls);
  };

  // Start editing
  const handleEditClick = (id: string, url: string) => {
    setEditingId(id);
    setEditingUrl(url);
  };

  // Save edit
  const handleSaveEdit = async (id: string) => {
    const updatedUrls = urls.map((entry) =>
      entry.id === id ? { ...entry, url: editingUrl } : entry,
    );
    setUrlsState(updatedUrls);
    await setBlockedUrls(updatedUrls);
    setEditingId(null);
    setEditingUrl("");
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingUrl("");
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Settings</h2>
        <button
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
          onClick={onBack}
        >
          Back
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <form onSubmit={handleAddUrl} className="flex flex-1 gap-2">
          <input
            type="text"
            className="border rounded px-2 py-1 flex-1"
            placeholder="Add new URL (e.g. facebook.com)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-1 rounded hover:bg-teal-600"
          >
            Add
          </button>
        </form>
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          title="Add a demo blocked URL"
          onClick={handleAddBlockedUrlQuick}
        >
          Add blocked URL
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

export default Settings;
