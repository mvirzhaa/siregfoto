import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import type { AdminSession } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const basePath = '/studio'

  // We check for paths that start with `/studio/admin` or `/admin`
  const isAdminPath = pathname.startsWith(`${basePath}/admin`) || pathname.startsWith('/admin')
  const isLoginPath = pathname.startsWith(`${basePath}/admin/login`) || pathname.startsWith('/admin/login')

  if (isAdminPath && !isLoginPath) {
    const response = NextResponse.next()
    const session = await getIronSession<AdminSession>(request, response, sessionOptions)

    if (!session.isLoggedIn) {
      // Redirect to login page under appropriate base path
      const targetRedirectPath = pathname.startsWith(basePath)
        ? `${basePath}/admin/login`
        : '/admin/login'
      const loginUrl = new URL(targetRedirectPath, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
