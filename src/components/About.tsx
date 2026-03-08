"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image"; // Optimization for Next.js

export default function About() {
  const stats = [
    { value: "03", label: "Years in Stack" },
    { value: "24", label: "Systems Deployed" },
    { value: "12", label: "Global Clients" },
    { value: "99", label: "Uptime Focus" },
  ];

  const expertises = [
    { title: "Infrastructure", desc: "Server Config, Nginx, Docker, AWS, Security Protocols." },
    { title: "Development", desc: "Full Stack Architect. Node.js, Python, React, Next.js." },
    { title: "CMS Solutions", desc: "Expert WordPress, Custom Themes, Headless Architectures." },
    { title: "Interface", desc: "Pixel-perfect UI, Fluid Motion, User-Centric Logic." }
  ];

  return (
    <section id="about" className="bg-black text-white py-32 px-6 md:px-12 selection:bg-green-500">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. THE STATEMENT & IMAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-start">
          <div className="lg:col-span-4 space-y-8">
            <span className="text-green-500 font-bold tracking-[0.3em] text-[10px] uppercase block">
              The Architect
            </span>
            
            {/* PROFILE IMAGE CONTAINER */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] w-full grayscale hover:grayscale-0 transition-all duration-700 border border-white/10 overflow-hidden bg-zinc-900"
            >
              <Image 
                src="/profile.jpg" 
                alt="Santosh Timalsina"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle Overlay Decor */}
              <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none" />
            </motion.div>
          </div>

          <div className="lg:col-span-8 lg:pt-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-medium leading-[1.1] tracking-tight"
            >
              Santosh Timalsina is a <span className="text-zinc-500">Full Stack Developer</span> specialized in the entire digital lifecycle—from the raw <span className="text-zinc-500">server metal</span> to the final <span className="text-zinc-500">pixel of UI.</span>
            </motion.h2>
          </div>
        </div>

        {/* 2. THE EXPERTISE GRID (Clean & Spaced) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 border-t border-white/10 pt-16">
          {expertises.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <span className="text-[10px] font-mono opacity-30">0{i + 1} //</span>
              <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium lowercase">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 3. THE BIO (Direct & Human) */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-400">
              I bridge the gap between high-level business requirements and low-level technical execution. Whether it is configuring a <span className="text-white font-bold">Linux environment</span>, building a <span className="text-white font-bold">custom WordPress CMS</span>, or scaling <span className="text-white font-bold">Node.js APIs</span>, I deliver software that is as reliable as it is beautiful.
            </p>
          </div>
          
          {/* STATS - Vertical Stack */}
          <div className="lg:col-span-4 lg:col-start-9 space-y-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-baseline justify-between border-b border-white/5 pb-4">
                <span className="text-sm font-bold opacity-30 uppercase tracking-widest">{stat.label}</span>
                <span className="text-5xl font-black tracking-tighter">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}