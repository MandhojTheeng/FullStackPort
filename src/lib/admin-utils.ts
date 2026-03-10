// Admin Panel Utility Functions

import { Settings } from "./admin-types";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const loadSettings = (): Settings => {
  if (typeof window === "undefined") {
    return {
      siteName: "Santosh Portfolio",
      siteDescription: "Personal portfolio website",
      cacheEnabled: true,
      cacheDuration: 3600,
    };
  }
  
  const savedSettings = localStorage.getItem("siteSettings");
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return {
    siteName: "Santosh Portfolio",
    siteDescription: "Personal portfolio website",
    cacheEnabled: true,
    cacheDuration: 3600,
  };
};

export const saveSettings = (newSettings: Settings): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("siteSettings", JSON.stringify(newSettings));
};

export const clearCache = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("siteContentCache");
  localStorage.removeItem("siteContentCacheTime");
};

export const getCachedContent = () => {
  if (typeof window === "undefined") return null;
  
  const cached = localStorage.getItem("siteContentCache");
  const cacheTime = localStorage.getItem("siteContentCacheTime");
  
  if (cached && cacheTime) {
    return {
      data: JSON.parse(cached),
      cacheAge: Date.now() - parseInt(cacheTime),
    };
  }
  return null;
};

export const setCachedContent = (data: unknown): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("siteContentCache", JSON.stringify(data));
  localStorage.setItem("siteContentCacheTime", Date.now().toString());
};

export const showMessage = (
  setMessage: (msg: { type: "success" | "error"; text: string } | null) => void,
  type: "success" | "error",
  text: string
) => {
  setMessage({ type, text });
  setTimeout(() => setMessage(null), 3000);
};

export const parseKeyValueList = <T extends Record<string, string>>(
  value: string,
  key1: keyof T,
  key2: keyof T
): T[] => {
  return value.split("\n").filter(Boolean).map((line) => {
    const [first, second] = line.split(",");
    return {
      [key1]: first?.trim() || "",
      [key2]: second?.trim() || "",
    } as T;
  });
};

export const formatKeyValueList = <T extends Record<string, string>>(
  items: T[],
  key1: keyof T,
  key2: keyof T
): string => {
  return items.map((item) => `${item[key1]},${item[key2]}`).join("\n");
};

export const formatStatsList = (stats: Array<{ value: string; label: string }>): string => {
  return stats.map((s) => `${s.value},${s.label}`).join("\n");
};

export const parseStatsList = (value: string): Array<{ value: string; label: string }> => {
  return value.split("\n").filter(Boolean).map((line) => {
    const [value, label] = line.split(",");
    return { value: value?.trim() || "0", label: label?.trim() || "" };
  });
};

export const parseArray = (value: string): string[] => {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
};

export const formatArray = (arr: string[]): string => {
  return arr.join(", ");
};

export const isTokenValid = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("adminToken");
  const expiry = localStorage.getItem("adminTokenExpiry");
  
  if (!token || !expiry) return false;
  
  return Date.now() < parseInt(expiry);
};

export const logout = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminTokenExpiry");
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

