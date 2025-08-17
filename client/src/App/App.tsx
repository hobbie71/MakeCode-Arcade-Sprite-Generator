import { useState, useEffect } from "react";
import { spriteAPI } from "@/services/api";
import "./App.css";

function App() {
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const isHealthy = await spriteAPI.healthCheck();
      setIsServerConnected(isHealthy);
    } catch (error) {
      console.error("Server connection failed:", error);
      setIsServerConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">
            MakeCode Arcade Sprite Generator
          </h1>
          <p className="text-blue-100 mt-2">
            Create pixel-perfect sprites for MakeCode Arcade
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Project Status
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  loading
                    ? "bg-yellow-400"
                    : isServerConnected
                      ? "bg-green-400"
                      : "bg-red-400"
                }`}></div>
              <span className="text-gray-700">
                Server Status:{" "}
                {loading
                  ? "Checking..."
                  : isServerConnected
                    ? "Connected"
                    : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-700">Client: Ready</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              🚀 Development Setup Complete!
            </h3>
            <ul className="text-blue-700 space-y-1">
              <li>✅ React + TypeScript client configured</li>
              <li>✅ FastAPI Python server ready</li>
              <li>✅ API communication established</li>
              <li>✅ TailwindCSS styling system</li>
              <li>✅ Project structure optimized</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Next Steps:</h4>
            <ol className="text-gray-600 space-y-1 list-decimal list-inside">
              <li>
                Start the Python server:{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  cd server && pip install -r requirements.txt && npm run dev
                </code>
              </li>
              <li>Begin implementing the sprite editor component</li>
              <li>Add image upload functionality</li>
              <li>Integrate AI generation features</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
