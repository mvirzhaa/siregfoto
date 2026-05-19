'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { TabelPendaftar } from '@/components/admin/TabelPendaftar'
import { FilterBar } from '@/components/admin/FilterBar'
import { ExportButton } from '@/components/admin/ExportButton'
import type { AdminStats, PaginationMeta, RegistrasiData } from '@/types/admin'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const [data, setData] = useState<RegistrasiData[]>([])
  const [stats, setStats] = useState<AdminStats>({})
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 20, total: 0, totalPages: 1,
  })
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(1)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (status !== 'ALL') params.set('status', status)

      const res = await fetch(`/api/admin/pendaftar?${params}`)
      if (res.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setStats(json.stats)
        setPagination(json.pagination)
      }
    } catch {
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [search, status, page])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchData()
    }, search ? 400 : 0)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page])

  function handleReset() {
    setSearch('')
    setStatus('ALL')
    setPage(1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <main className="flex-1 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Kelola pendaftaran foto ijazah & sidik jari
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={fetchData}
              loading={loading}
            >
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <DashboardStats stats={stats} />

          {/* Filter + Export */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex-1 w-full">
              <FilterBar
                search={search}
                status={status}
                onSearchChange={setSearch}
                onStatusChange={(v) => { setStatus(v); setPage(1) }}
                onReset={handleReset}
              />
            </div>
            <ExportButton status={status !== 'ALL' ? status : undefined} />
          </div>

          {/* Tabel */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <TabelPendaftar data={data} loading={loading} />
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-500">
                Menampilkan {(page - 1) * pagination.limit + 1}–
                {Math.min(page * pagination.limit, pagination.total)} dari{' '}
                {pagination.total} pendaftar
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ChevronLeft size={14} />}
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
