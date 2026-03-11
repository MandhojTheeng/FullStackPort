"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FiCalendar, FiUser, FiArrowRight, FiClock, FiFileText } from "react-icons/fi";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  slug: string;
  image: string;
  tags: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.posts && data.posts.length > 0) {
        // Transform API response to match the expected format
        const transformedPosts = data.posts.map((post: any, idx: number) => ({
          id: idx,
          title: post.title,
          excerpt: post.description || "",
          category: post.category || "General",
          publishedAt: post.date || "",
          slug: post.slug,
          image: "/blog1.png",
          tags: []
        }));
        setPosts(transformedPosts);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-green-500 selection:text-black font-sans antialiased overflow-x-hidden relative">
      
      {/* 0. DATA GRID OVERLAY */}
      <div 
        className="fixed inset-0 opacity-[0.05] pointer-events-none z-0" 
        style={{ 
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", 
          backgroundSize: "30px 30px" 
        }} 
      />

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto">
        
        {/* 1. BLOG HEADER */}
        <header className="mb-16 sm:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[8vw] sm:text-[10vw] font-[1000] leading-[0.8] tracking-[-0.07em] uppercase">
              THE <span 
                className="text-transparent" 
                style={{ WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.2)" }}
              >
                BLOG
              </span>
            </h1>
            <div className="mt-6 sm:mt-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="h-[1px] w-16 sm:w-24 bg-green-500 mt-3 hidden md:block" />
              <p className="text-sm font-bold opacity-50 max-w-xl leading-relaxed lowercase font-mono">
                Technical post-mortems, architectural blueprints, and engineering leadership.
              </p>
            </div>
          </motion.div>
        </header>

        {/* 2. BLOG GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 border-t border-white/10">
          <div className="lg:col-span-3 border-r border-white/10 p-4 sm:p-6 hidden lg:block font-mono text-[10px] space-y-8">
            <div>
              <h4 className="text-green-500 mb-4 font-black tracking-widest">CATEGORIES</h4>
              <ul className="space-y-2 opacity-60">
                <li className="hover:text-green-500 cursor-pointer transition-colors">01_AI_&_AGENTS</li>
                <li className="hover:text-green-500 cursor-pointer transition-colors">02_ARCHITECTURE</li>
                <li className="hover:text-green-500 cursor-pointer transition-colors">03_INFRASTRUCTURE</li>
                <li className="hover:text-green-500 cursor-pointer transition-colors">04_MANAGEMENT</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 rounded-full flex items-center justify-center">
                  <FiFileText className="text-zinc-600" size={32} />
                </div>
                <p className="text-zinc-500 text-lg">No blog posts yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2">
              {posts.map((post, idx) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative border-b border-white/10 md:border-r hover:bg-white/[0.02] transition-colors overflow-hidden"
                >
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12 z-10 relative"
                  >
                    <div>
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 sm:mb-6 font-mono text-[10px]">
                        <span className="text-green-500 tracking-[0.3em] font-black uppercase">
                          [{post.category}]
                        </span>
                        <span className="opacity-30 tracking-widest flex items-center gap-1">
                          <FiClock size={10} />
                          {post.publishedAt}
                        </span>
                      </div>

                      {post.image && (
                        <div className="relative w-full h-40 sm:h-48 lg:h-56 mb-6 sm:mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/10">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
                        </div>
                      )}

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-[0.9] tracking-tight mb-4 sm:mb-6 uppercase group-hover:text-green-500 transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-sm opacity-50 lowercase font-medium mb-6 sm:mb-8 leading-relaxed max-w-md line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-mono border border-white/20 px-2 py-0.5 rounded-full opacity-40 group-hover:opacity-100 group-hover:border-green-500/50 transition-all">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="inline-flex items-center gap-2 sm:gap-4 text-[11px] font-black tracking-[0.4em] uppercase group-hover:gap-6 transition-all">
                        READ MORE <span className="text-green-500">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
