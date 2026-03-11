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

const dataFilePath = path.join(process.cwd(), "data", "site.json");
const tokensFilePath = path.join(process.cwd(), "data", "tokens.json");

// Token store interface
interface TokenStore {
  [token: string]: {
    username: string;
    expiresAt: number;
  };
}

// Read tokens from file (always read fresh for serverless environments)
function readTokens(): TokenStore {
  try {
    if (fs.existsSync(tokensFilePath)) {
      const data = fs.readFileSync(tokensFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading tokens file:", error);
  }
  return {};
}

// Write tokens to file
function writeTokens(tokens: TokenStore): void {
  try {
    fs.writeFileSync(tokensFilePath, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error("Error writing tokens file:", error);
  }
}

// Validate admin token - always read from file to ensure fresh data in serverless
function isValidAdminToken(token: string): boolean {
  // Always read from file to get the latest tokens in serverless environments
  const store = readTokens();
  const tokenData = store[token];
  
  if (!tokenData) {
    // Also check for legacy tokens for backward compatibility
    if (token === "admin-session-token" || token === "dev-admin-token-12345") {
      return true;
    }
    return false;
  }
  
  // Check if token is expired
  if (Date.now() > tokenData.expiresAt) {
    // Clean up expired token
    delete store[token];
    writeTokens(store);
    return false;
  }
  
  return true;
}

// Allowed sections for updates
const ALLOWED_SECTIONS = ["hero", "about", "contact", "footer", "projects"];

interface SiteData {
  hero: {
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
  };
  about: {
    title: string;
    heading: string;
    bio: string;
    expertise: Array<{ title: string; desc: string }>;
    stats: Array<{ value: string; label: string }>;
  };
  contact: {
    heading: string;
    description: string;
    email: string;
    location: string;
    socialLinks: Array<{ name: string; url: string; icon: string }>;
    copyright: string;
  };
  footer: {
    headingLine1: string;
    headingLine2: string;
    headingLine3: string;
    availabilityText: string;
    availabilitySubtext: string;
    navLinks: Array<{ name: string; href: string; desc: string }>;
    socialLinks: Array<{ name: string; url: string; icon: string }>;
    brandInitials: string;
    copyright: string;
  };
  projects: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    tech: string[];
    link: string;
    featured: boolean;
    image: string;
  }>;
}

function readSiteData(): SiteData {
  const fileData = fs.readFileSync(dataFilePath, "utf-8");
  const data = JSON.parse(fileData);
  
  // Handle legacy object format for projects - convert to array if needed
  if (data.projects && typeof data.projects === 'object' && !Array.isArray(data.projects)) {
    data.projects = Object.values(data.projects);
  }
  
  // Ensure projects is always an array
  if (!Array.isArray(data.projects)) {
    data.projects = [];
  }
  
  return data;
}

function writeSiteData(data: SiteData): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
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
    // Return all site data
    return NextResponse.json(data, { headers: getSecurityHeaders() });
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

    // Special handling for projects section - ensure it's always an array
    if (section === "projects") {
      if (Array.isArray(sectionData)) {
        // Already an array, use it directly
        (currentData as any)[section] = sectionData;
      } else if (typeof sectionData === 'object' && sectionData !== null) {
        // Convert object to array (legacy format)
        (currentData as any)[section] = Object.values(sectionData);
      } else {
        // Invalid format, initialize as empty array
        (currentData as any)[section] = [];
      }
    } else {
      // Update specific section
      (currentData as any)[section] = sanitizedData;
    }

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

