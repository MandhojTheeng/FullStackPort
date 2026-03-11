"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { HeroData } from "@/lib/admin-types";

interface HeroProps {
  heroData?: HeroData;
}

export default function Hero({ heroData }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Use hero data from props, fallback to default values if not provided
  const headingLine1 = heroData?.headingLine1 || "ARCHITECTING";
  const headingLine2 = heroData?.headingLine2 || "DIGITAL";
  const headingLine3 = heroData?.headingLine3 || "SYSTEMS.";
  const subtitle = heroData?.subtitle || "Full Stack Developer";
  const role = heroData?.role || "Systems Engineer";
  const description = heroData?.description || "I build high-performance web environments. From deep-level server configuration (Nginx, Docker) to front-end experiences that actually convert. My code isn't just \"functional\"—it's an asset.";
  const stats = heroData?.stats || [
    { label: "Core Stack", value: "Node / React" },
    { label: "Cloud", value: "AWS / Docker" },
    { label: "Performance", value: "99+ Lighthouse" },
    { label: "UI/UX", value: "Framer / Figma" },
  ];

  return (
    <section className="min-h-screen bg-[#F0F0F0] text-black font-sans selection:bg-black selection:text-white overflow-hidden flex flex-col relative">
      
      {/* 0. OVERLAY NOISE (Texture) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-50 contrast-150 brightness-100" 
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />

      <div className="flex-grow flex flex-col relative pt-16 md:pt-24">
        
        {/* BIG NUMERIC INDICATOR - Adjusted for mobile visibility */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 text-[12vw] md:text-[10vw] font-black opacity-[0.03] leading-none pointer-events-none">
          01
        </div>

        {/* MAIN TYPEFACE SECTION */}
        <div className="px-5 sm:px-8 md:px-12 lg:px-20 py-8 md:py-12">
          <motion.div 
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Using clamp() for fluid typography: min, preferred, max */}
            <h1 className="text-[clamp(3.5rem,15vw,14rem)] font-[1000] leading-[0.8] tracking-[-0.06em] uppercase">
              {headingLine1}<br />
              <div className="flex items-center gap-4">
                <span>{headingLine2}</span>
                <span className="h-[2px] flex-grow bg-black mt-[2vw] hidden lg:block" />
              </div>
              {headingLine3}
            </h1>
          </motion.div>

          <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-4 space-y-2">
              <p className="text-lg md:text-xl font-bold leading-tight uppercase tracking-tighter">
                {subtitle} <br className="hidden md:block"/> 
                <span className="text-zinc-400">& {role}.</span>
              </p>
            </div>

            <div className="lg:col-span-8 lg:pl-20">
              <p className="text-base md:text-lg font-medium leading-relaxed max-w-xl italic opacity-80">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* THE "STAMP" GRID (Bottom Section) */}
        {/* Responsive fix: 1 col on tiny mobile, 2 cols on tablet, 4 on desktop */}
        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-black uppercase">
          {stats.map((item, i) => (
            <div 
              key={i} 
              className="p-6 md:p-8 border-b sm:border-b-0 sm:border-r last:border-r-0 border-black/10 hover:bg-white transition-colors cursor-default group"
            >
              <p className="text-[10px] font-black text-zinc-400 mb-1 md:mb-2 group-hover:text-black transition-colors">
                {item.label}
              </p>
              <p className="text-sm md:text-base font-black italic sm:not-italic">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
