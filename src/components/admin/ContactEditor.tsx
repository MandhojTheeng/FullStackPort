"use client";

import { useState, useEffect } from "react";
import { ContactData } from "@/lib/admin-types";

interface ContactEditorProps {
  contactData: ContactData;
  onSave: (section: string, data: ContactData) => void;
  saving: boolean;
}

export default function ContactEditor({ contactData, onSave, saving }: ContactEditorProps) {
  const [formData, setFormData] = useState<ContactData>(contactData || {
    heading: "",
    description: "",
    email: "",
    location: "",
    socialLinks: [],
    copyright: ""
  });

  const [newSocialLink, setNewSocialLink] = useState({ name: "", url: "", icon: "" });

  useEffect(() => {
    if (contactData) {
      setFormData(contactData);
    }
  }, [contactData]);

  const handleChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSocialLink = () => {
    if (newSocialLink.name && newSocialLink.url) {
      setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { ...newSocialLink }]
      }));
      setNewSocialLink({ name: "", url: "", icon: "" });
    }
  };

  const handleRemoveSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave("contact", formData);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto px-8 py-16 lg:px-16">
        
        <header className="flex flex-col lg:flex-row justify-between items-end border-b border-white mb-24 pb-12 gap-8">
          <div>
            <h1 className="text-[18vw] lg:text-[180px] font-black leading-[0.75] tracking-tighter uppercase">
              CONTACT
            </h1>
            <p className="text-[10px] font-black tracking-[0.5em] uppercase mt-6 opacity-50">
              Communication / Outreach / Connection
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full lg:w-80 h-24 bg-white text-black hover:invert transition-all duration-500 flex items-center justify-center disabled:opacity-20"
          >
            <span className="text-xs font-black tracking-[0.4em] uppercase">
              {saving ? "TRANSMITTING..." : "COMMIT CHANGES"}
            </span>
          </button>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/20 border border-white/20 mb-24">
          <div className="lg:col-span-7 bg-black p-12">
            <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-8 block">Inquiry Heading</label>
            <input
              type="text"
              value={formData.heading}
              onChange={(e) => handleChange("heading", e.target.value.toUpperCase())}
              className="bg-transparent text-5xl lg:text-7xl font-black tracking-tighter outline-none w-full"
              placeholder="LET'S TALK"
            />
          </div>
          <div className="lg:col-span-5 bg-zinc-950 p-12">
            <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-8 block">Project Brief Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="bg-transparent text-xl font-medium leading-tight outline-none w-full resize-none"
              placeholder="Describe the call to action..."
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/20 border border-white/20 mb-24">
          <div className="bg-black p-12 group">
            <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-6 block">Direct Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-transparent text-3xl font-black outline-none w-full hover:pl-4 transition-all"
              placeholder="EMAIL@DOMAIN.COM"
            />
          </div>
          <div className="bg-black p-12 group">
            <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-6 block">Current Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value.toUpperCase())}
              className="bg-transparent text-3xl font-black outline-none w-full hover:pl-4 transition-all"
              placeholder="CITY, COUNTRY"
            />
          </div>
        </section>

        <div className="mb-24">
          <h3 className="text-[10px] font-black tracking-[0.5em] uppercase mb-8 opacity-40">Digital Presence</h3>
          
          <div className="grid grid-cols-1 gap-px bg-white/20 border border-white/20 mb-px">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="bg-black p-8 flex flex-col lg:flex-row gap-8 items-center group">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleSocialLinkChange(index, "name", e.target.value.toUpperCase())}
                  placeholder="PLATFORM"
                  className="bg-transparent text-2xl font-black tracking-tighter outline-none w-full lg:w-1/4"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                  placeholder="URL ENDPOINT"
                  className="bg-transparent text-sm font-medium opacity-40 focus:opacity-100 outline-none w-full lg:w-1/3"
                />
                <input
                  type="text"
                  value={link.icon}
                  onChange={(e) => handleSocialLinkChange(index, "icon", e.target.value)}
                  placeholder="ICON ID"
                  className="bg-transparent text-[10px] font-black tracking-[0.2em] outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white"
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/20 border-x border-b border-white/20">
            <div className="lg:col-span-3 bg-zinc-900/50 p-6">
              <input
                type="text"
                value={newSocialLink.name}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, name: e.target.value }))}
                placeholder="NEW_NAME"
                className="bg-transparent text-xs font-black tracking-widest outline-none w-full"
              />
            </div>
            <div className="lg:col-span-5 bg-zinc-900/50 p-6 border-l border-white/20">
              <input
                type="url"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="NEW_URL"
                className="bg-transparent text-xs font-medium outline-none w-full"
              />
            </div>
            <div className="lg:col-span-2 bg-zinc-900/50 p-6 border-l border-white/20">
              <input
                type="text"
                value={newSocialLink.icon}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="ICON"
                className="bg-transparent text-xs font-black outline-none w-full"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="lg:col-span-2 bg-white text-black font-black text-[10px] tracking-widest uppercase hover:invert transition-all"
            >
              ADD NEW
            </button>
          </div>
        </div>

        <section className="bg-black p-12 border border-white/20 mb-24">
          <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-6 block">Legal Statement</label>
          <input
            type="text"
            value={formData.copyright}
            onChange={(e) => handleChange("copyright", e.target.value)}
            className="bg-transparent text-xl font-medium outline-none w-full"
            placeholder="© 2026 ALL RIGHTS RESERVED"
          />
        </section>

        <footer className="mt-32 pt-12 border-t border-white/20 flex justify-between items-center opacity-40 pb-20">
          <span className="text-[10px] font-black tracking-[0.2em]">CONTACT ADMIN INTERFACE</span>
          <span className="text-[10px] font-black tracking-[0.5em] uppercase">SYSTEM ACTIVE</span>
        </footer>
      </div>
    </div>
  );
}