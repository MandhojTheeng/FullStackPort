"use client";

import { HeroData } from "@/lib/admin-types";

interface HeroEditorProps {
  heroData: HeroData;
  heroForm: HeroData;
  setHeroForm: (data: HeroData) => void;
  onSave: (section: string, data: HeroData) => Promise<void>;
  saving: boolean;
}

export default function HeroEditor({ heroForm, setHeroForm, onSave, saving }: HeroEditorProps) {
  // Ensure all required fields are present before saving
  const getDataToSave = () => {
    const stats = heroForm.stats || [];
    const filledStats: Array<{ label: string; value: string }> = [];
    for (let i = 0; i < 4; i++) {
      filledStats.push({
        label: stats[i]?.label || "",
        value: stats[i]?.value || ""
      });
    }
    
    return {
      headingLine1: heroForm.headingLine1 || "",
      headingLine2: heroForm.headingLine2 || "",
      headingLine3: heroForm.headingLine3 || "",
      subtitle: heroForm.subtitle || "",
      role: heroForm.role || "",
      description: heroForm.description || "",
      stats: filledStats,
      ctaPrimary: heroForm.ctaPrimary || "",
      ctaSecondary: heroForm.ctaSecondary || "",
      ctaPrimaryLink: heroForm.ctaPrimaryLink || "",
      ctaSecondaryLink: heroForm.ctaSecondaryLink || "",
      image: heroForm.image || "",
      socialLinks: heroForm.socialLinks || []
    };
  };

  // Handle stats change for the 4 fixed stats
  const handleStatsChange = (index: number, field: "label" | "value", newValue: string) => {
    const currentStats = heroForm.stats || [];
    const newStats: Array<{ label: string; value: string }> = [];
    
    for (let i = 0; i < 4; i++) {
      if (i === index) {
        newStats.push({ 
          label: field === "label" ? newValue : (currentStats[i]?.label || ""),
          value: field === "value" ? newValue : (currentStats[i]?.value || "")
        });
      } else {
        newStats.push({
          label: currentStats[i]?.label || "",
          value: currentStats[i]?.value || ""
        });
      }
    }
    
    setHeroForm({ ...heroForm, stats: newStats });
  };

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">Hero Section</h1>
      
      <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
        <form className="space-y-4 lg:space-y-6">
          {/* Heading Lines */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Heading</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Line 1</label>
                <input
                  type="text"
                  value={heroForm.headingLine1}
                  onChange={(e) => setHeroForm({ ...heroForm, headingLine1: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                  placeholder="ARCHITECTING"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Line 2</label>
                <input
                  type="text"
                  value={heroForm.headingLine2}
                  onChange={(e) => setHeroForm({ ...heroForm, headingLine2: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                  placeholder="DIGITAL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Line 3</label>
                <input
                  type="text"
                  value={heroForm.headingLine3}
                  onChange={(e) => setHeroForm({ ...heroForm, headingLine3: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                  placeholder="SYSTEMS."
                />
              </div>
            </div>
          </div>

          {/* Subtitle and Role */}
          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Subtitle</label>
              <input
                type="text"
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                placeholder="Full Stack Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Role</label>
              <input
                type="text"
                value={heroForm.role}
                onChange={(e) => setHeroForm({ ...heroForm, role: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                placeholder="Systems Engineer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              rows={3}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
              placeholder="I build high-performance web environments..."
            />
          </div>

          {/* Stats Grid - 4 Fixed Items */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/70">Stats (4 items)</label>
            <div className="grid md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-16 shrink-0">Label:</span>
                    <input
                      type="text"
                      value={heroForm.stats[index]?.label || ""}
                      onChange={(e) => handleStatsChange(index, "label", e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-xs text-white placeholder:text-white/30"
                      placeholder="Stat Label"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-16 shrink-0">Value:</span>
                    <input
                      type="text"
                      value={heroForm.stats[index]?.value || ""}
                      onChange={(e) => handleStatsChange(index, "value", e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-xs text-white placeholder:text-white/30"
                      placeholder="Stat Value"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSave("hero", getDataToSave())}
            disabled={saving}
            className="w-full py-2.5 lg:py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 text-sm lg:text-base"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

