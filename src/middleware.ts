import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import type { AdminSession } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteksi semua /admin kecuali /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const response = NextResponse.next()
    const session = await getIronSession<AdminSession>(request, response, sessionOptions)

    if (!session.isLoggedIn) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
