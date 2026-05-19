import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale'
import { nanoid } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominal)
}

export function formatTanggal(date: Date | string): string {
  return format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: localeID })
}

export function formatTanggalPendek(date: Date | string): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: localeID })
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: localeID })
}

export function generateNomorRegistrasi(): string {
  const today = format(new Date(), 'yyyyMMdd')
  const suffix = nanoid(4).toUpperCase()
  return `REG-${today}-${suffix}`
}

export function generateNomorKwitansi(): string {
  const today = format(new Date(), 'yyyyMMdd')
  const suffix = nanoid(4).toUpperCase()
  return `KWT-${today}-${suffix}`
}
