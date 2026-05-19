import { Clock, CheckCircle2, ThumbsUp, Archive } from 'lucide-react'
import type { AdminStats } from '@/types/admin'

interface DashboardStatsProps {
  stats: AdminStats
}

const statConfig = [
  {
    key: 'PENDING' as const,
    label: 'Menunggu Validasi',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    key: 'VALIDATED' as const,
    label: 'Sudah Divalidasi',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    key: 'APPROVED' as const,
    label: 'Disetujui',
    icon: ThumbsUp,
    color: 'text-uika-700',
    bg: 'bg-uika-50',
    border: 'border-uika-100',
  },
  {
    key: 'COMPLETED' as const,
    label: 'Selesai',
    icon: Archive,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-100',
  },
]

export function DashboardStats({ stats }: DashboardStatsProps) {
  const total = Object.values(stats).reduce((a, b) => a + (b ?? 0), 0)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statConfig.map(({ key, label, icon: Icon, color, bg, border }) => (
        <div
          key={key}
          className={`${bg} border ${border} rounded-xl p-4 flex flex-col gap-2`}
        >
          <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
            <Icon size={18} className={color} />
          </div>
          <p className={`text-2xl font-bold ${color}`}>{stats[key] ?? 0}</p>
          <p className="text-xs text-slate-500 leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}
