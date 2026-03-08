import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  checkRateLimit,
  validateInput,
  isValidEmail,
  getSecurityHeaders,
  containsSqlInjectionPatterns,
  sanitizeInput,
} from "@/lib/security";

const dataFilePath = path.join(process.cwd(), "data", "site.json");

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

// POST - Submit contact form
export async function POST(request: NextRequest) {
  // Strict rate limiting for contact form (5 requests per minute per IP)
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  console.log(`[Contact API] POST request from IP: ${clientIP}`);
  
  const rateLimit = checkRateLimit(`contact-post-${clientIP}`, 5, 60000);
  
  if (!rateLimit.success) {
    console.log(`[Contact API] Rate limit exceeded for IP: ${clientIP}`);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  try {
    const body = await request.json();
    console.log(`[Contact API] Received message from: ${body.name} (${body.email})`);
    
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      console.log(`[Contact API] Missing required fields`);
      return NextResponse.json(
        { error: "Missing required fields: name, email, and message are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate input types
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      console.log(`[Contact API] Invalid input types`);
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate input length
    if (name.length > 100 || email.length > 100 || message.length > 5000) {
      console.log(`[Contact API] Input exceeds maximum length`);
      return NextResponse.json(
        { error: "Input exceeds maximum length" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.log(`[Contact API] Invalid email format: ${email}`);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check for SQL injection patterns
    if (containsSqlInjectionPatterns(name) || containsSqlInjectionPatterns(message)) {
      console.log(`[Contact API] SQL injection pattern detected`);
      return NextResponse.json(
        { error: "Invalid characters in input" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedMessage = sanitizeInput(message);

    // Read current data
    const data = readSiteData();

    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      createdAt: new Date().toISOString(),
    };

    // Add to messages array (limit to last 100 messages to prevent file bloat)
    data.messages.push(newMessage);
    if (data.messages.length > 100) {
      data.messages = data.messages.slice(-100);
    }

    // Save data
    writeSiteData(data);
    
    console.log(`[Contact API] Message saved successfully. Total messages: ${data.messages.length}`);

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error(`[Contact API] Error:`, error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// GET - Get contact info (public, rate limited)
export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIP = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`contact-get-${clientIP}`, 30, 60000);
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: getSecurityHeaders() }
    );
  }

  try {
    const data = readSiteData();
    // Return only public contact info (not messages)
    const { messages, ...contactInfo } = data;
    return NextResponse.json(contactInfo, { headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

