"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Project } from "@/lib/admin-types";

interface ProjectsProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Global E-Commerce",
    category: "Full Stack Systems",
    description: "High-performance storefront with automated inventory logic and global payment routing.",
    tech: ["Next.js", "PostgreSQL", "Stripe"],
    link: "#",
    featured: true,
    image: ""
  },
  {
    id: "2",
    title: "SaaS Analytics Engine",
    category: "Architecture & Data",
    description: "Processing millions of data points in real-time with zero-latency visualization.",
    tech: ["React", "Node.js", "D3.js"],
    link: "#",
    featured: true,
    image: ""
  },
  {
    id: "3",
    title: "Headless CMS Framework",
    category: "CMS & Performance",
    description: "Custom-built WordPress engine optimized for sub-second page loads and enterprise SEO.",
    tech: ["WordPress", "Next.js", "GraphQL"],
    link: "#",
    featured: false,
    image: ""
  }
];

export default function Projects({ projects: propProjects }: ProjectsProps) {
  const projects = propProjects || defaultProjects;
  return (
    /* Changed bg to white and text to black */
    <section className="bg-white text-black py-40 px-6 md:px-20 border-t border-black/5 selection:bg-black selection:text-white uppercase">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* 1. EDITORIAL HEADER */}
        <div className="flex flex-col mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            className="text-[10px] font-black tracking-[0.5em] mb-6 text-black"
          >
            Santosh Timalsina — Portfolio
          </motion.span>
          <h2 className="text-[12vw] lg:text-[10vw] font-black leading-[0.8] tracking-tighter mb-12">
            Selected<br/>Works.
          </h2>
          <div className="w-full h-[1px] bg-black/10" />
        </div>

        {/* 2. THE REFINED LIST */}
        <div className="space-y-0">
          {projects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative py-16 border-b border-black/10 grid grid-cols-1 lg:grid-cols-12 items-start lg:items-center hover:bg-black transition-colors duration-700 px-4 cursor-pointer"
            >
              <Link href={project.link || "#"} className="absolute inset-0 z-0" />
              <div className="lg:col-span-7 flex flex-col z-10">
                <span className="text-[10px] font-bold opacity-40 group-hover:text-white/60 group-hover:opacity-100 transition-colors mb-2 tracking-widest">
                  {project.category}
                </span>
                <h3 className="text-5xl md:text-7xl font-black tracking-tighter group-hover:text-white transition-colors duration-500">
                  {project.title}
                </h3>
              </div>

              <div className="lg:col-span-4 mt-8 lg:mt-0 z-10 lg:pr-8">
                <p className="text-lg text-zinc-500 group-hover:text-zinc-400 transition-colors duration-500 leading-tight mb-6 normal-case">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[9px] font-black tracking-widest border border-black/20 px-3 py-1 group-hover:border-white/20 group-hover:text-white transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1 hidden lg:flex justify-end opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 transition-all duration-500 z-10">
                <svg width="40" height="40" viewBox="0 0 60 60" fill="none" className="text-white">
                  <path d="M15 45L45 15M45 15H15M45 15V45" stroke="currentColor" strokeWidth="6" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. CENTERED CALL TO ACTION */}
        <div className="mt-40 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black tracking-[0.4em] opacity-30 mb-8">
              End of Selection
            </span>
            <button className="text-[8vw] md:text-[7vw] font-black tracking-tighter hover:text-green-600 transition-all duration-500 leading-none group text-black">
                HAVE A PROJECT?
                <div className="h-[2px] w-0 bg-green-600 group-hover:w-full transition-all duration-500 mx-auto mt-2" />
            </button>
            <p className="mt-12 text-zinc-400 text-sm font-bold tracking-widest max-w-xs normal-case italic">
              Currently accepting new full-stack and server-side engineering inquiries.
            </p>
        </div>
      </div>
    </section>
  );
}
