'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ArrowLeft, Plus, Pencil, ToggleLeft, ToggleRight, ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { MasterFakultas, MasterProdi } from '@/types/admin'

// ── Types ────────────────────────────────────────────────────────────────────
type FakultasWithProdi = MasterFakultas & { prodi?: MasterProdi[] }

// ── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent'

// ── Component ────────────────────────────────────────────────────────────────
export default function MasterDataPage() {
  const [fakultasList, setFakultasList] = useState<FakultasWithProdi[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Modal state
  const [modalFak, setModalFak] = useState(false)
  const [modalProdi, setModalProdi] = useState(false)
  const [editFak, setEditFak] = useState<MasterFakultas | null>(null)
  const [editProdi, setEditProdi] = useState<MasterProdi | null>(null)
  const [selectedFakId, setSelectedFakId] = useState('')

  // Form state
  const [fakForm, setFakForm] = useState({ nama: '', kode: '', urutan: 0 })
  const [prodiForm, setProdiForm] = useState({ nama: '', kode: '', urutan: 0, fakultasId: '' })
  const [saving, setSaving] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const [fakRes, prodiRes] = await Promise.all([
        fetch('/api/master/fakultas?all=true').then(r => r.json()),
        fetch('/api/master/prodi?all=true').then(r => r.json()),
      ])
      if (fakRes.success && prodiRes.success) {
        const prodis: MasterProdi[] = prodiRes.data
        const faks: FakultasWithProdi[] = (fakRes.data as MasterFakultas[]).map(f => ({
          ...f,
          prodi: prodis.filter(p => p.fakultasId === f.id),
        }))
        setFakultasList(faks)
      }
    } catch { toast.error('Gagal memuat data') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  // ── Fakultas CRUD ──────────────────────────────────────────────────────────
  function openAddFak() {
    setEditFak(null)
    setFakForm({ nama: '', kode: '', urutan: fakultasList.length })
    setModalFak(true)
  }

  function openEditFak(f: MasterFakultas) {
    setEditFak(f)
    setFakForm({ nama: f.nama, kode: f.kode, urutan: f.urutan })
    setModalFak(true)
  }

  async function saveFak() {
    if (!fakForm.nama.trim() || !fakForm.kode.trim()) { toast.error('Nama dan kode wajib diisi'); return }
    setSaving(true)
    try {
      const url = editFak ? `/api/master/fakultas/${editFak.id}` : '/api/master/fakultas'
      const method = editFak ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fakForm) })
      const json = await res.json()
      if (!res.ok) { toast.error(json.message ?? 'Gagal menyimpan'); return }
      toast.success(editFak ? 'Fakultas diupdate' : 'Fakultas ditambahkan')
      setModalFak(false)
      loadData()
    } catch { toast.error('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  async function toggleFak(f: MasterFakultas) {
    try {
      const res = await fetch(`/api/master/fakultas/${f.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aktif: !f.aktif }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.message ?? 'Gagal'); return }
      toast.success(f.aktif ? 'Fakultas dinonaktifkan' : 'Fakultas diaktifkan')
      loadData()
    } catch { toast.error('Terjadi kesalahan') }
  }

  // ── Prodi CRUD ─────────────────────────────────────────────────────────────
  function openAddProdi(fakultasId: string) {
    setEditProdi(null)
    setSelectedFakId(fakultasId)
    const fak = fakultasList.find(f => f.id === fakultasId)
    const cnt = fak?.prodi?.length ?? 0
    setProdiForm({ nama: '', kode: '', urutan: cnt, fakultasId })
    setModalProdi(true)
  }

  function openEditProdi(p: MasterProdi) {
    setEditProdi(p)
    setProdiForm({ nama: p.nama, kode: p.kode, urutan: p.urutan, fakultasId: p.fakultasId })
    setSelectedFakId(p.fakultasId)
    setModalProdi(true)
  }

  async function saveProdi() {
    if (!prodiForm.nama.trim() || !prodiForm.kode.trim()) { toast.error('Nama dan kode wajib diisi'); return }
    setSaving(true)
    try {
      const url = editProdi ? `/api/master/prodi/${editProdi.id}` : '/api/master/prodi'
      const method = editProdi ? 'PATCH' : 'POST'
      const body = editProdi
        ? { nama: prodiForm.nama, kode: prodiForm.kode, urutan: prodiForm.urutan }
        : prodiForm
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) { toast.error(json.message ?? 'Gagal menyimpan'); return }
      toast.success(editProdi ? 'Prodi diupdate' : 'Prodi ditambahkan')
      setModalProdi(false)
      loadData()
    } catch { toast.error('Terjadi kesalahan') }
    finally { setSaving(false) }
  }

  async function toggleProdi(p: MasterProdi) {
    try {
      const res = await fetch(`/api/master/prodi/${p.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aktif: !p.aktif }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.message ?? 'Gagal'); return }
      toast.success(p.aktif ? 'Prodi dinonaktifkan' : 'Prodi diaktifkan')
      loadData()
    } catch { toast.error('Terjadi kesalahan') }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-5">

          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-uika-700 hover:text-uika-900">
            <ArrowLeft size={15} /> Kembali ke Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Master Data</h1>
              <p className="text-sm text-slate-500 mt-0.5">Kelola daftar fakultas dan program studi</p>
            </div>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openAddFak}>
              Tambah Fakultas
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm">Memuat data...</div>
          ) : (
            <div className="space-y-3">
              {fakultasList.length === 0 && (
                <div className="text-center py-16 text-slate-400 text-sm">Belum ada data. Tambahkan fakultas terlebih dahulu.</div>
              )}

              {fakultasList.map(fak => {
                const expanded = expandedIds.has(fak.id)
                return (
                  <div key={fak.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Fakultas row */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <button onClick={() => toggleExpand(fak.id)} className="text-slate-400 hover:text-uika-700 transition-colors flex-shrink-0">
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-uika-700 bg-uika-50 px-1.5 py-0.5 rounded">{fak.kode}</span>
                          <span className="font-semibold text-slate-800 text-sm truncate">{fak.nama}</span>
                          {!fak.aktif && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Nonaktif</span>}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{fak.prodi?.length ?? 0} program studi</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => openAddProdi(fak.id)} className="p-1.5 text-uika-600 hover:text-uika-800 hover:bg-uika-50 rounded-lg transition-colors" title="Tambah prodi">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => openEditFak(fak)} className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => toggleFak(fak)} className={`p-1.5 rounded-lg transition-colors ${fak.aktif ? 'text-uika-600 hover:text-uika-800 hover:bg-uika-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} title={fak.aktif ? 'Nonaktifkan' : 'Aktifkan'}>
                          {fak.aktif ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Prodi list */}
                    {expanded && (
                      <div className="border-t border-slate-50">
                        {(fak.prodi ?? []).length === 0 ? (
                          <p className="text-xs text-slate-400 px-12 py-3">Belum ada program studi. <button onClick={() => openAddProdi(fak.id)} className="text-uika-600 underline">Tambah sekarang</button></p>
                        ) : (
                          <div className="divide-y divide-slate-50">
                            {(fak.prodi ?? []).map(prodi => (
                              <div key={prodi.id} className="flex items-center gap-3 px-12 py-2.5 hover:bg-slate-50">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{prodi.kode}</span>
                                    <span className="text-sm text-slate-700 truncate">{prodi.nama}</span>
                                    {!prodi.aktif && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Nonaktif</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button onClick={() => openEditProdi(prodi)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                                    <Pencil size={13} />
                                  </button>
                                  <button onClick={() => toggleProdi(prodi)} className={`p-1.5 rounded-lg transition-colors ${prodi.aktif ? 'text-uika-500 hover:text-uika-700 hover:bg-uika-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} title={prodi.aktif ? 'Nonaktifkan' : 'Aktifkan'}>
                                    {prodi.aktif ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal Fakultas */}
      <Modal open={modalFak} onClose={() => setModalFak(false)} title={editFak ? 'Edit Fakultas' : 'Tambah Fakultas'} size="sm">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Nama Fakultas <span className="text-red-500">*</span></label>
            <input value={fakForm.nama} onChange={e => setFakForm(p => ({ ...p, nama: e.target.value }))} placeholder="Fakultas Keguruan dan Ilmu Pendidikan" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Kode <span className="text-red-500">*</span></label>
            <input value={fakForm.kode} onChange={e => setFakForm(p => ({ ...p, kode: e.target.value.toUpperCase() }))} placeholder="FKIP" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Urutan Tampil</label>
            <input type="number" min={0} value={fakForm.urutan} onChange={e => setFakForm(p => ({ ...p, urutan: parseInt(e.target.value) || 0 }))} className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setModalFak(false)} className="flex-1">Batal</Button>
            <Button variant="primary" size="md" loading={saving} onClick={saveFak} className="flex-1">
              {editFak ? 'Simpan Perubahan' : 'Tambah Fakultas'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Prodi */}
      <Modal open={modalProdi} onClose={() => setModalProdi(false)} title={editProdi ? 'Edit Program Studi' : 'Tambah Program Studi'} size="sm">
        <div className="space-y-4">
          {!editProdi && (
            <div className="bg-uika-50 border border-uika-100 rounded-lg px-3 py-2 text-sm text-uika-700">
              Fakultas: <strong>{fakultasList.find(f => f.id === selectedFakId)?.nama ?? '-'}</strong>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Nama Program Studi <span className="text-red-500">*</span></label>
            <input value={prodiForm.nama} onChange={e => setProdiForm(p => ({ ...p, nama: e.target.value }))} placeholder="Pendidikan Bahasa Inggris" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Kode <span className="text-red-500">*</span></label>
            <input value={prodiForm.kode} onChange={e => setProdiForm(p => ({ ...p, kode: e.target.value.toUpperCase() }))} placeholder="PBI" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Urutan Tampil</label>
            <input type="number" min={0} value={prodiForm.urutan} onChange={e => setProdiForm(p => ({ ...p, urutan: parseInt(e.target.value) || 0 }))} className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setModalProdi(false)} className="flex-1">Batal</Button>
            <Button variant="primary" size="md" loading={saving} onClick={saveProdi} className="flex-1">
              {editProdi ? 'Simpan Perubahan' : 'Tambah Prodi'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
