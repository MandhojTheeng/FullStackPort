"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const FALLBACK_POSTS = [
  {
    id: 1,
    title: "Architecting Scalable Microservices with Next.js 15",
    excerpt: "How I approach building production-ready systems that handle high traffic while maintaining 99.9% uptime.",
    category: "Architecture",
    publishedAt: "2026-03-01",
    slug: "scalable-nextjs-architecture",
    tags: ["Next.js", "Backend", "Scalability"]
  },
  {
    id: 2,
    title: "The IT Officer's Playbook: Managing Digital Infrastructure",
    excerpt: "Insights from my role at Glocal Pvt. Ltd. on optimizing internal workflows and securing organizational data.",
    category: "Management",
    publishedAt: "2026-02-15",
    slug: "it-management-playbook",
    tags: ["IT Operations", "Security", "Leadership"]
  },
  {
    id: 3,
    title: "Why I Switched to Gemini 3.0 for AI-Driven Development",
    excerpt: "Exploring the integration of advanced LLMs into the modern development workflow to speed up delivery.",
    category: "AI",
    publishedAt: "2026-02-10",
    slug: "ai-driven-development",
    tags: ["AI", "Gemini", "Productivity"]
  },
  {
    id: 4,
    title: "Modern Database Design: PostgreSQL vs. NoSQL in 2026",
    excerpt: "A deep dive into choosing the right data layer for full-stack applications based on my recent architectural projects.",
    category: "Database",
    publishedAt: "2026-01-20",
    slug: "database-design-2026",
    tags: ["PostgreSQL", "Data", "Architecture"]
  }
];

export default function BlogPage() {
  const posts = FALLBACK_POSTS; // In production, keep your fetch logic here

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-green-500 selection:text-black font-sans antialiased overflow-x-hidden relative">
      
      {/* 0. DATA GRID OVERLAY (Matching Hero) */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0" 
           style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

      <div className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        
        {/* 1. BLOG HEADER */}
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[10vw] font-[1000] leading-[0.8] tracking-[-0.07em] uppercase">
              THE <span className="text-transparent stroke-text">BLOG</span>
            </h1>
            <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="h-[1px] w-24 bg-green-500 mt-3 hidden md:block" />
              <p className="text-sm font-bold opacity-50 max-w-xl leading-relaxed lowercase font-mono">
                Technical post-mortems, architectural blueprints, and engineering leadership.
              </p>
            </div>
          </motion.div>
        </header>

        {/* 2. BLOG GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 border-t border-white/10">
          {/* Left Sidebar Info */}
          <div className="lg:col-span-3 border-r border-white/10 p-6 hidden lg:block font-mono text-[10px] space-y-8">
            <div>
              <h4 className="text-green-500 mb-4 font-black tracking-widest">CATEGORIES</h4>
              <ul className="space-y-2 opacity-60">
                <li>01_ARCHITECTURE</li>
                <li>02_INFRASTRUCTURE</li>
                <li>03_PRODUCTIVITY</li>
                <li>04_AI_LOGS</li>
              </ul>
            </div>
          
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {posts.map((post, idx) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative border-b border-white/10 md:border-r p-8 lg:p-12 hover:bg-white/[0.02] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-10 font-mono text-[10px]">
                      <span className="text-green-500 tracking-[0.3em] font-black uppercase">
                        [{post.category}]
                      </span>
                      <span className="opacity-30 tracking-widest">{post.publishedAt}</span>
                    </div>

                    <h2 className="text-3xl font-black leading-none tracking-tight mb-6 uppercase group-hover:text-green-500 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-sm opacity-50 lowercase font-medium mb-8 leading-relaxed max-w-md">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono border border-white/20 px-2 py-0.5 rounded-full opacity-40 group-hover:opacity-100 transition-opacity">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-4 text-[11px] font-black tracking-[0.4em] uppercase group-hover:gap-6 transition-all"
                    >
                      READ MORE<span className="text-green-500">→</span>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </main>
  );
}