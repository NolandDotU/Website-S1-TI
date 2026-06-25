import React, { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../../../services/api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("system");
  
  // States for System Settings
  const [systemSettings, setSystemSettings] = useState({ 
    isMaintenance: false,
    theme: "light",
    SystemInfo: { version: "1.0.0", env: "development", developerContanct: "" }
  });
  const [systemLoading, setSystemLoading] = useState(false);


  useEffect(() => {
    fetchUserAndSettings();
  }, []);

  const fetchUserAndSettings = async () => {
    try {
      const response = await getSettings();
      const settings = response?.data || response;
      if (settings) {
        setSystemSettings({ 
          isMaintenance: settings.isMaintenance || false,
          theme: settings.theme || "light",
          SystemInfo: settings.SystemInfo || { version: "1.0.0", env: "development", developerContanct: "" }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMaintenanceToggle = async () => {
    setSystemLoading(true);
    try {
      const newStatus = !systemSettings.isMaintenance;
      await updateSettings({ isMaintenance: newStatus });
      setSystemSettings({ ...systemSettings, isMaintenance: newStatus });
      alert(`Maintenance mode turned ${newStatus ? "ON" : "OFF"}!`);
    } catch (err) {
      alert("Failed to update maintenance settings");
      console.error(err);
    } finally {
      setSystemLoading(false);
    }
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setSystemLoading(true);
    try {
      await updateSettings({ theme: systemSettings.theme, SystemInfo: systemSettings.SystemInfo });
      alert("System settings updated successfully!");
    } catch (err) {
      alert("Failed to update system settings");
      console.error(err);
    } finally {
      setSystemLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h2>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-semibold ${activeTab === 'system' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('system')}
        >
          System
        </button>
        <button
          className={`py-2 px-4 font-semibold ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
      </div>

      <div className="max-w-2xl">
        {activeTab === 'general' && (
          <form onSubmit={handleGeneralSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Theme</label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={systemSettings.theme}
                onChange={(e) => setSystemSettings({ ...systemSettings, theme: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Developer Contact</label>
              <input
                type="email"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={systemSettings.SystemInfo.developerContanct}
                onChange={(e) => setSystemSettings({ 
                  ...systemSettings, 
                  SystemInfo: { ...systemSettings.SystemInfo, developerContanct: e.target.value } 
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Version</label>
              <input
                type="text"
                disabled
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                value={systemSettings.SystemInfo.version}
              />
            </div>
            <button
              type="submit"
              disabled={systemLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {systemLoading ? "Saving..." : "Save Settings"}
            </button>
          </form>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Maintenance Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Turn on maintenance mode to show a maintenance page to visitors. Admins can still access the CMS.
                </p>
              </div>
              <div>
                <button
                  onClick={handleMaintenanceToggle}
                  disabled={systemLoading}
                  className={`px-4 py-2 rounded font-bold text-white shadow-sm transition-colors ${
                    systemSettings.isMaintenance 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  {systemLoading ? "..." : systemSettings.isMaintenance ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
