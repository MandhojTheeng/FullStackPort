"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Types
import { 
  TabType, 
  HeroData, 
  AboutData,
  ContactData,
  FooterData,
  Settings,
  Project
} from "@/lib/admin-types";

// Components
import Sidebar from "@/components/admin/Sidebar";
import Dashboard from "@/components/admin/Dashboard";
import HeroEditor from "@/components/admin/HeroEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import ContactEditor from "@/components/admin/ContactEditor";
import FooterEditor from "@/components/admin/FooterEditor";
import BlogEditor from "@/components/admin/BlogEditor";
import ProjectEditor from "@/components/admin/ProjectEditor";
import SettingsPanel from "@/components/admin/Settings";

// Utility functions
import { getAuthHeaders, loadSettings, saveSettings as saveSettingsUtil, clearCache as clearCacheUtil } from "@/lib/admin-utils";

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
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [projectsData, setProjectsData] = useState<Project[]>([]);

  // Form states
  const [heroForm, setHeroForm] = useState<HeroData | null>(null);
  const [aboutForm, setAboutForm] = useState<AboutData | null>(null);
  const [contactForm, setContactForm] = useState<ContactData | null>(null);
  const [footerForm, setFooterForm] = useState<FooterData | null>(null);

  // Settings state
  const [settings, setSettings] = useState<Settings>(loadSettings());

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
          setContactData(contentData.contact);
          setFooterData(contentData.footer);
          setProjectsData(contentData.projects || []);
          setHeroForm(contentData.hero);
          setAboutForm(contentData.about);
          setContactForm(contentData.contact);
          setFooterForm(contentData.footer);
          
          setLoading(false);
          return;
        }
      }

      // Load content from API
      const contentRes = await fetch("/api/content");
      const contentData = await contentRes.json();
      
      setHeroData(contentData.hero);
      setAboutData(contentData.about);
      setContactData(contentData.contact);
      setFooterData(contentData.footer);
      setProjectsData(contentData.projects || []);
      
      setHeroForm(contentData.hero);
      setAboutForm(contentData.about);
      setContactForm(contentData.contact);
      setFooterForm(contentData.footer);

      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(contentData));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
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
    
    // Minimum save time to ensure user sees the loading state (800ms)
    const minSaveTime = new Promise(resolve => setTimeout(resolve, 800));
    
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
        const projectsData = (data as { projects: Project[] }).projects;
        setProjectsData(projectsData);
      }
      
      // Update cache
      localStorage.setItem("siteContentCache", JSON.stringify(contentData));
      localStorage.setItem("siteContentCacheTime", Date.now().toString());
    } catch (err) {
      console.error("Update error:", err);
      showMessageFn("error", "Failed to update. Please try again.");
    } finally {
      // Wait for minimum save time to complete before hiding loading state
      await minSaveTime;
      setSaving(false);
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleSidebarClose = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Navigate to different tab
  const handleNavigate = (tab: "hero" | "about" | "contact" | "footer" | "settings") => {
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
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onSidebarClose={handleSidebarClose}
      />

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <Dashboard
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

        {/* Contact Section Editor */}
        {activeTab === "contact" && contactForm && (
          <ContactEditor
            contactData={contactData!}
            onSave={updateSection}
            saving={saving}
          />
        )}

        {/* Footer Section Editor */}
        {activeTab === "footer" && footerForm && (
          <FooterEditor
            footerData={footerData!}
            onSave={updateSection}
            saving={saving}
          />
        )}

        {/* Blog Editor Tab */}
        {activeTab === "blog" && (
          <BlogEditor
            onMessage={showMessageFn}
            onSave={() => {}}
            saving={saving}
          />
        )}

        {/* Projects Editor Tab */}
        {activeTab === "projects" && (
          <ProjectEditor
            onMessage={showMessageFn}
            onSave={() => {
              // Refresh projects data after save
              loadAllData();
            }}
            saving={saving}
            projects={projectsData}
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

