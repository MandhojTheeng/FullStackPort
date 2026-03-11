"use client";

import { AboutData } from "@/lib/admin-types";

interface AboutEditorProps {
  aboutData: AboutData;
  aboutForm: AboutData;
  setAboutForm: (data: AboutData) => void;
  onSave: (section: string, data: AboutData) => Promise<void>;
  saving: boolean;
}

export default function AboutEditor({ aboutData, aboutForm, setAboutForm, onSave, saving }: AboutEditorProps) {
  // Ensure all required fields are present before saving
  const getDataToSave = () => {
    const expertise = aboutForm.expertise || [];
    const filledExpertise: Array<{ title: string; desc: string }> = [];
    for (let i = 0; i < 4; i++) {
      filledExpertise.push({
        title: expertise[i]?.title || "",
        desc: expertise[i]?.desc || ""
      });
    }

    const stats = aboutForm.stats || [];
    const filledStats: Array<{ value: string; label: string }> = [];
    for (let i = 0; i < 4; i++) {
      filledStats.push({
        value: stats[i]?.value || "",
        label: stats[i]?.label || ""
      });
    }

    return {
      title: aboutForm.title || "",
      heading: aboutForm.heading || "",
      bio: aboutForm.bio || "",
      image: aboutForm.image || "",
      expertise: filledExpertise,
      stats: filledStats
    };
  };

  // Handle expertise change for the 4 fixed expertise items
  const handleExpertiseChange = (index: number, field: "title" | "desc", newValue: string) => {
    const currentExpertise = aboutForm.expertise || [];
    const newExpertise: Array<{ title: string; desc: string }> = [];
    
    for (let i = 0; i < 4; i++) {
      if (i === index) {
        newExpertise.push({ 
          title: field === "title" ? newValue : (currentExpertise[i]?.title || ""),
          desc: field === "desc" ? newValue : (currentExpertise[i]?.desc || "")
        });
      } else {
        newExpertise.push({
          title: currentExpertise[i]?.title || "",
          desc: currentExpertise[i]?.desc || ""
        });
      }
    }
    
    setAboutForm({ ...aboutForm, expertise: newExpertise });
  };

  // Handle stats change for the 4 fixed stats
  const handleStatsChange = (index: number, field: "value" | "label", newValue: string) => {
    const currentStats = aboutForm.stats || [];
    const newStats: Array<{ value: string; label: string }> = [];
    
    for (let i = 0; i < 4; i++) {
      if (i === index) {
        newStats.push({ 
          value: field === "value" ? newValue : (currentStats[i]?.value || ""),
          label: field === "label" ? newValue : (currentStats[i]?.label || "")
        });
      } else {
        newStats.push({
          value: currentStats[i]?.value || "",
          label: currentStats[i]?.label || ""
        });
      }
    }
    
    setAboutForm({ ...aboutForm, stats: newStats });
  };

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">About Section</h1>
      
      <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
        <form className="space-y-4 lg:space-y-6">
          {/* Title */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Title</h3>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Section Title</label>
              <input
                type="text"
                value={aboutForm.title}
                onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                placeholder="The Architect"
              />
            </div>
          </div>

          {/* Image Path */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Image</h3>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Image Path</label>
              <input
                type="text"
                value={aboutForm.image}
                onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
                placeholder="/santosh.jpg"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Heading</h3>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Main Heading</label>
              <textarea
                value={aboutForm.heading}
                onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                rows={3}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
                placeholder="Santosh Timalsina is a Full Stack Developer..."
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Bio</h3>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Biography</label>
              <textarea
                value={aboutForm.bio}
                onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                rows={4}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
                placeholder="I bridge the gap between high-level business requirements..."
              />
            </div>
          </div>

          {/* Expertise Grid - 4 Fixed Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Expertise (4 items)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-16 shrink-0">Title:</span>
                    <input
                      type="text"
                      value={aboutForm.expertise[index]?.title || ""}
                      onChange={(e) => handleExpertiseChange(index, "title", e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-xs text-white placeholder:text-white/30"
                      placeholder="Expertise Title"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-16 shrink-0">Description:</span>
                    <input
                      type="text"
                      value={aboutForm.expertise[index]?.desc || ""}
                      onChange={(e) => handleExpertiseChange(index, "desc", e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-xs text-white placeholder:text-white/30"
                      placeholder="Expertise Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid - 4 Fixed Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stats (4 items)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-16 shrink-0">Value:</span>
                    <input
                      type="text"
                      value={aboutForm.stats[index]?.value || ""}
                      onChange={(e) => handleStatsChange(index, "value", e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-xs text-white placeholder:text-white/30"
                      placeholder="Stat Value"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-16 shrink-0">Label:</span>
                    <input
                      type="text"
                      value={aboutForm.stats[index]?.label || ""}
                      onChange={(e) => handleStatsChange(index, "label", e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-xs text-white placeholder:text-white/30"
                      placeholder="Stat Label"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSave("about", getDataToSave())}
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

