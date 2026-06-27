import React, { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../../../services/api";
import { useToast } from "../../../context/toastProvider";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("system");
  const toast = useToast();
  
  // States for System Settings
  const [systemSettings, setSystemSettings] = useState({ 
    isMaintenance: false,
    theme: "light",
    prodiPhone: "",
    prodiEmail: "",
    prodiAddress: "",
    prodiMapsLink: "",
    socialFacebook: "",
    socialInstagram: "",
    socialYoutube: "",
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
          prodiPhone: settings.prodiPhone || "",
          prodiEmail: settings.prodiEmail || "",
          prodiAddress: settings.prodiAddress || "",
          prodiMapsLink: settings.prodiMapsLink || "",
          socialFacebook: settings.socialFacebook || "",
          socialInstagram: settings.socialInstagram || "",
          socialYoutube: settings.socialYoutube || "",
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
      toast.success(`Maintenance mode turned ${newStatus ? "ON" : "OFF"}!`);
    } catch (err) {
      toast.error("Failed to update maintenance settings");
      console.error(err);
    } finally {
      setSystemLoading(false);
    }
  };
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSystemLoading(true);
    try {
      await updateSettings({
        prodiPhone: systemSettings.prodiPhone,
        prodiEmail: systemSettings.prodiEmail,
        prodiAddress: systemSettings.prodiAddress,
        prodiMapsLink: systemSettings.prodiMapsLink,
        socialFacebook: systemSettings.socialFacebook,
        socialInstagram: systemSettings.socialInstagram,
        socialYoutube: systemSettings.socialYoutube,
      });
      toast.success("Contact settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update contact settings");
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
      toast.success("System settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update system settings");
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
        <button
          className={`py-2 px-4 font-semibold ${activeTab === 'contact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('contact')}
        >
          Kontak & Sosial Media
        </button>
      </div>

      <div className="max-w-2xl">
        {activeTab === 'contact' && (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Handphone / Telepon</label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={systemSettings.prodiPhone}
                onChange={(e) => setSystemSettings({ ...systemSettings, prodiPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Program Studi</label>
              <input
                type="email"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={systemSettings.prodiEmail}
                onChange={(e) => setSystemSettings({ ...systemSettings, prodiEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat Program Studi</label>
              <textarea
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                rows="2"
                value={systemSettings.prodiAddress}
                onChange={(e) => setSystemSettings({ ...systemSettings, prodiAddress: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Google Maps (Alamat)</label>
              <input
                type="url"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={systemSettings.prodiMapsLink}
                onChange={(e) => setSystemSettings({ ...systemSettings, prodiMapsLink: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Facebook</label>
              <input
                type="url"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={systemSettings.socialFacebook}
                onChange={(e) => setSystemSettings({ ...systemSettings, socialFacebook: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Instagram</label>
              <input
                type="url"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={systemSettings.socialInstagram}
                onChange={(e) => setSystemSettings({ ...systemSettings, socialInstagram: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Youtube</label>
              <input
                type="url"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={systemSettings.socialYoutube}
                onChange={(e) => setSystemSettings({ ...systemSettings, socialYoutube: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={systemLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {systemLoading ? "Saving..." : "Save Contact Info"}
            </button>
          </form>
        )}

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
