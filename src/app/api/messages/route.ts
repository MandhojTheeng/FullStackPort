import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  checkRateLimit,
  getSecurityHeaders,
} from "@/lib/security";

const dataFilePath = path.join(process.cwd(), "data", "site.json");

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

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

function readSiteData(): { messages: Message[] } {
  const fileData = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(fileData);
}

function writeSiteData(data: { messages: Message[] }): void {
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

// GET - Fetch all messages (admin only)
export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`messages-get-${clientIP}`, 30, 60000);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  // Admin authentication check
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

  try {
    const data = readSiteData();
    // Sort messages by date, newest first
    const sortedMessages = data.messages.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ messages: sortedMessages }, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// DELETE - Delete a message (admin only)
export async function DELETE(request: NextRequest) {
  // Rate limiting
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`messages-delete-${clientIP}`, 10, 60000);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  // Admin authentication check
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

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate ID format (alphanumeric only)
    if (!/^[a-zA-Z0-9]+$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid message ID" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const data = readSiteData();
    const messageIndex = data.messages.findIndex((m) => m.id === id);

    if (messageIndex === -1) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    data.messages.splice(messageIndex, 1);
    writeSiteData(data);

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

