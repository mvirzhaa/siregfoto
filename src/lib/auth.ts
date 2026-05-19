import bcrypt from 'bcryptjs'
import { randomInt } from 'crypto'

// ── Password ──────────────────────────────────────────────────────────────────

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

// ── Email OTP ─────────────────────────────────────────────────────────────────

const OTP_VALID_MINUTES = 5

/** Generate 6-digit numeric OTP */
export function generateOtpCode(): string {
  return String(randomInt(100000, 999999))
}

/** Hash OTP sebelum disimpan ke DB */
export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 8) // cost factor rendah — OTP pendek dan expiry-based
}

/** Verifikasi OTP plain vs hash */
export async function verifyOtp(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash)
}

/** Hitung expiry (5 menit dari sekarang) */
export function otpExpiry(): Date {
  return new Date(Date.now() + OTP_VALID_MINUTES * 60 * 1000)
}

export const OTP_VALID_MINUTES_LABEL = OTP_VALID_MINUTES

// ── Brute Force (in-memory, per-IP) ──────────────────────────────────────────

const MAX_ATTEMPTS    = 5
const LOCKOUT_MINUTES = 15

interface AttemptRecord { count: number; lockedUntil: Date | null }
const ipAttempts = new Map<string, AttemptRecord>()

export function checkRateLimit(key: string): { allowed: boolean; remainingMs?: number } {
  const record = ipAttempts.get(key)
  if (!record) return { allowed: true }

  if (record.lockedUntil && record.lockedUntil > new Date()) {
    return { allowed: false, remainingMs: record.lockedUntil.getTime() - Date.now() }
  }
  if (record.lockedUntil && record.lockedUntil <= new Date()) {
    ipAttempts.delete(key)
  }
  return { allowed: true }
}

export function recordFailedAttempt(key: string): { locked: boolean; attemptsLeft: number } {
  const record = ipAttempts.get(key) ?? { count: 0, lockedUntil: null }
  record.count += 1
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
    ipAttempts.set(key, record)
    return { locked: true, attemptsLeft: 0 }
  }
  ipAttempts.set(key, record)
  return { locked: false, attemptsLeft: MAX_ATTEMPTS - record.count }
}

export function clearAttempts(key: string): void {
  ipAttempts.delete(key)
}

export function getClientIp(request: Request): string {
  const forwarded = (request.headers as Headers).get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
}
