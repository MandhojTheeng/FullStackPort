"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { AboutData } from "@/lib/admin-types";

interface AboutProps {
  aboutData: AboutData;
}

export default function About({ aboutData }: AboutProps) {
  const stats = aboutData.stats || [];
  const expertises = aboutData.expertise || [];

  return (
    <section id="about" className="bg-black text-white py-32 px-6 md:px-12 selection:bg-green-500">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. THE STATEMENT & IMAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-start">
          <div className="lg:col-span-4 space-y-8">
            <span className="text-green-500 font-bold tracking-[0.3em] text-[10px] uppercase block">
              {aboutData.title}
            </span>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 border border-white/5 group"
            >
              <Image 
                src={aboutData.image || "/santosh.jpg"} 
                alt="Santosh Timalsina"
                fill
                className="object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out" 
                priority
              />
              <div className="absolute top-0 left-0 w-6 h-[1px] bg-white/30" />
              <div className="absolute top-0 left-0 w-[1px] h-6 bg-white/30" />
              <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-white/30" />
              <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-white/30" />
            </motion.div>
          </div>

          <div className="lg:col-span-8 lg:pt-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-medium leading-[1.1] tracking-tight"
            >
              {aboutData.heading}
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
              {aboutData.bio}
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
