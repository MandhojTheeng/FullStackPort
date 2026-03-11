// Admin Panel Types

export interface HeroData {
  headingLine1: string;
  headingLine2: string;
  headingLine3: string;
  subtitle: string;
  role: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryLink: string;
  ctaSecondaryLink: string;
  image: string;
  stats: Array<{ label: string; value: string }>;
  socialLinks: Array<{ name: string; url: string; icon: string }>;
}

export interface AboutData {
  title: string;
  heading: string;
  bio: string;
  image: string;
  expertise: Array<{ title: string; desc: string }>;
  stats: Array<{ value: string; label: string }>;
}

export interface ContactData {
  heading: string;
  description: string;
  email: string;
  location: string;
  socialLinks: Array<{ name: string; url: string; icon: string }>;
  copyright: string;
}

export interface FooterData {
  headingLine1: string;
  headingLine2: string;
  headingLine3: string;
  availabilityText: string;
  availabilitySubtext: string;
  navLinks: Array<{ name: string; href: string; desc: string }>;
  socialLinks: Array<{ name: string; url: string; icon: string }>;
  brandInitials: string;
  copyright: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  cacheEnabled: boolean;
  cacheDuration: number;
}

export type TabType = "dashboard" | "hero" | "about" | "contact" | "footer" | "settings" | "blog" | "projects";

export interface NavItem {
  id: TabType;
  label: string;
  icon: string;
}

export interface ToastMessage {
  type: "success" | "error";
  text: string;
}

// Blog Types
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  slug: string;
  image: string;
  tags: string[];
}

export interface BlogContent {
  title: string;
  date: string;
  category: string;
  author: string;
  content: string;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  link: string;
  featured: boolean;
  image: string;
}

export interface ProjectsData {
  projects: Project[];
}

