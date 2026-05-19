import { Camera, Fingerprint } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { HARGA, LABEL_LAYANAN } from '@/lib/constants'

export function HargaHint() {
  return (
    <div className="rounded-xl border border-uika-200 bg-uika-50 p-4">
      <p className="text-xs font-semibold text-uika-700 uppercase tracking-wide mb-3">
        Info Tarif Layanan
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-uika-100">
          <div className="w-9 h-9 rounded-lg bg-uika-100 flex items-center justify-center flex-shrink-0">
            <Camera size={18} className="text-uika-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800">{LABEL_LAYANAN.FOTO_CAP}</p>
            <p className="text-xs text-slate-500">Termasuk foto resmi + scan sidik jari</p>
          </div>
          <span className="text-sm font-bold text-uika-700 flex-shrink-0">
            {formatRupiah(HARGA.FOTO_CAP)}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-uika-100">
          <div className="w-9 h-9 rounded-lg bg-kuning-100 flex items-center justify-center flex-shrink-0">
            <Fingerprint size={18} className="text-kuning-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800">{LABEL_LAYANAN.CAP_ONLY}</p>
            <p className="text-xs text-slate-500">Scan sidik jari (cap 3 jari) saja</p>
          </div>
          <span className="text-sm font-bold text-uika-700 flex-shrink-0">
            {formatRupiah(HARGA.CAP_ONLY)}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3">
        * Jenis layanan akan dikonfirmasi oleh admin saat Anda datang.
      </p>
    </div>
  )
}
