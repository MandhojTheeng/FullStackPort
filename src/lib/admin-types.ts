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
  subtitle: string;
  bio: string[];
  skills: string[];
  stats: Array<{ value: string; label: string }>;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  featured: boolean;
  image: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  socialLinks: Array<{ name: string; url: string; icon: string }>;
}

export interface FooterData {
  brand: { name: string; tagline: string };
  description: string;
  quickLinks: Array<{ name: string; href: string }>;
  builtWith: string[];
  copyright: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  cacheEnabled: boolean;
  cacheDuration: number;
}

export type TabType = "dashboard" | "hero" | "about" | "projects" | "contact" | "footer" | "messages" | "blogs" | "settings";

export interface NavItem {
  id: TabType;
  label: string;
  icon: string;
}

export interface ToastMessage {
  type: "success" | "error";
  text: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  tech: string;
  link: string;
  featured: boolean;
  image: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
}

