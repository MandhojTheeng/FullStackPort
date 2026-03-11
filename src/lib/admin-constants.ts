// Admin Panel Constants

import { NavItem } from "./admin-types";

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "hero", label: "Hero Section", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "about", label: "About Section", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: "contact", label: "Contact Section", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { id: "footer", label: "Footer", icon: "M4 6h16M4 12h16M4 18h16" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

export const defaultHeroData = {
  greeting: "Hello, I'm",
  title: "Santosh",
  subtitle: "Full Stack Developer",
  description: "I build exceptional digital experiences with modern technologies.",
  ctaPrimary: "View Projects",
  ctaSecondary: "Contact Me",
  ctaPrimaryLink: "#projects",
  ctaSecondaryLink: "#contact",
  image: "/santosh.jpg",
  stats: [
    { value: "3+", label: "Years Exp." },
    { value: "20+", label: "Projects" },
    { value: "10+", label: "Clients" },
  ],
  socialLinks: [
    { name: "GitHub", url: "https://github.com", icon: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
  ],
};

export const defaultContactData = {
  heading: "READY TO SCALE?",
  description: "Currently accepting new projects for 2026. Whether it is a server-side overhaul or a high-fidelity frontend, let's build something exceptional.",
  email: "timalsinasantosh19@gmail.com",
  location: "KATHMANDU, NEPAL",
  socialLinks: [
    { name: "GitHub", url: "https://github.com", icon: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
    { name: "Twitter", url: "https://twitter.com", icon: "twitter" },
  ],
  copyright: "© 2026 Santosh Timalsina",
};

export const defaultSettings = {
  siteName: "Santosh Portfolio",
  siteDescription: "Personal portfolio website",
  cacheEnabled: true,
  cacheDuration: 3600,
};

export const defaultAboutData = {
  title: "The Architect",
  heading: "Santosh Timalsina is a Full Stack Developer specialized in the entire digital lifecycle—from the raw server metal to the final pixel of UI.",
  bio: "I bridge the gap between high-level business requirements and low-level technical execution. Whether it is configuring a Linux environment, building a custom WordPress CMS, or scaling Node.js APIs, I deliver software that is as reliable as it is beautiful.",
  image: "/santosh.jpg",
  expertise: [
    { title: "Infrastructure", desc: "Server Config, Nginx, Docker, AWS, Security Protocols." },
    { title: "Development", desc: "Full Stack Architect. Node.js, Python, React, Next.js." },
    { title: "CMS Solutions", desc: "Expert WordPress, Custom Themes, Headless Architectures." },
    { title: "Interface", desc: "Pixel-perfect UI, Fluid Motion, User-Centric Logic." }
  ],
  stats: [
    { value: "03", label: "Years in Stack" },
    { value: "24", label: "Systems Deployed" },
    { value: "12", label: "Global Clients" },
    { value: "99", label: "Uptime Focus" }
  ]
};

export const defaultFooterData = {
  headingLine1: "TURNING",
  headingLine2: "COMPLEX IDEAS",
  headingLine3: "INTO REALITY",
  availabilityText: "Available for Worldwide",
  availabilitySubtext: "Remote & Freelance",
  navLinks: [
    { name: "About", href: "#about", desc: "The Architect" },
    { name: "Projects", href: "#projects", desc: "Selected Works" },
    { name: "Blog", href: "/blog", desc: "Insights & Thoughts" },
    { name: "Contact", href: "#contact", desc: "Start Conversation" }
  ],
  socialLinks: [
    { name: "GitHub", url: "https://github.com", icon: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
    { name: "Twitter", url: "https://twitter.com", icon: "twitter" }
  ],
  brandInitials: "ST",
  copyright: "© {year} Santosh Timalsina"
};

