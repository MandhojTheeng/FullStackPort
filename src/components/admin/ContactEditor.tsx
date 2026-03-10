"use client";

import { ContactData } from "@/lib/admin-types";

interface ContactEditorProps {
  contactData: ContactData;
  contactForm: ContactData;
  setContactForm: (data: ContactData) => void;
  onSave: (section: string, data: ContactData) => Promise<void>;
  saving: boolean;
}

export default function ContactEditor({ contactForm, setContactForm, onSave, saving }: ContactEditorProps) {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">Contact Info</h1>
      
      <div className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
        <form className="space-y-4 lg:space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
            <input
              type="text"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Location</label>
            <input
              type="text"
              value={contactForm.location}
              onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all text-sm lg:text-base text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Social Links (name,url - one per line)</label>
            <textarea
              value={contactForm.socialLinks.map(s => `${s.name},${s.url}`).join("\n")}
              onChange={(e) => {
                const socialLinks = e.target.value.split("\n").filter(Boolean).map(line => {
                  const [name, url] = line.split(",");
                  return { name: name?.trim() || "", url: url?.trim() || "", icon: "custom" };
                });
                setContactForm({ ...contactForm, socialLinks });
              }}
              rows={4}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none transition-all resize-none text-sm lg:text-base text-white placeholder:text-white/30"
              placeholder="GitHub,https://github.com"
            />
          </div>

          <button
            type="button"
            onClick={() => onSave("contact", contactForm)}
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

