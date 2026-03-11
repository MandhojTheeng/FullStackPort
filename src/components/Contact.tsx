"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactData {
  heading: string;
  description: string;
  email: string;
  location: string;
  socialLinks: Array<{ name: string; url: string; icon: string }>;
  copyright: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [contactData, setContactData] = useState<ContactData | null>(null);

  useEffect(() => {
    // Fetch contact data from API
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data.contact) {
          setContactData(data.contact);
        }
      })
      .catch(err => console.error("Failed to load contact data:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => setStatus("success"), 1500);
  };

  // Use dynamic data or fallback to defaults
  const heading = contactData?.heading || "READY TO SCALE?";
  const description = contactData?.description || "Currently accepting new projects for 2026. Whether it is a server-side overhaul or a high-fidelity frontend, let's build something exceptional.";
  const email = contactData?.email || "timalsinasantosh19@gmail.com";
  const location = contactData?.location || "KATHMANDU, NEPAL";
  const socialLinks = contactData?.socialLinks || [
    { name: "GitHub", url: "https://github.com", icon: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
    { name: "Twitter", url: "https://twitter.com", icon: "twitter" }
  ];
  const copyright = contactData?.copyright || "© 2026 Santosh Timalsina";

  return (
    /* Changed to bg-white and text-black */
    <section id="contact" className="bg-white text-black py-40 px-6 md:px-20 border-t border-black/5 uppercase selection:bg-black selection:text-white">
      <div className="max-w-screen-2xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* LEFT COLUMN: THE HOOK */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-[0.5em] text-green-600 mb-8 block">
                PROJECT INQUIRY 
              </span>
              <h2 className="text-[8vw] lg:text-[6vw] font-black leading-[0.9] tracking-tighter mb-12">
                {heading.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </h2>
              <p className="text-xl text-zinc-500 max-w-md normal-case leading-tight mb-12">
                {description}
              </p>
            </div>

            <div className="space-y-8">
              <div 
                className="group cursor-pointer w-fit" 
                onClick={() => {
                  navigator.clipboard.writeText(email);
                  alert("Email copied to clipboard!");
                }}
              >
                <span className="text-[10px] font-bold opacity-30 block mb-2">EMAIL_OFFICE</span>
                <span className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-green-600 transition-colors lowercase">
                  {email}
                </span>
              </div>
              <div className="group">
                <span className="text-[10px] font-bold opacity-30 block mb-2">LOCATION_BASE</span>
                <span className="text-2xl md:text-3xl font-black tracking-tight">
                  {location}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: THE FORM */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  /* Adjusted for light mode success state */
                  className="h-full flex flex-col justify-center items-center text-center p-12 border border-black/5 bg-zinc-50 rounded-2xl"
                >
                  <div className="w-20 h-20 rounded-full border border-green-600 flex items-center justify-center mb-6">
                    <div className="w-10 h-10 bg-green-600 rounded-full animate-pulse" />
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter">MESSAGE_RECEIVED</h3>
                  <p className="text-zinc-500 mt-4 normal-case">I will review your brief and respond within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="relative group">
                    <input 
                      type="text" 
                      required
                      placeholder="YOUR NAME"
                      /* Changed border-white to border-black/10 */
                      className="w-full bg-transparent border-b border-black/10 py-4 text-2xl font-black tracking-tighter focus:outline-none focus:border-black transition-colors placeholder:text-black/20"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-600 group-focus-within:w-full transition-all duration-500" />
                  </div>

                  <div className="relative group">
                    <input 
                      type="email" 
                      required
                      placeholder="EMAIL ADDRESS"
                      className="w-full bg-transparent border-b border-black/10 py-4 text-2xl font-black tracking-tighter focus:outline-none focus:border-black transition-colors placeholder:text-black/20"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-600 group-focus-within:w-full transition-all duration-500" />
                  </div>

                  <div className="relative group">
                    <textarea 
                      rows={4} 
                      required
                      placeholder="TELL ME ABOUT THE PROJECT"
                      className="w-full bg-transparent border-b border-black/10 py-4 text-2xl font-black tracking-tighter focus:outline-none focus:border-black transition-colors placeholder:text-black/20 resize-none"
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-600 group-focus-within:w-full transition-all duration-500" />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === "submitting"}
                    /* Swapped colors: Button is now Black with White text */
                    className="w-full py-8 bg-black text-white font-black text-xl tracking-[0.2em] hover:bg-green-600 transition-all duration-500 flex items-center justify-center gap-4 group"
                  >
                    {status === "submitting" ? "SENDING..." : "SEND INQUIRY"}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current group-hover:translate-x-1 transition-transform">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* FOOTER SOCIALS */}
        <div className="mt-40 pt-10 border-t border-black/10 flex flex-wrap gap-12 justify-between items-center">
            <div className="flex gap-12">
                {socialLinks.map((social) => (
                    <a 
                      key={social.name} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black tracking-[0.3em] text-black opacity-40 hover:opacity-100 hover:text-green-600 transition-all"
                    >
                        {social.name.toUpperCase()}
                    </a>
                ))}
            </div>
            <span className="text-[9px] font-mono opacity-20 uppercase tracking-widest text-black">
                {copyright}
            </span>
        </div>
      </div>
    </section>
  );
}

