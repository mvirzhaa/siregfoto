import { cn } from '@/lib/utils'
import { LABEL_STATUS, WARNA_STATUS } from '@/lib/constants'

type Status = keyof typeof LABEL_STATUS

interface BadgeProps {
  status: Status
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        WARNA_STATUS[status],
        className
      )}
    >
      {LABEL_STATUS[status]}
    </span>
  )
}

interface GenericBadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'yellow' | 'blue' | 'red' | 'gray'
  className?: string
}

export function GenericBadge({ children, variant = 'green', className }: GenericBadgeProps) {
  const variantClass = {
    green: 'bg-uika-100 text-uika-800 border border-uika-200',
    yellow: 'bg-kuning-100 text-kuning-800 border border-kuning-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    red: 'bg-red-100 text-red-700 border border-red-200',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClass[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
