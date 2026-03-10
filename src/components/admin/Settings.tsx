"use client";

import { Settings as SettingsType } from "@/lib/admin-types";

interface SettingsProps {
  settings: SettingsType;
  onSaveSettings: (newSettings: SettingsType) => void;
  onClearCache: () => void;
  clearingCache: boolean;
}

export default function Settings({ settings, onSaveSettings, onClearCache, clearingCache }: SettingsProps) {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">Settings</h1>
      
      <div className="space-y-6">
        {/* Site Settings */}
        <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">Site Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => onSaveSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Site Description</label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => onSaveSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        {/* Cache Settings */}
        <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">Cache Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Enable Cache</p>
                <p className="text-sm text-white/50">Cache site content for faster loading</p>
              </div>
              <button
                onClick={() => onSaveSettings({ ...settings, cacheEnabled: !settings.cacheEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.cacheEnabled ? "bg-white" : "bg-white/20"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                  settings.cacheEnabled ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Cache Duration (seconds)</label>
              <input
                type="number"
                value={settings.cacheDuration}
                onChange={(e) => onSaveSettings({ ...settings, cacheDuration: parseInt(e.target.value) || 3600 })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              />
              <p className="text-xs text-white/30 mt-1">Default: 3600 seconds (1 hour)</p>
            </div>

            <button
              onClick={onClearCache}
              disabled={clearingCache}
              className="w-full sm:w-auto px-4 py-2.5 lg:py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all disabled:opacity-50 text-sm lg:text-base"
            >
              {clearingCache ? "Clearing..." : "Clear Cache Now"}
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">About</h2>
          <div className="space-y-2 text-sm lg:text-base text-white/60">
            <p><span className="font-medium text-white">Version:</span> 1.0.0</p>
            <p><span className="font-medium text-white">Framework:</span> Next.js</p>
            <p><span className="font-medium text-white">Admin Panel:</span> Custom CMS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

