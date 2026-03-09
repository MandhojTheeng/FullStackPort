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

      {/* REPLACED OLD NAV WITH A SPACER WRAPPER */}
      <div className="flex-grow pt-32 md:pt-44 px-6 md:px-12 relative z-10">
        
        {/* 1. CORE HEADING */}
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

        {/* 2. EXPERTISE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-y border-white/10 bg-zinc-950/20 backdrop-blur-sm">
          <div className="lg:col-span-4 border-r border-white/10 p-10 font-mono text-[10px] space-y-3">
            <h4 className="text-green-500 mb-6 font-black tracking-[0.3em]">SERVICE MANIFEST</h4>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>01 SERVER_ADMIN</span><span className="text-green-500">ACTIVE</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>02 BACKEND_ENGINE</span><span className="text-green-500">ACTIVE</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>03 FRONTEND_UX</span><span className="text-green-500">ACTIVE</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>04 CMS_WORDPRESS</span><span className="text-green-500">ACTIVE</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1"><span>05 DB_OPTIMIZATION</span><span className="text-green-500">ACTIVE</span></div>
          </div>

          <div className="lg:col-span-8 p-10 lg:p-16 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-green-500 tracking-[0.4em]">END-TO-END</span>
                <p className="text-xl font-black leading-tight">Server Configuration to Production. Linux, Nginx, Docker, and Cloud.</p>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-green-500 tracking-[0.4em]">CMS & UI</span>
                <p className="text-xl font-black leading-tight">Modern Web Apps or Enterprise WordPress. Pixel-perfect UI/UX.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TECH MARQUEE */}
      <div className="py-8 bg-white text-black overflow-hidden relative z-20 mt-20">
        <motion.div 
          className="flex gap-20 whitespace-nowrap text-[15px] font-[1000] tracking-[0.5em]"
          animate={{ x: [0, -1500] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span>NGINX</span> <span>DOCKER</span> <span>WORDPRESS</span> <span>REACT</span> <span>NODE.JS</span> 
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