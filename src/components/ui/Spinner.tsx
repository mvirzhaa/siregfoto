import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const sizeMap = { sm: 16, md: 24, lg: 36 }

export function Spinner({ size = 'md', className, text }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2
        className="animate-spin text-uika-700"
        size={sizeMap[size]}
        aria-label="Memuat..."
      />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  )
}
