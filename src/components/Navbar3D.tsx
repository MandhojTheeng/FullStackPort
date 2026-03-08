"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export default function Navbar3D() {
  const { scrollY } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
  const blurAmount = useTransform(scrollY, [0, 100], [0, 20]);
  const y = useTransform(scrollY, [0, 100], [0, -10]);

  // Track active section
  useMotionValueEvent(scrollY, "change", (latest) => {
    const sections = ['about', 'projects', 'contact'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section);
          break;
        }
      }
    }
  });

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50"
      style={{ y }}
    >
      <motion.div
        className="absolute inset-0 bg-night-950/80 backdrop-blur-md"
        style={{ 
          opacity: backgroundOpacity,
          backdropFilter: `blur(${blurAmount}px)` 
        }}
      />
      
      {/* Gradient border at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-forest-500/50 to-transparent" />

      <div className="relative container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-xl font-bold">
            <span className="gradient-text">Santosh</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div
          className="hidden md:flex items-center space-x-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeSection === item.href.slice(1)
                    ? 'text-forest-400'
                    : 'text-zinc-400 hover:text-forest-300'
                }`}
              >
                {item.name}
                {/* Active indicator */}
                <motion.span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-forest-400 rounded-full"
                  animate={{
                    scale: activeSection === item.href.slice(1) ? 1 : 0,
                    opacity: activeSection === item.href.slice(1) ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
                {/* Hover underline */}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-forest-500 to-moss-400 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative elements */}
        <div className="hidden md:flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-forest-500"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 text-zinc-300 hover:text-forest-400 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden absolute top-full left-0 w-full bg-night-900/95 backdrop-blur-lg"
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
        style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
      >
        {/* Gradient border */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-forest-500/30 to-transparent" />
        
        <div className="px-6 py-6 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isMobileMenuOpen ? 1 : 0,
                x: isMobileMenuOpen ? 0 : -20
              }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`block py-3 px-4 rounded-lg font-medium transition-all ${
                  activeSection === item.href.slice(1)
                    ? 'text-forest-400 bg-forest-500/10'
                    : 'text-zinc-400 hover:text-forest-300 hover:bg-forest-500/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}

