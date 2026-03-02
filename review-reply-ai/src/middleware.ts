import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // --- 1. Generate nonce for CSP ---
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // --- 2. Build CSP header ---
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://pagead2.googlesyndication.com https://accounts.google.com https://adservice.google.com",
    "frame-src https://js.stripe.com https://accounts.google.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://td.doubleclick.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'none'",
  ].join('; ')

  // --- 3. Pass nonce to layout via request header ---
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  // --- 4. Supabase session handling ---
  let response: NextResponse

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    response = NextResponse.next({ request: { headers: requestHeaders } })
  } else {
    // Import and run Supabase session update with modified headers
    const { updateSession } = await import('@/lib/supabase/middleware')
    // Create a modified request with the nonce header
    const modifiedRequest = new Request(request.url, {
      headers: requestHeaders,
      method: request.method,
      body: request.body,
      redirect: 'manual',
    }) as unknown as NextRequest
    // Copy cookies from original request
    Object.defineProperty(modifiedRequest, 'cookies', { get: () => request.cookies })
    Object.defineProperty(modifiedRequest, 'nextUrl', { get: () => request.nextUrl })

    response = await updateSession(modifiedRequest)
  }

  // --- 5. Set security headers on response ---
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
