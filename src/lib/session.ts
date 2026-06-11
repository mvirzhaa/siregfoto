import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface AdminSession {
  isLoggedIn: boolean
  loginAt?: string
  // Step 1 passed, waiting for TOTP
  pendingTotpUserId?: string
  pendingTotpAt?: string
}

export const sessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET as string,
  cookieName: 'studio-bppsi-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8 jam
    sameSite: 'lax',
  },
}

export async function getAdminSession() {
  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions
  )
  return session
}
