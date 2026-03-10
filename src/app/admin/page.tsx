"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Types
import { 
  TabType, 
  HeroData, 
  AboutData, 
  Project, 
  ContactData, 
  FooterData, 
  Message, 
  BlogPost, 
  Settings,
  ProjectFormData,
  BlogFormData
} from "@/lib/admin-types";

// Components
import Sidebar from "@/components/admin/Sidebar";
import Dashboard from "@/components/admin/Dashboard";
import HeroEditor from "@/components/admin/HeroEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import ProjectsEditor from "@/components/admin/ProjectsEditor";
import ContactEditor from "@/components/admin/ContactEditor";
import FooterEditor from "@/components/admin/FooterEditor";
import Messages from "@/components/admin/Messages";
import BlogsEditor from "@/components/admin/BlogsEditor";
import SettingsPanel from "@/components/admin/Settings";

// Utility functions
import { getAuthHeaders, loadSettings, saveSettings as saveSettingsUtil, clearCache as clearCacheUtil } from "@/lib/admin-utils";

// Default data
import { defaultHeroData, defaultAboutData, defaultContactData, defaultFooterData } from "@/lib/admin-constants";

export default function AdminDashboard() {
  const router = useRouter();
  
  // Tab state
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
  const [settings, setSettings] = useState<Settings>(loadSettings());

  // Project form
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    title: "",
    description: "",
    tech: "",
    link: "",
    featured: false,
    image: "",
  });

  // Blog form
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Development",
    tags: "",
  });

  // Show message helper
  const showMessageFn = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Save settings
  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettingsUtil(newSettings);
    showMessageFn("success", "Settings saved!");
  };

  // Clear cache
  const clearCache = () => {
    setClearingCache(true);
    clearCacheUtil();
    setTimeout(() => {
      setClearingCache(false);
      showMessageFn("success", "Cache cleared successfully!");
    }, 1500);
  };

  // Check auth and load data
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

  const updateSection = async (section: string, data: unknown) => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ section, data }),
      });
      
      const resData = await res.json();
      
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenExpiry");
        showMessageFn("error", "Session expired. Please login again.");
        router.push("/admin/login");
        return;
      }
      
      if (!res.ok) {
        throw new Error(resData.error || "Failed to update");
      }
      
      showMessageFn("success", `${section} updated successfully!`);
      
      // Clear cache
      localStorage.removeItem("siteContentCache");
      localStorage.removeItem("siteContentCacheTime");
      
      // Fetch fresh data
      const contentRes = await fetch("/api/content?nocache=" + Date.now(), { cache: 'no-store' });
      const contentData = await contentRes.json();
      
      // Update state
      if (section === "hero") {
        setHeroData(data as HeroData);
        setHeroForm(data as HeroData);
      } else if (section === "about") {
        setAboutData(data as AboutData);
        setAboutForm(data as AboutData);
      } else if (section === "contact") {
        setContactData(data as ContactData);
        setContactForm(data as ContactData);
      } else if (section === "footer") {
        setFooterData(data as FooterData);
        setFooterForm(data as FooterData);
      } else if (section === "projects") {
        setProjects(data as Project[]);
      }
      
      // Update cache
      localStorage.setItem("siteContentCache", JSON.stringify(contentData));
      localStorage.setItem("siteContentCacheTime", Date.now().toString());
    } catch (err) {
      console.error("Update error:", err);
      showMessageFn("error", "Failed to update. Please try again.");
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
      showMessageFn("error", "Failed to save project.");
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
      showMessageFn("success", "Message deleted!");
    } catch (err) {
      showMessageFn("error", "Failed to delete message.");
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

      showMessageFn("success", "Blog post created!");
      setBlogForm({ title: "", slug: "", excerpt: "", content: "", category: "Development", tags: "" });
      setShowBlogForm(false);
      
      // Reload blogs
      const blogsRes = await fetch("/api/blog");
      const blogsData = await blogsRes.json();
      setBlogPosts(blogsData.posts || []);
    } catch (err) {
      showMessageFn("error", "Failed to create post.");
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
      showMessageFn("success", "Post deleted!");
    } catch (err) {
      showMessageFn("error", "Failed to delete post.");
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleSidebarClose = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Navigate to different tab
  const handleNavigate = (tab: "hero" | "projects" | "messages" | "settings") => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Toast Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          message.type === "success" ? "bg-green-600" : "bg-red-600"
        } text-white`}>
          {message.text}
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/10 z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-white">Admin Panel</span>
        <div className="w-10"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        messageCount={messages.length}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onSidebarClose={handleSidebarClose}
      />

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <Dashboard
            projects={projects}
            blogPosts={blogPosts}
            messages={messages}
            onNavigate={handleNavigate}
          />
        )}

        {/* Hero Section Editor */}
        {activeTab === "hero" && heroForm && (
          <HeroEditor
            heroData={heroData!}
            heroForm={heroForm}
            setHeroForm={setHeroForm}
            onSave={updateSection}
            saving={saving}
          />
        )}

        {/* About Section Editor */}
        {activeTab === "about" && aboutForm && (
          <AboutEditor
            aboutData={aboutData!}
            aboutForm={aboutForm}
            setAboutForm={setAboutForm}
            onSave={updateSection}
            saving={saving}
          />
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <ProjectsEditor
            projects={projects}
            showProjectForm={showProjectForm}
            editingProject={editingProject}
            projectForm={projectForm}
            setShowProjectForm={setShowProjectForm}
            setEditingProject={setEditingProject}
            setProjectForm={setProjectForm}
            onSubmit={handleProjectSubmit}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            saving={saving}
          />
        )}

        {/* Contact Info Editor */}
        {activeTab === "contact" && contactForm && (
          <ContactEditor
            contactData={contactData!}
            contactForm={contactForm}
            setContactForm={setContactForm}
            onSave={updateSection}
            saving={saving}
          />
        )}

        {/* Footer Editor */}
        {activeTab === "footer" && footerForm && (
          <FooterEditor
            footerData={footerData!}
            footerForm={footerForm}
            setFooterForm={setFooterForm}
            onSave={updateSection}
            saving={saving}
          />
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <Messages
            messages={messages}
            onDelete={handleDeleteMessage}
          />
        )}

        {/* Blog Posts Tab */}
        {activeTab === "blogs" && (
          <BlogsEditor
            blogPosts={blogPosts}
            showBlogForm={showBlogForm}
            blogForm={blogForm}
            setShowBlogForm={setShowBlogForm}
            setBlogForm={setBlogForm}
            onSubmit={handleBlogSubmit}
            onDelete={handleDeleteBlog}
            saving={saving}
          />
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <SettingsPanel
            settings={settings}
            onSaveSettings={saveSettings}
            onClearCache={clearCache}
            clearingCache={clearingCache}
          />
        )}
      </main>
    </div>
  );
}

