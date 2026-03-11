"use client";

import { AboutData } from "@/lib/admin-types";
import { motion } from "framer-motion";

interface AboutEditorProps {
  aboutData: AboutData;
  aboutForm: AboutData;
  setAboutForm: (data: AboutData) => void;
  onSave: (section: string, data: AboutData) => Promise<void>;
  saving: boolean;
}

export default function AboutEditor({ aboutForm, setAboutForm, onSave, saving }: AboutEditorProps) {
  
  const getDataToSave = () => {
    const expertise = aboutForm.expertise || [];
    const filledExpertise = Array.from({ length: 4 }, (_, i) => ({
      title: expertise[i]?.title || "",
      desc: expertise[i]?.desc || ""
    }));

    const stats = aboutForm.stats || [];
    const filledStats = Array.from({ length: 4 }, (_, i) => ({
      value: stats[i]?.value || "",
      label: stats[i]?.label || ""
    }));

    return {
      title: aboutForm.title || "",
      heading: aboutForm.heading || "",
      bio: aboutForm.bio || "",
      image: aboutForm.image || "",
      expertise: filledExpertise,
      stats: filledStats
    };
  };

  const handleExpertiseChange = (index: number, field: "title" | "desc", newValue: string) => {
    const newExpertise = [...(aboutForm.expertise || [])];
    while (newExpertise.length < 4) newExpertise.push({ title: "", desc: "" });
    newExpertise[index] = { ...newExpertise[index], [field]: newValue };
    setAboutForm({ ...aboutForm, expertise: newExpertise });
  };

  const handleStatsChange = (index: number, field: "value" | "label", newValue: string) => {
    const newStats = [...(aboutForm.stats || [])];
    while (newStats.length < 4) newStats.push({ value: "", label: "" });
    newStats[index] = { ...newStats[index], [field]: newValue };
    setAboutForm({ ...aboutForm, stats: newStats });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto px-8 py-16 lg:px-16">
        
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-end border-b border-white mb-24 pb-12 gap-8">
          <div>
            <h1 className="text-[18vw] lg:text-[180px] font-black leading-[0.75] tracking-tighter">
              ABOUT
            </h1>
            <p className="text-[10px] font-black tracking-[0.5em] uppercase mt-6 opacity-50">
              Profile / Narrative / Expertise
            </p>
          </div>

          <button
            onClick={() => onSave("about", getDataToSave())}
            disabled={saving}
            className="w-full lg:w-80 h-24 bg-white text-black hover:invert transition-all duration-500 flex items-center justify-center disabled:opacity-20"
          >
            <span className="text-xs font-black tracking-[0.4em] uppercase">
              {saving ? "UPLOADING..." : "COMMIT CHANGES"}
            </span>
          </button>
        </header>

        {/* TOP LEVEL CONFIG (TITLE & IMAGE) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/20 border border-white/20 mb-24">
          <div className="bg-black p-12">
            <label className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 mb-6 block">Section_Title</label>
            <input 
              value={aboutForm.title}
              onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value.toUpperCase() })}
              className="bg-transparent text-4xl font-black tracking-tighter outline-none w-full"
              placeholder="TITLE"
            />
          </div>
          <div className="bg-black p-12">
            <label className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 mb-6 block">Image_Asset_Path</label>
            <input 
              value={aboutForm.image}
              onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
              className="bg-transparent text-4xl font-black tracking-tighter outline-none w-full"
              placeholder="/PATH/TO/IMAGE.JPG"
            />
          </div>
        </section>

        {/* MAIN NARRATIVE (HEADING & BIO) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/20 border border-white/20 mb-24">
          <div className="lg:col-span-6 bg-black p-12">
            <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-8 block">Main_Heading</label>
            <textarea 
               value={aboutForm.heading}
               onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
               rows={5}
               className="bg-transparent text-3xl font-black leading-tight tracking-tight outline-none w-full resize-none"
               placeholder="HEADING_TEXT"
            />
          </div>
          <div className="lg:col-span-6 bg-zinc-950 p-12">
            <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-8 block">Extended_Bio</label>
            <textarea 
               value={aboutForm.bio}
               onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
               rows={8}
               className="bg-transparent text-xl font-medium leading-relaxed outline-none w-full resize-none"
               placeholder="BIOGRAPHY_CONTENT"
            />
          </div>
        </section>

        {/* EXPERTISE GRID */}
        <div className="mb-24">
          <h3 className="text-[10px] font-black tracking-[0.5em] uppercase mb-8 opacity-40">Core_Expertise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/20 border border-white/20">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-black p-10 hover:bg-zinc-900 transition-colors">
                <input 
                  value={aboutForm.expertise[i]?.title || ""}
                  onChange={(e) => handleExpertiseChange(i, "title", e.target.value.toUpperCase())}
                  placeholder="EXPERT_TITLE"
                  className="bg-transparent text-lg font-black tracking-tighter mb-4 outline-none w-full"
                />
                <textarea 
                  value={aboutForm.expertise[i]?.desc || ""}
                  onChange={(e) => handleExpertiseChange(i, "desc", e.target.value)}
                  placeholder="Service description..."
                  className="bg-transparent text-xs text-zinc-500 font-medium leading-relaxed outline-none w-full resize-none h-20"
                />
              </div>
            ))}
          </div>
        </div>

        {/* STATS GRID */}
        <div>
          <h3 className="text-[10px] font-black tracking-[0.5em] uppercase mb-8 opacity-40">System_Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/20 border border-white/20">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-black p-10 hover:bg-zinc-900 transition-colors">
                <input 
                  value={aboutForm.stats[i]?.label || ""}
                  onChange={(e) => handleStatsChange(i, "label", e.target.value.toUpperCase())}
                  placeholder="METRIC"
                  className="bg-transparent text-[10px] font-black tracking-[0.3em] uppercase mb-16 outline-none w-full opacity-30 focus:opacity-100"
                />
                <input 
                  value={aboutForm.stats[i]?.value || ""}
                  onChange={(e) => handleStatsChange(i, "value", e.target.value.toUpperCase())}
                  placeholder="00"
                  className="bg-transparent text-7xl font-black tracking-tighter outline-none w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-32 pt-12 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 pb-20">
          <div className="flex gap-12 text-[10px] font-black tracking-[0.2em]">
            <span>CONTENT_V2 / ABOUT</span>
            <span>2026_MASTER_ARCHIVE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}