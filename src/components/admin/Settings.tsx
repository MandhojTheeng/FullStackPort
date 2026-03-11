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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto px-8 py-16 lg:px-16">
        
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-end border-b border-white mb-24 pb-12 gap-8">
          <div>
            <h1 className="text-[18vw] lg:text-[180px] font-black leading-[0.75] tracking-tighter uppercase">
              CONFIG
            </h1>
            <p className="text-[10px] font-black tracking-[0.5em] uppercase mt-6 opacity-50">
              System / Preferences / Global Settings
            </p>
          </div>
          
          <div className="text-right hidden lg:block">
            <p className="text-[10px] font-black tracking-widest opacity-30 uppercase">System Status</p>
            <p className="text-xl font-black uppercase">Active_Operational</p>
          </div>
        </header>

        <div className="space-y-24">
          
          {/* SITE SETTINGS */}
          <section>
            <h3 className="text-[10px] font-black tracking-[0.5em] uppercase mb-8 opacity-40 text-white">Identity_Protocol</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/20 border border-white/20">
              <div className="bg-black p-12">
                <label className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 mb-6 block">Site_Title</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => onSaveSettings({ ...settings, siteName: e.target.value.toUpperCase() })}
                  className="bg-transparent text-3xl font-black outline-none w-full uppercase"
                />
              </div>
              <div className="bg-black p-12">
                <label className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 mb-6 block">Meta_Description</label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) => onSaveSettings({ ...settings, siteDescription: e.target.value })}
                  className="bg-transparent text-xl font-medium outline-none w-full"
                />
              </div>
            </div>
          </section>

          {/* CACHE SETTINGS */}
          <section>
            <h3 className="text-[10px] font-black tracking-[0.5em] uppercase mb-8 opacity-40 text-white">Performance_Cache</h3>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/20 border border-white/20">
              
              {/* Toggle Section */}
              <div className="lg:col-span-4 bg-black p-12 flex flex-col justify-between">
                <div>
                  <label className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 mb-6 block">State_Control</label>
                  <p className="text-xl font-black uppercase mb-8">Caching_{settings.cacheEnabled ? "Enabled" : "Disabled"}</p>
                </div>
                <button
                  onClick={() => onSaveSettings({ ...settings, cacheEnabled: !settings.cacheEnabled })}
                  className={`h-16 w-full border border-white flex items-center justify-center transition-all duration-500 ${
                    settings.cacheEnabled ? "bg-white text-black" : "bg-black text-white opacity-40"
                  }`}
                >
                  <span className="text-xs font-black tracking-widest uppercase">
                    {settings.cacheEnabled ? "DEACTIVATE" : "ACTIVATE"}
                  </span>
                </button>
              </div>

              {/* Duration Section */}
              <div className="lg:col-span-4 bg-black p-12 border-l border-white/20">
                <label className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 mb-6 block">TTL_Seconds</label>
                <input
                  type="number"
                  value={settings.cacheDuration}
                  onChange={(e) => onSaveSettings({ ...settings, cacheDuration: parseInt(e.target.value) || 3600 })}
                  className="bg-transparent text-6xl font-black outline-none w-full tracking-tighter"
                />
                <p className="text-[10px] font-black opacity-20 mt-4 tracking-widest uppercase">Default_Value: 3600</p>
              </div>

              {/* Purge Section */}
              <div className="lg:col-span-4 bg-zinc-950 p-12 flex flex-col justify-end">
                <button
                  onClick={onClearCache}
                  disabled={clearingCache}
                  className="h-24 w-full border border-white hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-20"
                >
                  <span className="text-xs font-black tracking-[0.3em] uppercase">
                    {clearingCache ? "PURGING_STREAM..." : "PURGE CACHE NOW"}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* SYSTEM INFO / ABOUT */}
          <section>
            <h3 className="text-[10px] font-black tracking-[0.5em] uppercase mb-8 opacity-40 text-white">System_Manifest</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/20 border border-white/20">
              <div className="bg-black p-10">
                <span className="text-[10px] font-black tracking-widest opacity-30 uppercase block mb-4">Core_Version</span>
                <span className="text-2xl font-black">1.0.0</span>
              </div>
              <div className="bg-black p-10">
                <span className="text-[10px] font-black tracking-widest opacity-30 uppercase block mb-4">Architecture</span>
                <span className="text-2xl font-black uppercase">Next.JS_V15</span>
              </div>
              <div className="bg-black p-10">
                <span className="text-[10px] font-black tracking-widest opacity-30 uppercase block mb-4">Interface</span>
                <span className="text-2xl font-black uppercase">Noir_CMS</span>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="mt-32 pt-12 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 pb-20">
          <div className="flex gap-12 text-[10px] font-black tracking-[0.2em]">
            <span>VER / 2026.GLOBAL</span>
            <span>ENCRYPTION_ACTIVE</span>
          </div>
          <p className="text-[10px] font-black tracking-[0.8em] uppercase text-center md:text-right">SANTOSH_ADMIN_CORE</p>
        </footer>
      </div>
    </div>
  );
}