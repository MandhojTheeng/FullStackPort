"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8">
        {/* Large 404 Text */}
        <h1 className="text-[20vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
          404
        </h1>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
            Page Not Found
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold text-sm tracking-[0.18em] uppercase rounded-full hover:bg-zinc-200 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-[0.18em] uppercase rounded-full hover:bg-white/10 transition-colors"
          >
            View Blog
          </Link>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", 
            backgroundSize: "30px 30px" 
          }} 
        />
      </div>
    </div>
  );
}

