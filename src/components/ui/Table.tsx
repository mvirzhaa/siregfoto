import { cn } from '@/lib/utils'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
      <table className={cn('w-full text-sm text-left', className)}>
        {children}
      </table>
    </div>
  )
}

export function Thead({ children, className }: TableProps) {
  return (
    <thead className={cn('bg-uika-700 text-white', className)}>
      {children}
    </thead>
  )
}

export function Tbody({ children, className }: TableProps) {
  return <tbody className={cn('divide-y divide-slate-50', className)}>{children}</tbody>
}

export function Th({ children, className }: TableProps) {
  return (
    <th className={cn('px-4 py-3 font-semibold text-xs uppercase tracking-wide', className)}>
      {children}
    </th>
  )
}

interface TdProps extends TableProps {
  colSpan?: number
}

export function Td({ children, className, colSpan }: TdProps) {
  return (
    <td
      colSpan={colSpan}
      className={cn('px-4 py-3 text-slate-700 whitespace-nowrap', className)}
    >
      {children}
    </td>
  )
}

export function Tr({ children, className }: TableProps) {
  return (
    <tr className={cn('hover:bg-uika-50 transition-colors', className)}>{children}</tr>
  )
}
