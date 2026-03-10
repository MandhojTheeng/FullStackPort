"use client";

import { Project, BlogPost } from "@/lib/admin-types";
import { motion } from "framer-motion";
import { FiPlus, FiArrowUpRight } from "react-icons/fi";

interface DashboardProps {
  projects: Project[];
  blogPosts: BlogPost[];
  onNavigate: (tab: "hero" | "projects" | "settings") => void;
}

export default function Dashboard({ projects, blogPosts, onNavigate }: DashboardProps) {
  return (
    <div className="min-h-screen bg-black text-white font-mono pt-16 selection:bg-white selection:text-black">
      <div className="p-6 lg:p-12 space-y-0">
        
        <header className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/20 pb-12">
          <div className="flex flex-col justify-between">
            <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase">
              INDEX
            </h1>
            <div className="flex items-center gap-4 mt-6">
              <span className="h-2 w-2 bg-green-500 rounded-full" />
              <span className="text-[10px] tracking-[0.5em] opacity-40 uppercase">Root Access Granted</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-end items-start md:items-end">
            <button 
              onClick={() => onNavigate("projects")}
              className="group flex items-center gap-4 border border-white p-6 hover:bg-white hover:text-black transition-all duration-500"
            >
              <span className="text-xs font-bold tracking-[0.3em] uppercase">Add New Project</span>
              <FiPlus className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 border-b border-white/20">
          <MetricBlock label="Project Count" value={projects.length} />
          <MetricBlock label="Blog Entries" value={blogPosts.length} />
          <MetricBlock label="Featured Flags" value={projects.filter(p => p.featured).length} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3">
          <Tile label="HERO CONFIG" onClick={() => onNavigate("hero")} />
          <Tile label="PROJECT VAULT" onClick={() => onNavigate("projects")} />
          <Tile label="SYSTEM SETTINGS" onClick={() => onNavigate("settings")} />
        </section>

        <footer className="mt-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-t border-white/10 pt-8 opacity-40">
          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-widest">Database Sync</span>
              <div className="w-32 h-[1px] bg-white/20 relative">
                <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="absolute inset-y-0 left-0 bg-white" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-widest">Environment</span>
              <span className="text-[10px] text-green-500 tracking-tighter font-bold">PRODUCTION_STABLE</span>
            </div>
          </div>
          <p className="text-[9px] tracking-[0.5em]">AUTH_CORE_V3</p>
        </footer>
      </div>
    </div>
  );
}

function MetricBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-8 lg:p-12 border-r border-white/20 last:border-r-0 group">
      <p className="text-[10px] opacity-30 uppercase tracking-[0.4em] mb-8 group-hover:opacity-100 transition-opacity">
        {label}
      </p>
      <p className="text-8xl lg:text-[10rem] font-black tracking-tighter leading-none">
        {value.toString().padStart(2, '0')}
      </p>
    </div>
  );
}

function Tile({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative h-48 lg:h-64 border-r border-b border-white/20 last:border-r-0 flex items-center justify-center group overflow-hidden"
    >
      <motion.div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.19,1,0.22,1]" />
      <span className="relative z-10 text-xs font-bold tracking-[0.4em] group-hover:text-black transition-colors">
        {label}
      </span>
      <FiArrowUpRight className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:text-black transition-all" />
    </motion.button>
  );
}