"use client";

import { FooterData } from "@/lib/admin-types";

interface FooterEditorProps {
  footerData: FooterData;
  footerForm: FooterData;
  setFooterForm: (data: FooterData) => void;
  onSave: (section: string, data: FooterData) => Promise<void>;
  saving: boolean;
}

export default function FooterEditor({ footerForm, setFooterForm, onSave, saving }: FooterEditorProps) {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">Footer</h1>
      
      <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
        <form className="space-y-4 lg:space-y-6">
          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Brand Name</label>
              <input
                type="text"
                value={footerForm.brand.name}
                onChange={(e) => setFooterForm({ ...footerForm, brand: { ...footerForm.brand, name: e.target.value } })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Tagline</label>
              <input
                type="text"
                value={footerForm.brand.tagline}
                onChange={(e) => setFooterForm({ ...footerForm, brand: { ...footerForm.brand, tagline: e.target.value } })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea
              value={footerForm.description}
              onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
              rows={3}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Quick Links (name,href - one per line)</label>
            <textarea
              value={footerForm.quickLinks.map(l => `${l.name},${l.href}`).join("\n")}
              onChange={(e) => {
                const quickLinks = e.target.value.split("\n").filter(Boolean).map(line => {
                  const [name, href] = line.split(",");
                  return { name: name?.trim() || "", href: href?.trim() || "#" };
                });
                setFooterForm({ ...footerForm, quickLinks });
              }}
              rows={4}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
              placeholder="About,#about"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Copyright Text</label>
            <input
              type="text"
              value={footerForm.copyright}
              onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
              placeholder="© {year} Santosh. All rights reserved."
            />
          </div>

          <button
            type="button"
            onClick={() => onSave("footer", footerForm)}
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

