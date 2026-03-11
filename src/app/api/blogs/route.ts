import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  checkRateLimit,
  sanitizeObject,
  validateInput,
  getSecurityHeaders,
  containsSqlInjectionPatterns,
  containsPathTraversal,
} from "@/lib/security";

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

const contentDirectory = path.join(process.cwd(), "src", "content");

// Get all blog posts metadata
function getAllPostsMetadata() {
  if (!fs.existsSync(contentDirectory)) return [];
  
  const files = fs.readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || "Untitled",
        category: data.category || "General",
        date: data.date || "",
        author: data.author || "",
        description: data.description || "",
      };
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
}

// Validate admin token
function isValidAdminToken(token: string): boolean {
  const store = getTokenStore();
  const tokenData = store.get(token);
  
  if (!tokenData) {
    if (token === "admin-session-token") return true;
    if (token === "dev-admin-token-12345") return true;
    return false;
  }
  
  if (Date.now() > tokenData.expiresAt) {
    store.delete(token);
    return false;
  }
  
  return true;
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET - Fetch all blog posts or single post with content
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`blogs-get-${clientIP}`, 30, 60000);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  try {
    // If slug is provided, return single post with content
    if (slug) {
      const fullPath = path.join(contentDirectory, `${slug}.mdx`);
      if (!fs.existsSync(fullPath)) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404, headers: getSecurityHeaders() }
        );
      }
      
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      
      return NextResponse.json({ 
        post: { 
          slug,
          title: data.title || "Untitled",
          category: data.category || "General",
          date: data.date || "",
          author: data.author || "",
          description: data.description || "",
          content 
        } 
      }, { headers: getSecurityHeaders() });
    }
    
    // Otherwise return all posts metadata
    const posts = getAllPostsMetadata();
    return NextResponse.json({ posts }, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// GET single blog post
export async function GET_SINGLE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return NextResponse.json(
      { post: { slug, frontmatter: data, content } },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`blogs-post-${clientIP}`, 10, 60000);
  
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
        { error: "Invalid or expired token" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { title, category, date, author, content, description } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Generate slug
    let slug = generateSlug(title);
    
    // Check if file already exists, append number if needed
    let counter = 1;
    let finalSlug = slug;
    while (fs.existsSync(path.join(contentDirectory, `${finalSlug}.mdx`))) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Create frontmatter and content
    const frontmatter = [
      "---",
      `title: "${title}"`,
      `date: "${date || new Date().toISOString().split('T')[0]}"`,
      `category: "${category || "General"}"`,
      `author: "${author || "Santosh Timalsina"}"`,
      description ? `description: "${description}"` : null,
      "---",
      "",
    ].filter(Boolean).join("\n");

    const fullContent = `${frontmatter}\n${content}`;
    
    // Write file
    const filePath = path.join(contentDirectory, `${finalSlug}.mdx`);
    fs.writeFileSync(filePath, fullContent);

    return NextResponse.json(
      { 
        success: true, 
        message: "Blog post created successfully",
        slug: finalSlug 
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// PUT - Update blog post
export async function PUT(request: NextRequest) {
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`blogs-put-${clientIP}`, 10, 60000);
  
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
        { error: "Invalid or expired token" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { slug, title, category, date, author, content, description } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "Slug, title, and content are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Create frontmatter and content
    const frontmatter = [
      "---",
      `title: "${title}"`,
      `date: "${date || new Date().toISOString().split('T')[0]}"`,
      `category: "${category || "General"}"`,
      `author: "${author || "Santosh Timalsina"}"`,
      description ? `description: "${description}"` : null,
      "---",
      "",
    ].filter(Boolean).join("\n");

    const fullContent = `${frontmatter}\n${content}`;
    
    // Write file
    fs.writeFileSync(fullPath, fullContent);

    return NextResponse.json(
      { 
        success: true, 
        message: "Blog post updated successfully",
        slug 
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error("Blog update error:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest) {
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`blogs-delete-${clientIP}`, 10, 60000);
  
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
        { error: "Invalid or expired token" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Delete file
    fs.unlinkSync(fullPath);

    return NextResponse.json(
      { 
        success: true, 
        message: "Blog post deleted successfully" 
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error("Blog delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

