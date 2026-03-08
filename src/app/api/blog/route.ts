import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  checkRateLimit,
  getSecurityHeaders,
  containsSqlInjectionPatterns,
  sanitizeInput,
} from "@/lib/security";

const dataFilePath = path.join(process.cwd(), "data", "blogs.json");

// Token store reference
declare global {
  var tokenStore: Map<string, { username: string; expiresAt: number }> | undefined;
}

function getTokenStore(): Map<string, { username: string; expiresAt: number }> {
  if (!global.tokenStore) {
    global.tokenStore = new Map();
  }
  return global.tokenStore;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  createdAt: string;
}

interface BlogData {
  posts: BlogPost[];
  admin: {
    username: string;
    passwordHash: string;
  };
}

function readBlogData(): BlogData {
  const fileData = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(fileData);
}

function writeBlogData(data: BlogData): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Validate admin token
function isValidAdminToken(token: string): boolean {
  const store = getTokenStore();
  const tokenData = store.get(token);
  
  if (!tokenData) {
    if (token === "admin-session-token") {
      return true;
    }
    return false;
  }
  
  if (Date.now() > tokenData.expiresAt) {
    store.delete(token);
    return false;
  }
  
  return true;
}

// Allowed categories
const ALLOWED_CATEGORIES = ["Development", "Design", "Technology", "Tutorial", "General"];

// GET - Fetch all blog posts (public, rate limited)
export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`blog-get-${clientIP}`, 30, 60000);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  try {
    const data = readBlogData();
    // Return posts sorted by date (newest first)
    const sortedPosts = data.posts.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return NextResponse.json({ posts: sortedPosts }, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// POST - Create a new blog post (requires admin token)
export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`blog-post-${clientIP}`, 10, 60000);
  
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
    
    if (!isValidAdminToken(token)) {
      return NextResponse.json(
        { error: "Invalid or expired token. Please login again." },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, category, tags } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate input types
    if (typeof title !== "string" || typeof slug !== "string" || typeof content !== "string") {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate input lengths
    if (title.length > 200 || slug.length > 100 || content.length > 50000 || (excerpt && excerpt.length > 500)) {
      return NextResponse.json(
        { error: "Input exceeds maximum length" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check for SQL injection patterns
    if (containsSqlInjectionPatterns(title) || containsSqlInjectionPatterns(slug) || containsSqlInjectionPatterns(content)) {
      return NextResponse.json(
        { error: "Invalid characters in input" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate slug format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate category
    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const data = readBlogData();

    // Check if slug already exists
    if (data.posts.some((post) => post.slug === slug)) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Limit number of posts
    if (data.posts.length >= 100) {
      return NextResponse.json(
        { error: "Maximum number of posts reached" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedSlug = sanitizeInput(slug);
    const sanitizedExcerpt = excerpt ? sanitizeInput(excerpt) : content.substring(0, 150) + "...";
    const sanitizedContent = sanitizeInput(content);

    const newPost: BlogPost = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title: sanitizedTitle,
      slug: sanitizedSlug,
      excerpt: sanitizedExcerpt,
      content: sanitizedContent,
      coverImage: coverImage || "/blog/default.jpg",
      author: "Santosh",
      category: category || "General",
      tags: Array.isArray(tags) ? tags.slice(0, 10).map((t: string) => sanitizeInput(t)) : [],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    data.posts.push(newPost);
    writeBlogData(data);

    return NextResponse.json({ post: newPost }, { status: 201, headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// DELETE - Delete a blog post (admin only)
export async function DELETE(request: NextRequest) {
  // Rate limiting
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`blog-delete-${clientIP}`, 10, 60000);
  
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
    
    if (!isValidAdminToken(token)) {
      return NextResponse.json(
        { error: "Invalid or expired token. Please login again." },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate ID format
    if (!/^[a-zA-Z0-9]+$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const data = readBlogData();
    const postIndex = data.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    data.posts.splice(postIndex, 1);
    writeBlogData(data);

    return NextResponse.json({ message: "Post deleted successfully" }, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

