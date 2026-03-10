"use client";

import { AboutData } from "@/lib/admin-types";

interface AboutEditorProps {
  aboutData: AboutData;
  aboutForm: AboutData;
  setAboutForm: (data: AboutData) => void;
  onSave: (section: string, data: AboutData) => Promise<void>;
  saving: boolean;
}

export default function AboutEditor({ aboutForm, setAboutForm, onSave, saving }: AboutEditorProps) {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">About Section</h1>
      
      <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
        <form className="space-y-4 lg:space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
            <input
              type="text"
              value={aboutForm.title}
              onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Subtitle</label>
            <input
              type="text"
              value={aboutForm.subtitle}
              onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Bio (one paragraph per line)</label>
            <textarea
              value={aboutForm.bio.join("\n\n")}
              onChange={(e) => {
                const bio = e.target.value.split("\n\n").filter(Boolean);
                setAboutForm({ ...aboutForm, bio });
              }}
              rows={6}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Skills (comma separated)</label>
            <input
              type="text"
              value={aboutForm.skills.join(", ")}
              onChange={(e) => {
                const skills = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                setAboutForm({ ...aboutForm, skills });
              }}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              placeholder="React, Next.js, TypeScript"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Stats (value,label - one per line)</label>
            <textarea
              value={aboutForm.stats.map(s => `${s.value},${s.label}`).join("\n")}
              onChange={(e) => {
                const stats = e.target.value.split("\n").filter(Boolean).map(line => {
                  const [value, label] = line.split(",");
                  return { value: value?.trim() || "0", label: label?.trim() || "" };
                });
                setAboutForm({ ...aboutForm, stats });
              }}
              rows={4}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
              placeholder="3+,Years Experience"
            />
          </div>

          <button
            type="button"
            onClick={() => onSave("about", aboutForm)}
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

