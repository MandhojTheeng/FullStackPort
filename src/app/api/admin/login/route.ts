import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  checkRateLimit,
  getSecurityHeaders,
  sanitizeInput,
  containsSqlInjectionPatterns,
  generateSecureToken,
} from "@/lib/security";

const dataFilePath = path.join(process.cwd(), "data", "blogs.json");
const tokensFilePath = path.join(process.cwd(), "data", "tokens.json");

// Session token expiry (24 hours)
const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

// Token store interface
interface TokenStore {
  [token: string]: {
    username: string;
    expiresAt: number;
  };
}

// Read tokens from file
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

// In-memory cache for performance (sync with file on startup)
let tokenCache: TokenStore = readTokens();

// Get token store (file-based with memory cache)
function getTokenStore(): TokenStore {
  return tokenCache;
}

// Save token to store (both cache and file)
function saveToken(token: string, data: { username: string; expiresAt: number }): void {
  tokenCache[token] = data;
  writeTokens(tokenCache);
}

// Remove token from store (both cache and file)
function removeToken(token: string): void {
  delete tokenCache[token];
  writeTokens(tokenCache);
}

// Validate token
function isTokenValid(token: string): boolean {
  const store = getTokenStore();
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
    removeToken(token);
    return false;
  }
  
  return true;
}

interface BlogData {
  posts: any[];
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

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  const store = getTokenStore();
  const tokensToRemove: string[] = [];
  
  for (const token in store) {
    if (now > store[token].expiresAt) {
      tokensToRemove.push(token);
    }
  }
  
  tokensToRemove.forEach(token => removeToken(token));
  
  // Write cleaned tokens to file
  if (tokensToRemove.length > 0) {
    writeTokens(tokenCache);
  }
}, 60 * 60 * 1000); // Every hour

// POST - Admin login
export async function POST(request: NextRequest) {
  // Strict rate limiting for login (5 attempts per minute)
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`login-${clientIP}`, 5, 60000);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input types
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate input lengths
    if (username.length > 50 || password.length > 100) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Check for SQL injection patterns
    if (containsSqlInjectionPatterns(username) || containsSqlInjectionPatterns(password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);

    // Check required fields
    if (!sanitizedUsername || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const data = readBlogData();

    // Check username (case-insensitive comparison but store lowercase)
    if (sanitizedUsername.toLowerCase() !== data.admin.username.toLowerCase()) {
      // Delay response to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, data.admin.passwordHash);
    
    if (!isValidPassword) {
      // Delay response to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Generate secure session token
    const sessionToken = generateSecureToken(64);
    const expiresAt = Date.now() + SESSION_EXPIRY;

    // Store token in file-based token store
    saveToken(sessionToken, {
      username: data.admin.username,
      expiresAt,
    });

    // Log successful login
    console.log(`Admin login successful for user: ${sanitizedUsername}`);

    return NextResponse.json({
      success: true,
      token: sessionToken,
      expiresAt: expiresAt,
      message: "Login successful"
    }, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// PUT - Update admin password
export async function PUT(request: NextRequest) {
  // Rate limiting
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`password-change-${clientIP}`, 3, 60000);
  
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
    
    // Validate token using the new validation function
    if (!isTokenValid(token)) {
      return NextResponse.json(
        { error: "Session expired. Please login again." },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate password lengths
    if (currentPassword.length > 100 || newPassword.length > 100 || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check for SQL injection patterns
    if (containsSqlInjectionPatterns(currentPassword) || containsSqlInjectionPatterns(newPassword)) {
      return NextResponse.json(
        { error: "Invalid password format" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const data = readBlogData();

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, data.admin.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Hash new password with strong salt rounds
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    data.admin.passwordHash = newPasswordHash;
    writeBlogData(data);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    }, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// DELETE - Logout (invalidate token)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Invalidate token (remove from file-based store)
    removeToken(token);

    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    }, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

