import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers to apply
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Block access to sensitive files
  if (
    pathname.includes('/.env') ||
    pathname.includes('/.git') ||
    pathname.includes('/node_modules') ||
    pathname.includes('\\..*') ||
    pathname.endsWith('.config.js') ||
    pathname.endsWith('.config.ts') ||
    pathname.endsWith('.log')
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // API rate limiting header (client-side check)
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Window', '60s');

  return response;
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};

