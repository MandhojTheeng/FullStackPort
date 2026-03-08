"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface FooterData {
  brand: { name: string; tagline: string };
  description: string;
  quickLinks: Array<{ name: string; href: string }>;
  builtWith: string[];
  copyright: string;
}

const defaultFooterData: FooterData = {
  brand: { name: "SANTOSH", tagline: "FULL STACK ARCHITECT" },
  description: "ENGINEERING SCALABLE DIGITAL ECOSYSTEMS FROM KATHMANDU TO THE WORLD.",
  quickLinks: [
    { name: "ABOUT", href: "#about" },
    { name: "PROJECTS", href: "#projects" },
    { name: "CONTACT", href: "#contact" }
  ],
  builtWith: ["NEXT.JS", "TAILWIND", "FRAMER"],
  copyright: "© {year} ALL RIGHTS RESERVED."
};

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await fetch(`/api/content?t=${Date.now()}`);
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        if (data && data.footer) setFooterData(data.footer);
      } catch (err) {
        console.error("Footer Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFooterData();
  }, []);

  if (loading) return <div className="h-40 bg-white border-t border-zinc-100" />;

  return (
    <footer className="bg-white text-black py-24 px-6 md:px-20 border-t border-zinc-200 uppercase selection:bg-black selection:text-white">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* 1. THE BIG BRANDING (LEFT) */}
          <div className="lg:col-span-6">
            <Link href="/" className="inline-block group">
              <h2 className="text-[10vw] lg:text-[6vw] font-black tracking-tighter leading-[0.8] transition-all group-hover:italic group-hover:tracking-normal">
                {footerData.brand.name}.
              </h2>
              <p className="text-[10px] font-black tracking-[0.6em] mt-4 opacity-30 group-hover:opacity-100 transition-opacity">
                {footerData.brand.tagline}
              </p>
            </Link>
            <div className="mt-12 max-w-sm">
              <p className="text-xs font-bold text-zinc-400 leading-loose normal-case italic">
                {footerData.description}
              </p>
            </div>
          </div>

          {/* 2. NAVIGATION & CONNECT (RIGHT) */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">
            
            {/* Index Column */}
            <div className="space-y-6">
              <span className="text-[10px] font-black tracking-[0.4em] opacity-20 block border-b border-zinc-100 pb-2">INDEX</span>
              <nav className="flex flex-col gap-3">
                {footerData.quickLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-xs font-bold hover:translate-x-1 transition-transform duration-300"
                  >
                    {link.name} //
                  </Link>
                ))}
              </nav>
            </div>

            {/* Socials Column */}
            <div className="space-y-6">
              <span className="text-[10px] font-black tracking-[0.4em] opacity-20 block border-b border-zinc-100 pb-2">SOCIAL</span>
              <nav className="flex flex-col gap-3">
                {['GITHUB', 'LINKEDIN', 'TWITTER'].map((s) => (
                  <a key={s} href="#" className="text-xs font-bold hover:italic transition-all">
                    {s}
                  </a>
                ))}
              </nav>
            </div>

            {/* Status Column */}
            <div className="space-y-6 col-span-2 md:col-span-1">
              <span className="text-[10px] font-black tracking-[0.4em] opacity-20 block border-b border-zinc-100 pb-2">STATUS</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold">READY_TO_BUILD</span>
                </div>
                <p className="text-[9px] font-mono text-zinc-400 leading-relaxed">
                  CURRENTLY_IN:<br/>KATHMANDU, NEPAL
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="mt-40 pt-10 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Logo / Small Mark */}
          <div className="flex items-center gap-6">
             <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-black text-[10px]">
               ST
             </div>
             <span className="text-[9px] font-mono text-zinc-400 tracking-[0.4em]">
               {footerData.copyright.replace("{year}", currentYear.toString())}
             </span>
          </div>

          {/* Tech Manifest */}
          <div className="flex items-center gap-2 text-[9px] font-black tracking-widest bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
            <span className="opacity-30">TECH_STACK:</span>
            {footerData.builtWith.map((tech, i) => (
              <React.Fragment key={tech}>
                <span className="text-black">{tech}</span>
                {i < footerData.builtWith.length - 1 && <span className="opacity-20 mx-1">/</span>}
              </React.Fragment>
            ))}
          </div>
          
        </div>

      </div>
    </footer>
  );
}