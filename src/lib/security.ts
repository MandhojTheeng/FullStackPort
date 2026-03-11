// Security utilities for API protection

// Rate limiting - Simple in-memory implementation
// In production, use Redis or database
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // New request window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

// Input sanitization to prevent XSS
export function sanitizeInput(input: string | undefined): string {
  if (!input) return "";
  
  return input
    .replace(/[<>]/g, "") // Remove < and > characters
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

// Sanitize object recursively
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeInput(item) : item
      );
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate URL format (only allow http/https)
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Validate URL in object properties
export function validateUrlsInObject(obj: Record<string, any>): boolean {
  const urlFields = ["link", "url", "href", "image", "ctaPrimaryLink", "ctaSecondaryLink"];
  
  for (const [key, value] of Object.entries(obj)) {
    if (urlFields.includes(key) && value && typeof value === "string") {
      // Allow relative URLs (starting with / or #)
      if (value.startsWith("/") || value.startsWith("#") || value.startsWith("http")) {
        if (value.startsWith("http") && !isValidUrl(value)) {
          return false;
        }
      }
    }
  }
  return true;
}

// Maximum length limits
const MAX_STRING_LENGTH = 5000;
const MAX_ARRAY_LENGTH = 100;
const MAX_DEPTH = 10;

// Validate data size and structure
export function validateDataSize(data: any, depth: number = 0): boolean {
  if (depth > MAX_DEPTH) return false;
  
  if (typeof data === "string") {
    return data.length <= MAX_STRING_LENGTH;
  }
  
  if (Array.isArray(data)) {
    if (data.length > MAX_ARRAY_LENGTH) return false;
    return data.every((item) => validateDataSize(item, depth + 1));
  }
  
  if (typeof data === "object" && data !== null) {
    return Object.values(data).every((value) => 
      validateDataSize(value, depth + 1)
    );
  }
  
  return true;
}

// Generate secure token (for session management)
export function generateSecureToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  const randomValues = new Uint8Array(length);
  
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // Fallback for non-secure random
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }
  
  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  
  return token;
}

// Hash password (using simple bcrypt-like simulation)
// In production, use bcrypt or argon2
export async function hashPassword(password: string): Promise<string> {
  // This is a placeholder - use proper bcrypt in production
  const salt = generateSecureToken(16);
  const hash = btoa(password + salt);
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [salt, hash] = stored.split(":");
    return btoa(password + salt) === hash;
  } catch {
    return false;
  }
}

// Check for SQL injection patterns (for file-based storage, this is additional protection)
// Only flag actual SQL injection attempts, not common words like "where", "join", "or", "and"
export function containsSqlInjectionPatterns(input: string): boolean {
  // Skip short inputs that are likely not injection attempts
  if (input.length < 3) return false;
  
  // Only flag if it looks like an actual SQL injection attempt:
  // - Contains SQL keywords with punctuation (like "SELECT--", "UNION/*", etc.)
  // - Contains multiple SQL keywords in suspicious combinations
  // - Contains inline comments often used in SQL injection
  
  const dangerousPatterns = [
    /(\bSELECT\b.*(--|\/\*|#))/i,           // SELECT with comment
    /(\bUNION\b.*\bSELECT\b)/i,             // UNION SELECT
    /(\bINSERT\b.*\bINTO\b)/i,              // INSERT INTO
    /(\bDELETE\b.*\bFROM\b)/i,              // DELETE FROM
    /(\bUPDATE\b.*\bSET\b)/i,               // UPDATE SET
    /(\bDROP\b.*\bTABLE\b)/i,               // DROP TABLE
    /(\bCREATE\b.*\bTABLE\b)/i,             // CREATE TABLE
    /(\bALTER\b.*\bTABLE\b)/i,              // ALTER TABLE
    /(;\s*(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER))/i,  // Multiple statements
    /(\/\*!\d+\*\/)/,                       // MySQL comment injection
    /(0x[0-9a-fA-F]+)/,                     // Hex encoding attempts
    /(CHAR\s*\(\s*\d+\s*\))/i,             // CHAR encoding attempts
  ];
  
  // Check for dangerous patterns
  if (dangerousPatterns.some((pattern) => pattern.test(input))) {
    return true;
  }
  
  // Only flag if there's clear evidence of SQL injection attempt
  // Common words alone are not enough to flag
  return false;
}

// Check for path traversal attempts
export function containsPathTraversal(input: string): boolean {
  return input.includes("..") || input.includes("/.") || input.includes("\\.");
}

// Comprehensive input validation
export function validateInput(
  data: any,
  options: {
    allowHtml?: boolean;
    maxLength?: number;
    allowedFields?: string[];
  } = {}
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { allowHtml = false, maxLength = MAX_STRING_LENGTH, allowedFields } = options;

  if (!validateDataSize(data)) {
    errors.push("Data size exceeds maximum allowed");
    return { valid: false, errors };
  }

  function validate(obj: any, path: string = "") {
    if (typeof obj === "string") {
      if (!allowHtml && /<[^>]*>/.test(obj)) {
        errors.push(`${path}: HTML tags not allowed`);
      }
      if (obj.length > maxLength) {
        errors.push(`${path}: Exceeds maximum length of ${maxLength}`);
      }
      if (containsSqlInjectionPatterns(obj)) {
        errors.push(`${path}: Suspicious SQL patterns detected`);
      }
      if (containsPathTraversal(obj)) {
        errors.push(`${path}: Path traversal detected`);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => validate(item, `${path}[${index}]`));
    } else if (typeof obj === "object" && obj !== null) {
      // Check allowed fields
      if (allowedFields) {
        const extraFields = Object.keys(obj).filter((k) => !allowedFields.includes(k));
        if (extraFields.length > 0) {
          errors.push(`Unexpected fields: ${extraFields.join(", ")}`);
        }
      }
      Object.entries(obj).forEach(([key, value]) => {
        validate(value, path ? `${path}.${key}` : key);
      });
    }
  }

  validate(data);
  return { valid: errors.length === 0, errors };
}

// Security headers helper
export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  };
}

