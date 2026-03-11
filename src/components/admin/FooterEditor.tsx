"use client";

import { useState, useEffect } from "react";
import { FooterData } from "@/lib/admin-types";

interface FooterEditorProps {
  footerData: FooterData;
  onSave: (section: string, data: FooterData) => void;
  saving: boolean;
}

export default function FooterEditor({ footerData, onSave, saving }: FooterEditorProps) {
  // Ensure we have default values even if footerData is undefined or missing properties
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

  // Update form when footerData changes
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
    <div className="min-h-screen bg-black text-white font-mono pt-16">
      <div className="p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tighter mb-4">FOOTER SECTION</h1>
            <p className="text-zinc-400">Edit the footer section content</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Heading Lines */}
            <div className="space-y-4">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Heading Lines
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={formData.headingLine1}
                  onChange={(e) => handleChange("headingLine1", e.target.value)}
                  placeholder="Line 1 (e.g., TURNING)"
                  className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  type="text"
                  value={formData.headingLine2}
                  onChange={(e) => handleChange("headingLine2", e.target.value)}
                  placeholder="Line 2 (e.g., COMPLEX IDEAS)"
                  className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  type="text"
                  value={formData.headingLine3}
                  onChange={(e) => handleChange("headingLine3", e.target.value)}
                  placeholder="Line 3 (e.g., INTO REALITY)"
                  className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Availability Section */}
            <div className="space-y-4">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Availability Section
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.availabilityText}
                  onChange={(e) => handleChange("availabilityText", e.target.value)}
                  placeholder="Available for Worldwide"
                  className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  type="text"
                  value={formData.availabilitySubtext}
                  onChange={(e) => handleChange("availabilitySubtext", e.target.value)}
                  placeholder="Remote & Freelance"
                  className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Brand Initials */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Brand Initials
              </label>
              <input
                type="text"
                value={formData.brandInitials}
                onChange={(e) => handleChange("brandInitials", e.target.value)}
                placeholder="ST"
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-lg font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Copyright Text
              </label>
              <input
                type="text"
                value={formData.copyright}
                onChange={(e) => handleChange("copyright", e.target.value)}
                placeholder="© {year} Your Name. All rights reserved"
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-lg font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Navigation Links
              </label>
              
              <div className="space-y-3">
                {formData.navLinks.map((link, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => handleNavLinkChange(index, "name", e.target.value)}
                      placeholder="Name"
                      className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => handleNavLinkChange(index, "href", e.target.value)}
                      placeholder="href (e.g., #about)"
                      className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      type="text"
                      value={link.desc}
                      onChange={(e) => handleNavLinkChange(index, "desc", e.target.value)}
                      placeholder="Description"
                      className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNavLink(index)}
                      className="px-4 py-3 bg-red-900/30 text-red-500 hover:bg-red-900/50 transition-colors font-bold text-sm"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddNavLink}
                className="px-6 py-3 bg-green-900/30 text-green-500 hover:bg-green-900/50 transition-colors font-bold text-sm"
              >
                + ADD NAVIGATION LINK
              </button>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Social Links
              </label>
              
              <div className="space-y-3">
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => handleSocialLinkChange(index, "name", e.target.value)}
                      placeholder="Name (e.g., GitHub)"
                      className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                      placeholder="URL (e.g., https://github.com)"
                      className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      type="text"
                      value={link.icon}
                      onChange={(e) => handleSocialLinkChange(index, "icon", e.target.value)}
                      placeholder="Icon (e.g., github)"
                      className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(index)}
                      className="px-4 py-3 bg-red-900/30 text-red-500 hover:bg-red-900/50 transition-colors font-bold text-sm"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddSocialLink}
                className="px-6 py-3 bg-green-900/30 text-green-500 hover:bg-green-900/50 transition-colors font-bold text-sm"
              >
                + ADD SOCIAL LINK
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-6 bg-white text-black font-black text-lg tracking-[0.2em] hover:bg-green-600 hover:text-white hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

