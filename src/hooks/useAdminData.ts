'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AdminStats, PaginationMeta, RegistrasiData } from '@/types/admin'
import toast from 'react-hot-toast'

interface UseAdminDataParams {
  search?: string
  status?: string
  page?: number
  limit?: number
}

interface UseAdminDataReturn {
  data: RegistrasiData[]
  stats: AdminStats
  pagination: PaginationMeta
  loading: boolean
  refetch: () => void
}

export function useAdminData({
  search = '',
  status = 'ALL',
  page = 1,
  limit = 20,
}: UseAdminDataParams = {}): UseAdminDataReturn {
  const [data, setData] = useState<RegistrasiData[]>([])
  const [stats, setStats] = useState<AdminStats>({})
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set('search', search)
      if (status && status !== 'ALL') params.set('status', status)

      const res = await fetch(`/api/admin/pendaftar?${params}`)

      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/studio/admin/login'
        }
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
  }, [search, status, page, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, stats, pagination, loading, refetch: fetchData }
}
