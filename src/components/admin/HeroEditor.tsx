"use client";

import { motion } from "framer-motion";
import { HeroData } from "@/lib/admin-types";

interface HeroEditorProps {
  heroData: HeroData;
  heroForm: HeroData;
  setHeroForm: (data: HeroData) => void;
  onSave: (section: string, data: HeroData) => Promise<void>;
  saving: boolean;
}

export default function HeroEditor({ heroForm, setHeroForm, onSave, saving }: HeroEditorProps) {
  
  const handleStatsChange = (index: number, field: "label" | "value", newValue: string) => {
    const newStats = [...(heroForm.stats || [])];
    while (newStats.length < 4) newStats.push({ label: "", value: "" });
    newStats[index] = { ...newStats[index], [field]: newValue };
    setHeroForm({ ...heroForm, stats: newStats });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* THIN TOP ACCENT */}
      <div className="h-[1px] w-full bg-white/20 fixed top-0 left-0 z-50" />

      <div className="max-w-[1600px] mx-auto px-8 py-16 lg:px-16">
        
        {/* HEADER: MASSIVE & STATIC */}
        <header className="flex flex-col lg:flex-row justify-between items-end border-b border-white mb-24 pb-12 gap-8">
          <div>
            <h1 className="text-[18vw] lg:text-[180px] font-black leading-[0.75] tracking-tighter">
              HERO
            </h1>
            <p className="text-[10px] font-bold tracking-[0.5em] uppercase mt-6 opacity-50">
              System / Core / Configuration
            </p>
          </div>

          <button
            onClick={() => onSave("hero", heroForm)}
            disabled={saving}
            className="w-full lg:w-80 h-24 bg-white text-black hover:invert transition-all duration-500 flex items-center justify-center disabled:opacity-20"
          >
            <span className="text-xs font-black tracking-[0.4em] uppercase">
              {saving ? "EXECUTING..." : "COMMIT CHANGES"}
            </span>
          </button>
        </header>

        {/* METRICS: BOLD BOXES */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/20 border border-white/20 mb-24">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-black p-10 hover:bg-zinc-900 transition-colors">
              <input 
                value={heroForm.stats[i]?.label || ""}
                onChange={(e) => handleStatsChange(i, "label", e.target.value.toUpperCase())}
                placeholder="TAG"
                className="bg-transparent text-[10px] font-black tracking-[0.3em] uppercase mb-16 outline-none w-full placeholder:opacity-20"
              />
              <input 
                value={heroForm.stats[i]?.value || ""}
                onChange={(e) => handleStatsChange(i, "value", e.target.value.toUpperCase())}
                placeholder="00"
                className="bg-transparent text-7xl font-black tracking-tighter outline-none w-full"
              />
            </div>
          ))}
        </section>

        {/* PRIMARY EDITING: GRID SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/20 border border-white/20">
          
          {/* Main Titles */}
          <div className="lg:col-span-8 bg-black divide-y divide-white/20">
            {[1, 2, 3].map((num) => (
              <div key={num} className="p-12 group">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 mb-6 block">Line_0{num}</label>
                <input 
                  value={(heroForm as any)[`headingLine${num}`]}
                  onChange={(e) => setHeroForm({...heroForm, [`headingLine${num}`]: e.target.value.toUpperCase()})}
                  className="bg-transparent text-5xl md:text-7xl font-black tracking-tighter outline-none w-full hover:pl-4 transition-all"
                  placeholder="---"
                />
              </div>
            ))}
          </div>

          {/* Sidebar Data */}
          <div className="lg:col-span-4 bg-black flex flex-col divide-y divide-white/20 border-l border-white/20">
            <div className="p-12">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 mb-6 block">Subtitle</label>
              <input 
                 value={heroForm.subtitle}
                 onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                 className="bg-transparent text-3xl font-black outline-none w-full uppercase"
              />
            </div>
            <div className="p-12">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 mb-6 block">Role</label>
              <input 
                 value={heroForm.role}
                 onChange={(e) => setHeroForm({...heroForm, role: e.target.value})}
                 className="bg-transparent text-3xl font-black outline-none w-full uppercase"
              />
            </div>
            <div className="p-12 flex-grow bg-zinc-950">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 mb-6 block">Brief</label>
              <textarea 
                 value={heroForm.description}
                 onChange={(e) => setHeroForm({...heroForm, description: e.target.value})}
                 rows={6}
                 className="bg-transparent text-xl font-medium leading-snug outline-none w-full resize-none"
                 placeholder="DATA_STREAM_CONTENT"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-32 pt-12 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 pb-20">
          <div className="flex gap-12 text-[10px] font-black tracking-[0.2em]">
            <span>STATUS / ACTIVE</span>
            <span>VER / 2026.03</span>
          </div>
          <p className="text-[10px] font-black tracking-[0.8em] uppercase text-center md:text-right">MASTER_ADMIN_CORE</p>
        </footer>
      </div>
    </div>
  );
}