import { useState } from "react";
import Header from "./components/header";
import UrlAdmin from "./components/UrlAdmin";

function App() {
  const [screen, setScreen] = useState<"settings" | "admin">("admin");

  return (
    <div className="w-96">
      <Header />
      <div className="flex justify-center gap-2 mt-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${screen === "settings" ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setScreen("settings")}
        >
          Settings
        </button>
        <button
          className={`px-3 py-1 rounded ${screen === "admin" ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setScreen("admin")}
        >
          Blocked URLs
        </button>
      </div>
      {screen === "admin" ? (
        <UrlAdmin />
      ) : (
        // Settings page: currently empty, could add more options here
        <div className="p-4"></div>
      )}
    </div>
  );
}

export default App;
