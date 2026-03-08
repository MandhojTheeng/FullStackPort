"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <section className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden flex flex-col uppercase relative">
      
      {/* 0. DATA GRID OVERLAY */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
           style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-between items-center p-8 border-b border-white/5 backdrop-blur-xl bg-black/60">
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter leading-none">SANTOSH TIMALSINA</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-[10px] opacity-60 tracking-[0.4em] font-bold">FULL STACK ARCHITECT</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-12 text-[10px] font-black tracking-[0.2em] opacity-40">
          <span>ROOT@SANTOSH_DEV:~$</span>
          <span>UPTIME: 99.9%</span>
        </div>
        <button className="bg-white text-black px-6 py-2 text-[11px] font-[1000] tracking-widest hover:bg-green-500 transition-all border border-white">
          HIRE_CONSULTANT
        </button>
      </nav>

      <div className="flex-grow pt-44 px-6 md:px-12 relative z-10">
        
        {/* 2. CORE HEADING - BIG & BOLD */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[11vw] font-[1000] leading-[0.8] tracking-[-0.07em]">
              FULL STACK<br />
              <span className="text-transparent stroke-text">DEVELOPMENT</span>
            </h1>
            <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
              <p className="text-sm font-bold opacity-50 max-w-xl leading-relaxed lowercase">
                From core server configuration to high-fidelity UI. <br/>
                I engineer the entire digital ecosystem for scale and speed.
              </p>
              <div className="h-[1px] w-24 bg-green-500 mt-3 hidden md:block" />
            </div>
          </motion.div>
        </div>

        {/* 3. EXPERTISE GRID (Fills the "Empty" feel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-y border-white/10 bg-zinc-950/20 backdrop-blur-sm">
          
          {/* COLUMN 1: SYSTEM LOGS (Visual density) */}
          <div className="lg:col-span-4 border-r border-white/10 p-10 font-mono text-[10px] space-y-3">
            <h4 className="text-green-500 mb-6 font-black tracking-[0.3em]">SERVICE MANIFEST</h4>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>01 SERVER_ADMIN</span><span className="text-green-500">ACTIVE</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>02 BACKEND_ENGINE</span><span className="text-green-500">ACTIVE</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>03 FRONTEND_UX</span><span className="text-green-500">ACTIVE</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>04 CMS_WORDPRESS</span><span className="text-green-500">ACTIVE</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>05 DB_OPTIMIZATION</span><span className="text-green-500">ACTIVE</span></div>
            
            <div className="pt-8 opacity-30 leading-relaxed lowercase">
              running diagnostics on distributed systems... <br/>
              all protocols established.
            </div>
          </div>

          {/* COLUMN 2: THE "EVERYTHING" BIO */}
          <div className="lg:col-span-8 p-10 lg:p-16 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-green-500 tracking-[0.4em]">END-TO-END</span>
                <p className="text-xl font-black leading-tight">
                  Server Configuration to Production. I handle Linux environments, Nginx, Docker, and Cloud Infra.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-green-500 tracking-[0.4em]">CMS & UI</span>
                <p className="text-xl font-black leading-tight">
                  Modern Web Apps or Enterprise WordPress. Custom themes, plugins, and pixel-perfect UI/UX.
                </p>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="flex flex-wrap gap-12 pt-10 border-t border-white/5">
              {[
                { label: "Frontend", val: "React/Next.js" },
                { label: "Backend", val: "Node/Python" },
                { label: "CMS", val: "WordPress/Headless" },
                { label: "DevOps", val: "AWS/Linux" }
              ].map((stat, i) => (
                <div key={i}>
                  <span className="block text-[9px] opacity-30 font-black mb-1 tracking-widest">{stat.label}</span>
                  <span className="text-xs font-black border-l-2 border-green-500 pl-3">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. TECH MARQUEE (The Infinite Loop) */}
      <div className="py-8 bg-white text-black overflow-hidden relative z-20 mt-20">
        <motion.div 
          className="flex gap-20 whitespace-nowrap text-[15px] font-[1000] tracking-[0.5em]"
          animate={{ x: [0, -1500] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {/* Repeated items for a smooth loop */}
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span>NGINX</span> 
              <span>DOCKER</span> 
              <span>WORDPRESS</span> 
              <span>REACT</span> 
              <span>NODE.JS</span> 
              <span>POSTGRESQL</span> 
              <span>AWS</span> 
              <span>TYPESCRIPT</span> 
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
}