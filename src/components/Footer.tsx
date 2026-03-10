"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = [
  { name: "About", href: "#about", desc: "The Architect" },
  { name: "Projects", href: "#projects", desc: "Selected Works" },
  { name: "Blog", href: "/blog", desc: "Insights & Thoughts" },
  { name: "Contact", href: "#contact", desc: "Start Conversation" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020202] text-[#f0f0f0] pt-40 pb-10 px-6 md:px-12 selection:bg-emerald-500 selection:text-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[30vw] font-black leading-none -ml-4 tracking-tighter uppercase">
          SANTOSH
        </h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-8 items-end">
          
          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-4xl md:text-6xl font-light leading-[1.1] tracking-tight">
                TURNING<br />
                <span className="font-bold text-emerald-400 uppercase tracking-tight">COMPLEX IDEAS</span> <br />
                INTO REALITY
              </h3>
              <div className="h-px w-24 bg-emerald-500/50" />
            </motion.div>

            <div className="grid grid-cols-2 gap-8 text-[11px] uppercase tracking-[0.22em] font-bold text-zinc-500">
              <div className="space-y-2">
                <p>Available for Worldwide</p>
                <p className="text-white/40">Remote & Freelance</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <nav className="w-full max-w-md">
              <ul className="divide-y divide-white/10">
                {footerLinks.map((item, idx) => (
                  <li key={item.name} className="group overflow-hidden">
                    <Link href={item.href} className="flex justify-between items-center py-8 group-hover:px-4 transition-all duration-500 ease-in-out">
                      <div className="relative">
                        <span className="text-[10px] font-mono text-emerald-500 absolute -left-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                          0{idx + 1}
                        </span>
                        <h4 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter transition-all">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600 group-hover:text-emerald-400 transition-colors">
                        {item.desc}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-40 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12 text-zinc-600">
          
          <div className="flex items-center gap-6">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08]">
              <span className="text-sm font-semibold tracking-tight text-white">
                ST
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                © {currentYear} Santosh Timalsina
              </span>
              
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.03] p-2 rounded-2xl border border-white/10">
            {['GH', 'LI', 'TW', 'IG'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="w-10 h-10 flex items-center justify-center text-[10px] font-bold rounded-xl border border-transparent hover:border-white/10 hover:bg-white/[0.08] hover:text-emerald-400 transition-all duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}