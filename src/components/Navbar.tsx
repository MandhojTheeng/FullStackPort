"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-[100] px-4 sm:px-6 lg:px-8 pt-4"
      >
        <div
          className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-500 ${
            scrolled
              ? "border-white/10 bg-black/55 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              : "border-white/8 bg-white/[0.03] backdrop-blur-md"
          }`}
        >
          <div className="flex items-center justify-between px-5 sm:px-6 lg:px-8 h-[72px]">
            {/* Brand */}
            <Link href="/" className="group flex items-center gap-3 min-w-fit">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-inner shadow-white/5">
                <span className="text-sm font-semibold tracking-tight text-white">
                  ST
                </span>
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-semibold tracking-[0.22em] text-white uppercase">
                  Santosh
                </span>
                <span className="mt-1 text-[11px] tracking-[0.22em] text-white/45 uppercase">
                  Timalsina
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group relative rounded-full px-5 py-2.5"
                >
                  <span className="relative z-10 text-[12px] font-medium tracking-[0.18em] uppercase text-white/65 transition-colors duration-300 group-hover:text-white">
                    {link.name}
                  </span>
                  <span className="absolute inset-0 rounded-full bg-white/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Link
                href="#contact"
                className="hidden sm:inline-flex items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400 px-5 py-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-black transition-all duration-300 hover:scale-[1.02] hover:bg-white"
              >
                Hire Me
              </Link>

              <button
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors duration-300 hover:bg-white/[0.08]"
              >
                <div className="flex h-4 w-5 flex-col justify-between">
                  <span className="block h-[2px] w-full rounded-full bg-white" />
                  <span className="block h-[2px] w-3/4 self-end rounded-full bg-white/70" />
                  <span className="block h-[2px] w-full rounded-full bg-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-x-4 top-4 z-[120] rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[12px] font-medium tracking-[0.22em] uppercase text-white/40">
                    Navigation
                  </p>
                  <p className="mt-1 text-white text-sm font-medium">
                    Santosh Timalsina
                  </p>
                </div>

                <button
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors duration-300 hover:bg-white/[0.08]"
                >
                  ✕
                </button>
              </div>

              <div className="py-6 flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center justify-between rounded-2xl px-4 py-4 transition-colors duration-300 hover:bg-white/[0.05]"
                    >
                      <span className="text-lg font-medium text-white transition-colors duration-300 group-hover:text-emerald-300">
                        {link.name}
                      </span>
                      <span className="text-white/25 text-xl transition-transform duration-300 group-hover:translate-x-1">
                        ↗
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-5">
                <Link
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold tracking-[0.18em] uppercase text-black transition-all duration-300 hover:bg-white"
                >
                  Hire Me
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}