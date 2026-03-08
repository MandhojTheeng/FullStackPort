"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Types
interface HeroData {
  greeting: string;
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryLink: string;
  ctaSecondaryLink: string;
  image: string;
  stats: Array<{ value: string; label: string }>;
  socialLinks: Array<{ name: string; url: string; icon: string }>;
}

interface AboutData {
  title: string;
  subtitle: string;
  bio: string[];
  skills: string[];
  stats: Array<{ value: string; label: string }>;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  featured: boolean;
  image: string;
}

interface ContactData {
  email: string;
  phone: string;
  location: string;
  socialLinks: Array<{ name: string; url: string; icon: string }>;
}

interface FooterData {
  brand: { name: string; tagline: string };
  description: string;
  quickLinks: Array<{ name: string; href: string }>;
  builtWith: string[];
  copyright: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface BlogPost {
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

interface Settings {
  siteName: string;
  siteDescription: string;
  cacheEnabled: boolean;
  cacheDuration: number;
}

type TabType = "dashboard" | "hero" | "about" | "projects" | "contact" | "footer" | "messages" | "blogs" | "settings";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "hero", label: "Hero Section", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "about", label: "About Section", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: "projects", label: "Projects", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { id: "contact", label: "Contact Info", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { id: "footer", label: "Footer", icon: "M4 6h16M4 12h16M4 18h16" },
  { id: "messages", label: "Messages", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" },
  { id: "blogs", label: "Blog Posts", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  // Data states
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Form states
  const [heroForm, setHeroForm] = useState<HeroData | null>(null);
  const [aboutForm, setAboutForm] = useState<AboutData | null>(null);
  const [contactForm, setContactForm] = useState<ContactData | null>(null);
  const [footerForm, setFooterForm] = useState<FooterData | null>(null);

  // Settings state
  const [settings, setSettings] = useState<Settings>({
    siteName: "Santosh Portfolio",
    siteDescription: "Personal portfolio website",
    cacheEnabled: true,
    cacheDuration: 3600,
  });

  // Project form
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tech: "",
    link: "",
    featured: false,
    image: "",
  });

  // Blog form
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Development",
    tags: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("siteSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("siteSettings", JSON.stringify(newSettings));
    showMessage("success", "Settings saved!");
  };

  // Clear cache
  const clearCache = () => {
    setClearingCache(true);
    // Clear localStorage cache
    localStorage.removeItem("siteContentCache");
    localStorage.removeItem("siteContentCacheTime");
    
    setTimeout(() => {
      setClearingCache(false);
      showMessage("success", "Cache cleared successfully!");
    }, 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadAllData();
  }, [router]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Check localStorage cache first
      const cacheKey = "siteContentCache";
      const cacheTimeKey = "siteContentCacheTime";
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      
      if (cached && cacheTime && settings.cacheEnabled) {
        const cacheAge = Date.now() - parseInt(cacheTime);
        if (cacheAge < settings.cacheDuration * 1000) {
          const contentData = JSON.parse(cached);
          setHeroData(contentData.hero);
          setAboutData(contentData.about);
          setProjects(contentData.projects || []);
          setContactData(contentData.contact);
          setFooterData(contentData.footer);
          setHeroForm(contentData.hero);
          setAboutForm(contentData.about);
          setContactForm(contentData.contact);
          setFooterForm(contentData.footer);
          setLoading(false);
          return;
        }
      }

      // Load from API
      const contentRes = await fetch("/api/content");
      const contentData = await contentRes.json();
      
      setHeroData(contentData.hero);
      setAboutData(contentData.about);
      setProjects(contentData.projects || []);
      setContactData(contentData.contact);
      setFooterData(contentData.footer);
      
      setHeroForm(contentData.hero);
      setAboutForm(contentData.about);
      setContactForm(contentData.contact);
      setFooterForm(contentData.footer);

      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(contentData));
      localStorage.setItem(cacheTimeKey, Date.now().toString());

      // Load messages
      const messagesRes = await fetch("/api/messages", {
        headers: getAuthHeaders(),
      });
      const messagesData = await messagesRes.json();
      setMessages(messagesData.messages || []);

      // Load blog posts
      const blogsRes = await fetch("/api/blog");
      const blogsData = await blogsRes.json();
      setBlogPosts(blogsData.posts || []);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/");
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateSection = async (section: string, data: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ section, data }),
      });
      
      const resData = await res.json();
      
      if (res.status === 401) {
        // Token is invalid or expired - redirect to login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenExpiry");
        showMessage("error", "Session expired. Please login again.");
        router.push("/admin/login");
        return;
      }
      
      if (!res.ok) {
        throw new Error(resData.error || "Failed to update");
      }
      
      showMessage("success", `${section} updated successfully!`);
      
      // Clear cache and fetch fresh data
      localStorage.removeItem("siteContentCache");
      localStorage.removeItem("siteContentCacheTime");
      
      // Fetch fresh data directly from API
      const contentRes = await fetch("/api/content?nocache=" + Date.now(), {
        cache: 'no-store'
      });
      const contentData = await contentRes.json();
      
      // Update all state variables with fresh data
      if (section === "hero") {
        setHeroData(data);
        setHeroForm(data);
      } else if (section === "about") {
        setAboutData(data);
        setAboutForm(data);
      } else if (section === "contact") {
        setContactData(data);
        setContactForm(data);
      } else if (section === "footer") {
        setFooterData(data);
        setFooterForm(data);
      } else if (section === "projects") {
        setProjects(data);
      }
      
      // Update cache with fresh data
      localStorage.setItem("siteContentCache", JSON.stringify(contentData));
      localStorage.setItem("siteContentCacheTime", Date.now().toString());
    } catch (err) {
      console.error("Update error:", err);
      showMessage("error", "Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Project handlers
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const projectData = {
      ...projectForm,
      tech: projectForm.tech.split(",").map((t) => t.trim()).filter(Boolean),
      id: editingProject?.id || Date.now(),
    };

    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = projects.map((p) => 
        p.id === editingProject.id ? { ...projectData, id: p.id } as Project : p
      );
    } else {
      updatedProjects = [...projects, projectData as Project];
    }

    try {
      await updateSection("projects", updatedProjects);
      setShowProjectForm(false);
      setEditingProject(null);
      setProjectForm({ title: "", description: "", tech: "", link: "", featured: false, image: "" });
    } catch (err) {
      showMessage("error", "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      link: project.link,
      featured: project.featured,
      image: project.image,
    });
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const updatedProjects = projects.filter((p) => p.id !== id);
    await updateSection("projects", updatedProjects);
  };

  // Message handlers
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      setMessages(messages.filter((m) => m.id !== id));
      showMessage("success", "Message deleted!");
    } catch (err) {
      showMessage("error", "Failed to delete message.");
    }
  };

  // Blog handlers
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...blogForm,
          tags: blogForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      showMessage("success", "Blog post created!");
      setBlogForm({ title: "", slug: "", excerpt: "", content: "", category: "Development", tags: "" });
      setShowBlogForm(false);
      
      // Reload blogs
      const blogsRes = await fetch("/api/blog");
      const blogsData = await blogsRes.json();
      setBlogPosts(blogsData.posts || []);
    } catch (err) {
      showMessage("error", "Failed to create post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/blog?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to delete");

      setBlogPosts(blogPosts.filter((p) => p.id !== id));
      showMessage("success", "Post deleted!");
    } catch (err) {
      showMessage("error", "Failed to delete post.");
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleSidebarClose = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          message.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}>
          {message.text}
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-gray-900">Admin Panel</span>
        <div className="w-10"></div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={handleSidebarClose}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 text-gray-900 p-4 lg:p-6 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="mb-6 lg:mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white">
              S
            </div>
            <span className="text-xl font-bold text-gray-900">Admin</span>
          </Link>
        </div>

        <nav className="space-y-1 lg:space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as TabType);
                handleSidebarClose();
              }}
              className={`w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all text-sm lg:text-base ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="truncate">{item.label}</span>
              {item.id === "messages" && messages.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {messages.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 lg:py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content - Responsive */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Dashboard</h1>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs lg:text-sm">Total Projects</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs lg:text-sm">Blog Posts</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{blogPosts.length}</p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs lg:text-sm">Messages</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{messages.length}</p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs lg:text-sm">Featured</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{projects.filter(p => p.featured).length}</p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <button
                  onClick={() => setActiveTab("hero")}
                  className="p-3 lg:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
                >
                  <p className="font-medium text-blue-900 text-sm lg:text-base">Edit Hero</p>
                  <p className="text-xs lg:text-sm text-blue-600">Update homepage</p>
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className="p-3 lg:p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left"
                >
                  <p className="font-medium text-purple-900 text-sm lg:text-base">Manage Projects</p>
                  <p className="text-xs lg:text-sm text-purple-600">Add or edit</p>
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className="p-3 lg:p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
                >
                  <p className="font-medium text-green-900 text-sm lg:text-base">View Messages</p>
                  <p className="text-xs lg:text-sm text-green-600">Contact form</p>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="p-3 lg:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                >
                  <p className="font-medium text-gray-900 text-sm lg:text-base">Settings</p>
                  <p className="text-xs lg:text-sm text-gray-600">Cache & more</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section Editor */}
        {activeTab === "hero" && heroForm && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Hero Section</h1>
            
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <form className="space-y-4 lg:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Greeting</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={heroForm.greeting}
                      onChange={(e) => setHeroForm({ ...heroForm, greeting: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (Name)</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text" style={{ color: "#111827" }}
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea style={{ color: "#111827" }}
                    value={heroForm.description}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA Text</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={heroForm.ctaPrimary}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaPrimary: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA Link</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={heroForm.ctaPrimaryLink}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryLink: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA Text</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={heroForm.ctaSecondary}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaSecondary: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA Link</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={heroForm.ctaSecondaryLink}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryLink: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text" style={{ color: "#111827" }}
                    value={heroForm.image}
                    onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    placeholder="/profile.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stats (value, label - one per line)</label>
                  <textarea style={{ color: "#111827" }}
                    value={heroForm.stats.map(s => `${s.value},${s.label}`).join("\n")}
                    onChange={(e) => {
                      const stats = e.target.value.split("\n").filter(Boolean).map(line => {
                        const [value, label] = line.split(",");
                        return { value: value?.trim() || "0", label: label?.trim() || "" };
                      });
                      setHeroForm({ ...heroForm, stats });
                    }}
                    rows={3}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                    placeholder="3+,Years Exp."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => updateSection("hero", heroForm)}
                  disabled={saving}
                  className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* About Section Editor */}
        {activeTab === "about" && aboutForm && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">About Section</h1>
            
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <form className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text" style={{ color: "#111827" }}
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text" style={{ color: "#111827" }}
                    value={aboutForm.subtitle}
                    onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio (one paragraph per line)</label>
                  <textarea style={{ color: "#111827" }}
                    value={aboutForm.bio.join("\n\n")}
                    onChange={(e) => {
                      const bio = e.target.value.split("\n\n").filter(Boolean);
                      setAboutForm({ ...aboutForm, bio });
                    }}
                    rows={6}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                  <input
                    type="text" style={{ color: "#111827" }}
                    value={aboutForm.skills.join(", ")}
                    onChange={(e) => {
                      const skills = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                      setAboutForm({ ...aboutForm, skills });
                    }}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    placeholder="React, Next.js, TypeScript"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stats (value,label - one per line)</label>
                  <textarea style={{ color: "#111827" }}
                    value={aboutForm.stats.map(s => `${s.value},${s.label}`).join("\n")}
                    onChange={(e) => {
                      const stats = e.target.value.split("\n").filter(Boolean).map(line => {
                        const [value, label] = line.split(",");
                        return { value: value?.trim() || "0", label: label?.trim() || "" };
                      });
                      setAboutForm({ ...aboutForm, stats });
                    }}
                    rows={4}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                    placeholder="3+,Years Experience"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => updateSection("about", aboutForm)}
                  disabled={saving}
                  className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Projects</h1>
              <button
                onClick={() => {
                  setShowProjectForm(true);
                  setEditingProject(null);
                  setProjectForm({ title: "", description: "", tech: "", link: "", featured: false, image: "" });
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg transition-all text-sm lg:text-base"
              >
                Add Project
              </button>
            </div>

            {/* Project Form Modal */}
            {showProjectForm && (
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea style={{ color: "#111827" }}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack (comma separated)</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={projectForm.tech}
                      onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={projectForm.link}
                      onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-500 rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Project</label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                    >
                      {saving ? "Saving..." : "Save Project"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProjectForm(false);
                        setEditingProject(null);
                      }}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all text-sm lg:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Projects List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">{project.title}</h3>
                    {project.featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-600 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info Editor */}
        {activeTab === "contact" && contactForm && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Contact Info</h1>
            
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <form className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email" style={{ color: "#111827" }}
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text" style={{ color: "#111827" }}
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text" style={{ color: "#111827" }}
                    value={contactForm.location}
                    onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Links (name,url - one per line)</label>
                  <textarea style={{ color: "#111827" }}
                    value={contactForm.socialLinks.map(s => `${s.name},${s.url}`).join("\n")}
                    onChange={(e) => {
                      const socialLinks = e.target.value.split("\n").filter(Boolean).map(line => {
                        const [name, url] = line.split(",");
                        return { name: name?.trim() || "", url: url?.trim() || "", icon: "custom" };
                      });
                      setContactForm({ ...contactForm, socialLinks });
                    }}
                    rows={4}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                    placeholder="GitHub,https://github.com"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => updateSection("contact", contactForm)}
                  disabled={saving}
                  className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer Editor */}
        {activeTab === "footer" && footerForm && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Footer</h1>
            
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <form className="space-y-4 lg:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={footerForm.brand.name}
                      onChange={(e) => setFooterForm({ ...footerForm, brand: { ...footerForm.brand, name: e.target.value } })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={footerForm.brand.tagline}
                      onChange={(e) => setFooterForm({ ...footerForm, brand: { ...footerForm.brand, tagline: e.target.value } })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea style={{ color: "#111827" }}
                    value={footerForm.description}
                    onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Links (name,href - one per line)</label>
                  <textarea style={{ color: "#111827" }}
                    value={footerForm.quickLinks.map(l => `${l.name},${l.href}`).join("\n")}
                    onChange={(e) => {
                      const quickLinks = e.target.value.split("\n").filter(Boolean).map(line => {
                        const [name, href] = line.split(",");
                        return { name: name?.trim() || "", href: href?.trim() || "#" };
                      });
                      setFooterForm({ ...footerForm, quickLinks });
                    }}
                    rows={4}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                    placeholder="About,#about"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                  <input
                    type="text" style={{ color: "#111827" }}
                    value={footerForm.copyright}
                    onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    placeholder="© {year} Santosh. All rights reserved."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => updateSection("footer", footerForm)}
                  disabled={saving}
                  className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Messages</h1>
            
            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-100 text-center">
                <svg className="w-12 lg:w-16 h-12 lg:h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900">{msg.name}</h3>
                        <p className="text-sm text-gray-500">{msg.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start sm:self-center"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm lg:text-base">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Blog Posts Tab */}
        {activeTab === "blogs" && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Blog Posts</h1>
              <button
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg transition-all text-sm lg:text-base"
              >
                {showBlogForm ? "Cancel" : "Create Post"}
              </button>
            </div>

            {/* Blog Form */}
            {showBlogForm && (
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Create New Post</h2>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text" style={{ color: "#111827" }}
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") })}
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                      <input
                        type="text" style={{ color: "#111827" }}
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea style={{ color: "#111827" }}
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      rows={6}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-sm lg:text-base"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                      >
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Technology">Technology</option>
                        <option value="Tutorial">Tutorial</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                      <input
                        type="text" style={{ color: "#111827" }}
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                        placeholder="React, Next.js, TypeScript"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                  >
                    {saving ? "Creating..." : "Create Post"}
                  </button>
                </form>
              </div>
            )}

            {/* Blog Posts List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {blogPosts.length === 0 ? (
                <div className="p-8 lg:p-12 text-center">
                  <p className="text-gray-500">No blog posts yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-600">Title</th>
                        <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-600 hidden sm:table-cell">Category</th>
                        <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-600 hidden md:table-cell">Date</th>
                        <th className="text-right px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="font-medium text-gray-900 text-sm lg:text-base">{post.title}</div>
                            <div className="text-xs lg:text-sm text-gray-500">/{post.slug}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 hidden sm:table-cell">
                            <span className="px-2 lg:px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-500 hidden md:table-cell">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                            <button
                              onClick={() => handleDeleteBlog(post.id)}
                              className="px-3 py-1.5 text-xs lg:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Settings</h1>
            
            <div className="space-y-6">
              {/* Site Settings */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Site Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={settings.siteName}
                      onChange={(e) => saveSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                    <input
                      type="text" style={{ color: "#111827" }}
                      value={settings.siteDescription}
                      onChange={(e) => saveSettings({ ...settings, siteDescription: e.target.value })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Cache Settings */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Cache Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Enable Cache</p>
                      <p className="text-sm text-gray-500">Cache site content for faster loading</p>
                    </div>
                    <button
                      onClick={() => saveSettings({ ...settings, cacheEnabled: !settings.cacheEnabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.cacheEnabled ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.cacheEnabled ? "translate-x-6" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cache Duration (seconds)</label>
                    <input
                      type="number" style={{ color: "#111827" }}
                      value={settings.cacheDuration}
                      onChange={(e) => saveSettings({ ...settings, cacheDuration: parseInt(e.target.value) || 3600 })}
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm lg:text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">Default: 3600 seconds (1 hour)</p>
                  </div>

                  <button
                    onClick={clearCache}
                    disabled={clearingCache}
                    className="w-full sm:w-auto px-4 py-2.5 lg:py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all disabled:opacity-50 text-sm lg:text-base"
                  >
                    {clearingCache ? "Clearing..." : "Clear Cache Now"}
                  </button>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">About</h2>
                <div className="space-y-2 text-sm lg:text-base text-gray-600">
                  <p><span className="font-medium text-gray-900">Version:</span> 1.0.0</p>
                  <p><span className="font-medium text-gray-900">Framework:</span> Next.js</p>
                  <p><span className="font-medium text-gray-900">Admin Panel:</span> Custom CMS</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

