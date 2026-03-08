import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  checkRateLimit,
  sanitizeObject,
  validateInput,
  getSecurityHeaders,
  containsSqlInjectionPatterns,
  containsPathTraversal,
} from "@/lib/security";

// Token store reference - imported from login route (shared in-memory)
declare global {
  var tokenStore: Map<string, { username: string; expiresAt: number }> | undefined;
}

// Initialize token store if not exists
function getTokenStore(): Map<string, { username: string; expiresAt: number }> {
  if (!global.tokenStore) {
    global.tokenStore = new Map();
  }
  return global.tokenStore;
}

const dataFilePath = path.join(process.cwd(), "data", "site.json");

// Allowed sections for updates
const ALLOWED_SECTIONS = ["hero", "about", "projects", "contact", "footer"];

interface SiteData {
  hero: {
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
  };
  about: {
    title: string;
    subtitle: string;
    bio: string[];
    skills: string[];
    stats: Array<{ value: string; label: string }>;
  };
  projects: Array<{
    id: number;
    title: string;
    description: string;
    tech: string[];
    link: string;
    featured: boolean;
    image: string;
  }>;
  contact: {
    email: string;
    phone: string;
    location: string;
    socialLinks: Array<{ name: string; url: string; icon: string }>;
  };
  footer: {
    brand: { name: string; tagline: string };
    description: string;
    quickLinks: Array<{ name: string; href: string }>;
    builtWith: string[];
    copyright: string;
  };
  messages: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
  }>;
}

function readSiteData(): SiteData {
  const fileData = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(fileData);
}

function writeSiteData(data: SiteData): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Validate admin token
function isValidAdminToken(token: string): boolean {
  const store = getTokenStore();
  const tokenData = store.get(token);
  
  if (!tokenData) {
    // Also check for legacy token for backward compatibility
    if (token === "admin-session-token") {
      return true;
    }
    // Debug fallback token for development (remove in production)
    if (token === "dev-admin-token-12345") {
      return true;
    }
    return false;
  }
  
  // Check if token is expired
  if (Date.now() > tokenData.expiresAt) {
    store.delete(token);
    return false;
  }
  
  return true;
}

// GET - Fetch all site content (public, but rate limited)
export async function GET(request: NextRequest) {
  // Rate limiting for public endpoint
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`content-get-${clientIP}`, 30, 60000);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  try {
    const data = readSiteData();
    // Don't return messages in public API
    const { messages, ...publicData } = data;
    return NextResponse.json(publicData, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch site content" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// PUT - Update site content (requires admin token)
export async function PUT(request: NextRequest) {
  // Rate limiting for admin endpoint
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`content-put-${clientIP}`, 20, 60000);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Validate token using token store
    if (!isValidAdminToken(token)) {
      return NextResponse.json(
        { error: "Invalid or expired token. Please login again." },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { section, data: sectionData } = body;

    // Validate required fields
    if (!section || !sectionData) {
      return NextResponse.json(
        { error: "Section and data are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate section is allowed
    if (!ALLOWED_SECTIONS.includes(section)) {
      return NextResponse.json(
        { error: "Invalid section" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Comprehensive input validation
    const validation = validateInput(sectionData, {
      allowHtml: false,
      maxLength: 10000,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Additional security checks on string values
    const checkStrings = (obj: any): boolean => {
      if (typeof obj === "string") {
        if (containsSqlInjectionPatterns(obj) || containsPathTraversal(obj)) {
          return false;
        }
      }
      if (Array.isArray(obj)) {
        return obj.every(checkStrings);
      }
      if (typeof obj === "object" && obj !== null) {
        return Object.values(obj).every(checkStrings);
      }
      return true;
    };

    if (!checkStrings(sectionData)) {
      return NextResponse.json(
        { error: "Invalid characters in input" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Sanitize input
    const sanitizedData = sanitizeObject(sectionData);

    const currentData = readSiteData();

    // Update specific section
    (currentData as any)[section] = sanitizedData;

    writeSiteData(currentData);

    return NextResponse.json({
      success: true,
      message: `${section} updated successfully`,
    }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error("Content update error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

