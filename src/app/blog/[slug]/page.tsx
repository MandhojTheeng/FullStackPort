import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Navbar from "@/components/Navbar";

// --- DATA FETCHING ---
const contentDirectory = path.join(process.cwd(), "src", "content");

async function getPostData(slug: string) {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return { slug, frontmatter: data, content };
  } catch (e) {
    return null;
  }
}

function getAllPostsMetadata() {
  if (!fs.existsSync(contentDirectory)) return [];
  const files = fs.readdirSync(contentDirectory);
  return files
    .filter(file => file.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || "Untitled",
        category: data.category || "General",
        date: data.date || "",
        author: data.author || "",
      };
    });
}

// --- MAIN COMPONENT ---
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) notFound();

  const allPosts = getAllPostsMetadata();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const sidebarEntries = allPosts.filter((p) => p.slug !== slug);

  return (
    <main className="min-h-screen bg-[#000] text-white font-sans antialiased">
      <Navbar />

      {/* HERO SECTION - REDUCED TO 7VW */}
      <section className="relative min-h-[80vh] flex flex-col justify-end px-6 md:px-12 pb-16 border-b border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full border-l border-white/10 hidden lg:block" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-9">
            <div className="flex items-center gap-6 mb-10 text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">
              <span>{post.frontmatter.category}</span>
              <div className="h-[1px] w-12 bg-white/20" />
              <span>{post.frontmatter.date}</span>
            </div>
            {/* Font size reduced from 10vw to 7vw */}
            <h1 className="text-5xl md:text-[7vw] font-black leading-[0.9] tracking-[-0.05em] uppercase">
              {post.frontmatter.title}
            </h1>
          </div>
          
          <div className="lg:col-span-3 flex flex-col justify-end">
            <div className="p-6 border border-white/10 bg-white/[0.02] backdrop-blur-md">
              <p className="text-[9px] font-black tracking-widest uppercase opacity-30 mb-1">Author</p>
              <p className="text-lg font-bold uppercase tracking-tight text-white/90">{post.frontmatter.author}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE LAYOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT: CONTENT */}
        <div className="lg:col-span-8 p-6 md:p-20 border-r border-white/10">
          <article className="prose-custom">
            <MDXRemote source={post.content} />
          </article>

          {/* PAGINATION */}
          <div className="mt-32 pt-12 border-t border-white/10 grid grid-cols-2 gap-8">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="group no-underline">
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-30 group-hover:opacity-100 transition-opacity">← Prev</p>
                <h4 className="text-xl font-bold mt-2 uppercase opacity-60 group-hover:opacity-100">{prevPost.title}</h4>
              </Link>
            ) : <div />}
            
            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className="group no-underline text-right">
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-30 group-hover:opacity-100 transition-opacity">Next →</p>
                <h4 className="text-xl font-bold mt-2 uppercase opacity-60 group-hover:opacity-100">{nextPost.title}</h4>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="lg:col-span-4 bg-[#030303]">
          <div className="sticky top-0 p-8 md:p-12 space-y-20">
            <div>
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 mb-12">Related Analysis</h4>
              <div className="space-y-12">
                {sidebarEntries.map((entry) => (
                  <Link key={entry.slug} href={`/blog/${entry.slug}`} className="group block no-underline">
                    <p className="text-[9px] font-bold tracking-[0.2em] mb-3 text-white/30 uppercase">{entry.category}</p>
                    <h5 className="text-2xl font-black leading-tight uppercase group-hover:text-white/50 transition-all">
                      {entry.title}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .prose-custom .content-section { margin-bottom: 6rem; }
        .prose-custom .section-label { font-size: 10px; font-weight: 900; letter-spacing: 0.4em; color: rgba(255,255,255,0.25); margin-bottom: 1.5rem; display: block; }
        .prose-custom .hero-para { font-size: 2rem; line-height: 1.2; font-weight: 700; color: white; letter-spacing: -0.03em; margin-bottom: 3rem; }
        .prose-custom p { font-size: 1.15rem; line-height: 1.8; color: rgba(255,255,255,0.6); margin-bottom: 1.5rem; }
        .prose-custom strong { color: white; font-weight: 800; }
        a { text-decoration: none !important; }
      `}} />
    </main>
  );
}