"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <section id="contact" className="bg-[#050505] text-white py-40 px-6 md:px-20 border-t border-white/5 uppercase selection:bg-white selection:text-black">
      <div className="max-w-screen-2xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* LEFT COLUMN: THE HOOK */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-[0.5em] text-green-500 mb-8 block">
                PROJECT INQUIRY 
              </span>
              <h2 className="text-[8vw] lg:text-[6vw] font-black leading-[0.9] tracking-tighter mb-12">
                READY TO<br/>SCALE?
              </h2>
              <p className="text-xl text-zinc-500 max-w-md normal-case leading-tight mb-12">
                Currently accepting new projects for 2026. Whether it is a server-side overhaul or a high-fidelity frontend, let's build something exceptional.
              </p>
            </div>

            <div className="space-y-8">
              <div className="group cursor-pointer" onClick={() => navigator.clipboard.writeText('timalsinasantosh19@gmail.com')}>
                <span className="text-[10px] font-bold opacity-30 block mb-2">EMAIL_OFFICE</span>
                <span className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-green-500 transition-colors lowercase">
                  timalsinasantosh19@gmail.com
                </span>
              </div>
              <div className="group">
                <span className="text-[10px] font-bold opacity-30 block mb-2">LOCATION_BASE</span>
                <span className="text-2xl md:text-3xl font-black tracking-tight">
                  KATHMANDU, NEPAL
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
                  className="h-full flex flex-col justify-center items-center text-center p-12 border border-white/10 bg-zinc-950"
                >
                  <div className="w-20 h-20 rounded-full border border-green-500 flex items-center justify-center mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-full animate-pulse" />
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
                      className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-black tracking-tighter focus:outline-none focus:border-white transition-colors placeholder:opacity-20"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 group-focus-within:w-full transition-all duration-500" />
                  </div>

                  <div className="relative group">
                    <input 
                      type="email" 
                      required
                      placeholder="EMAIL ADDRESS"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-black tracking-tighter focus:outline-none focus:border-white transition-colors placeholder:opacity-20"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 group-focus-within:w-full transition-all duration-500" />
                  </div>

                  <div className="relative group">
                    <textarea 
                      rows={4} 
                      required
                      placeholder="TELL ME ABOUT THE PROJECT"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-black tracking-tighter focus:outline-none focus:border-white transition-colors placeholder:opacity-20 resize-none"
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 group-focus-within:w-full transition-all duration-500" />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-8 bg-white text-black font-black text-xl tracking-[0.2em] hover:bg-green-500 transition-all duration-500 flex items-center justify-center gap-4"
                  >
                    {status === "submitting" ? "SENDING..." : "SEND INQUIRY"}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* FOOTER SOCIALS */}
        <div className="mt-40 pt-10 border-t border-white/5 flex flex-wrap gap-12 justify-between items-center">
            <div className="flex gap-12">
                {['GITHUB', 'LINKEDIN', 'TWITTER'].map((social) => (
                    <a key={social} href="#" className="text-[10px] font-black tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-green-500 transition-all">
                        {social}
                    </a>
                ))}
            </div>
            <span className="text-[9px] font-mono opacity-20 uppercase tracking-widest">
                © 2026 Santosh Timalsina 
            </span>
        </div>
      </div>
    </section>
  );
}