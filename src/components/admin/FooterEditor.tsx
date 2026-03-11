"use client";

import { useState, useEffect } from "react";
import { FooterData } from "@/lib/admin-types";

interface FooterEditorProps {
  footerData: FooterData;
  onSave: (section: string, data: FooterData) => void;
  saving: boolean;
}

export default function FooterEditor({ footerData, onSave, saving }: FooterEditorProps) {
  const defaultFooterData: FooterData = {
    headingLine1: "",
    headingLine2: "",
    headingLine3: "",
    availabilityText: "",
    availabilitySubtext: "",
    navLinks: [],
    socialLinks: [],
    brandInitials: "",
    copyright: ""
  };

  const [formData, setFormData] = useState<FooterData>(footerData ? {
    ...defaultFooterData,
    ...footerData,
    navLinks: footerData.navLinks || [],
    socialLinks: footerData.socialLinks || []
  } : defaultFooterData);

  useEffect(() => {
    if (footerData) {
      setFormData({
        ...defaultFooterData,
        ...footerData,
        navLinks: footerData.navLinks || [],
        socialLinks: footerData.socialLinks || []
      });
    }
  }, [footerData]);

  const handleChange = (field: keyof FooterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddNavLink = () => {
    setFormData(prev => ({
      ...prev,
      navLinks: [...prev.navLinks, { name: "", href: "", desc: "" }]
    }));
  };

  const handleRemoveNavLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      navLinks: prev.navLinks.filter((_, i) => i !== index)
    }));
  };

  const handleNavLinkChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      navLinks: prev.navLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleAddSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: "", url: "", icon: "" }]
    }));
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
    onSave("footer", formData);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto px-8 py-16 lg:px-16">
        
        <header className="flex flex-col lg:flex-row justify-between items-end border-b border-white mb-24 pb-12 gap-8">
          <div>
            <h1 className="text-[18vw] lg:text-[180px] font-black leading-[0.75] tracking-tighter uppercase">
              FOOTER
            </h1>
            <p className="text-[10px] font-black tracking-[0.5em] uppercase mt-6 opacity-50">
              Terminal / Global / Navigation
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full lg:w-80 h-24 bg-white text-black hover:invert transition-all duration-500 flex items-center justify-center disabled:opacity-20"
          >
            <span className="text-xs font-black tracking-[0.4em] uppercase">
              {saving ? "SAVING..." : "COMMIT CHANGES"}
            </span>
          </button>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/20 border border-white/20 mb-24">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-black p-12">
              <label className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 mb-8 block">Heading Line 0{i}</label>
              <input
                type="text"
                value={(formData as any)[`headingLine${i}`]}
                onChange={(e) => handleChange(`headingLine${i}` as keyof FooterData, e.target.value.toUpperCase())}
                placeholder={`LINE 0${i}`}
                className="bg-transparent text-4xl lg:text-5xl font-black tracking-tighter outline-none w-full"
              />
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/20 border border-white/20 mb-24">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/20">
            <div className="bg-black p-12">
              <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-6 block">Availability Primary</label>
              <input
                type="text"
                value={formData.availabilityText}
                onChange={(e) => handleChange("availabilityText", e.target.value)}
                className="bg-transparent text-2xl font-black outline-none w-full uppercase"
              />
            </div>
            <div className="bg-black p-12">
              <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-6 block">Availability Meta</label>
              <input
                type="text"
                value={formData.availabilitySubtext}
                onChange={(e) => handleChange("availabilitySubtext", e.target.value)}
                className="bg-transparent text-2xl font-black outline-none w-full uppercase"
              />
            </div>
          </div>
          <div className="lg:col-span-4 bg-zinc-950 p-12 border-l border-white/20">
            <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-6 block">Brand Initials</label>
            <input
              type="text"
              value={formData.brandInitials}
              onChange={(e) => handleChange("brandInitials", e.target.value.toUpperCase())}
              className="bg-transparent text-6xl font-black tracking-tighter outline-none w-full"
            />
          </div>
        </section>

        <div className="mb-24">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40">Internal Navigation</h3>
            <button 
              type="button" 
              onClick={handleAddNavLink}
              className="text-[10px] font-black tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
            >
              + ADD LINK
            </button>
          </div>
          <div className="grid grid-cols-1 gap-px bg-white/20 border border-white/20">
            {formData.navLinks.map((link, index) => (
              <div key={index} className="bg-black p-8 flex flex-col lg:flex-row gap-8 items-center group">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleNavLinkChange(index, "name", e.target.value.toUpperCase())}
                  placeholder="NAME"
                  className="bg-transparent text-2xl font-black tracking-tighter outline-none w-full lg:w-1/4"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleNavLinkChange(index, "href", e.target.value)}
                  placeholder="HREF"
                  className="bg-transparent text-sm font-medium opacity-40 focus:opacity-100 outline-none w-full lg:w-1/4"
                />
                <input
                  type="text"
                  value={link.desc}
                  onChange={(e) => handleNavLinkChange(index, "desc", e.target.value)}
                  placeholder="DESCRIPTION"
                  className="bg-transparent text-sm font-medium opacity-40 focus:opacity-100 outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNavLink(index)}
                  className="text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white"
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40">Social Connect</h3>
            <button 
              type="button" 
              onClick={handleAddSocialLink}
              className="text-[10px] font-black tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
            >
              + ADD SOCIAL
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/20 border border-white/20">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="bg-black p-10 relative group">
                <div className="flex justify-between mb-8">
                   <input
                    type="text"
                    value={link.name}
                    onChange={(e) => handleSocialLinkChange(index, "name", e.target.value.toUpperCase())}
                    placeholder="PLATFORM"
                    className="bg-transparent text-lg font-black tracking-tighter outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialLink(index)}
                    className="text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    [X]
                  </button>
                </div>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                  placeholder="URL"
                  className="bg-transparent text-xs font-medium opacity-40 focus:opacity-100 outline-none w-full mb-4"
                />
                <input
                  type="text"
                  value={link.icon}
                  onChange={(e) => handleSocialLinkChange(index, "icon", e.target.value)}
                  placeholder="ICON ID"
                  className="bg-transparent text-[10px] font-black tracking-[0.2em] outline-none w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <section className="bg-black p-12 border border-white/20 mb-24">
          <label className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-6 block">Legal Copyright String</label>
          <input
            type="text"
            value={formData.copyright}
            onChange={(e) => handleChange("copyright", e.target.value)}
            className="bg-transparent text-xl font-medium outline-none w-full"
          />
        </section>

        <footer className="mt-32 pt-12 border-t border-white/20 flex justify-between items-center opacity-40 pb-20">
          <span className="text-[10px] font-black tracking-[0.2em]">FOOTER ADMIN MODULE</span>
          <span className="text-[10px] font-black tracking-[0.5em] uppercase">Noir Framework 2026</span>
        </footer>
      </div>
    </div>
  );
}