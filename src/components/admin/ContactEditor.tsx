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

  // Update form when contactData changes
  useEffect(() => {
    if (contactData) {
      setFormData(contactData);
    }
  }, [contactData]);
  const [newSocialLink, setNewSocialLink] = useState({ name: "", url: "", icon: "" });

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
    <div className="min-h-screen bg-black text-white font-mono pt-16">
      <div className="p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tighter mb-4">CONTACT SECTION</h1>
            <p className="text-zinc-400">Edit the contact section content</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Heading */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Heading
              </label>
              <input
                type="text"
                value={formData.heading}
                onChange={(e) => handleChange("heading", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xl font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-lg font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xl font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xl font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
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
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-lg font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
              />
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
                      type="url"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                      placeholder="URL"
                      className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      type="text"
                      value={link.icon}
                      onChange={(e) => handleSocialLinkChange(index, "icon", e.target.value)}
                      placeholder="Icon"
                      className="w-24 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(index)}
                      className="px-4 py-3 bg-red-900/30 text-red-500 hover:bg-red-900/50 transition-colors font-bold text-sm"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new social link */}
              <div className="flex gap-3 items-center pt-4 border-t border-zinc-800">
                <input
                  type="text"
                  value={newSocialLink.name}
                  onChange={(e) => setNewSocialLink(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="New social name"
                  className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  type="url"
                  value={newSocialLink.url}
                  onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="New social URL"
                  className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  type="text"
                  value={newSocialLink.icon}
                  onChange={(e) => setNewSocialLink(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="Icon"
                  className="w-24 bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="px-6 py-3 bg-green-900/30 text-green-500 hover:bg-green-900/50 transition-colors font-bold text-sm"
                >
                  ADD
                </button>
              </div>
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

