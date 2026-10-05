import { useState } from 'react'
import { LayoutDashboard, ClipboardList, Users, Truck, KeyRound, CheckCircle2 } from 'lucide-react'
import { Storage, createId, hmTotalOf } from '../services/storage'
import Sidebar from './Sidebar'
import Stats from './Stats'
import ReportForm from './ReportForm'
import OperatorList from './OperatorList'
import EquipmentList from './EquipmentList'
import PhotoLightbox from './PhotoLightbox'

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PublicDashboard({ onGoLogin }) {
  const [equipment] = useState(() => Storage.getEquipment())
  const [operators] = useState(() => Storage.getOperators())
  const [reports, setReports] = useState(() => Storage.getReports())
  const [page, setPage] = useState('dashboard') // 'dashboard' | 'input' | 'operators' | 'equipment'
  const [photoView, setPhotoView] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = (data) => {
    const newReport = { id: createId(), ...data, createdAt: new Date().toISOString() }
    const updated = [newReport, ...reports]
    setReports(updated)
    Storage.saveReports(updated)
    showToast('Laporan berhasil dikirim. Terima kasih!')
    setPage('dashboard')
  }

  const equipmentName = (id) => equipment.find((e) => e.id === id)?.unitCode || '-'
  const operatorName = (id) => operators.find((o) => o.id === id)?.name || '-'
  const recentReports = reports.slice(0, 8)

  return (
    <div className="layout">
      <Sidebar
        title="Laporan Alat Berat"
        subtitle="Portal Operator"
        items={[
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, active: page === 'dashboard', onClick: () => setPage('dashboard') },
          { id: 'input', label: 'Input Laporan', icon: <ClipboardList size={16} />, active: page === 'input', onClick: () => setPage('input') },
          { id: 'operators', label: 'Operator', icon: <Users size={16} />, active: page === 'operators', onClick: () => setPage('operators') },
          { id: 'equipment', label: 'Alat Berat', icon: <Truck size={16} />, active: page === 'equipment', onClick: () => setPage('equipment') },
        ]}
        footer={
          <button type="button" className="nav-item" onClick={onGoLogin}>
            <KeyRound size={16} />
            <span>Masuk Admin</span>
          </button>
        }
      />

      <main className="content">
        {page === 'dashboard' && (
          <>
            <div className="page-head">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-sub">Ringkasan pemakaian alat berat sewa.</p>
            </div>

            <Stats equipment={equipment} reports={reports} />

            <section className="card">
              <div className="card-pad" style={{ paddingBottom: 0 }}>
                <h2 className="card-title">Laporan Terbaru</h2>
                <p className="card-sub">Data yang Anda kirimkan langsung tampil di sini.</p>
              </div>

              {recentReports.length === 0 ? (
                <div className="empty">Belum ada laporan yang masuk.</div>
              ) : (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Bukti</th>
                        <th>Tanggal</th>
                        <th>Operator</th>
                        <th>Unit</th>
                        <th>Lokasi</th>
                        <th className="text-right">Total HM</th>
                        <th className="text-right">BBM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((r) => (
                        <tr key={r.id}>
                          <td>
                            {r.photoUrl ? (
                              <img
                                src={r.photoUrl}
                                alt="Bukti"
                                className="thumb"
                                onClick={() => setPhotoView(r.photoUrl)}
                              />
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="num">{formatDate(r.date)}</td>
                          <td className="strong">{operatorName(r.operatorId)}</td>
                          <td><span className="badge">{equipmentName(r.equipmentId)}</span></td>
                          <td className="text-muted">{r.location}</td>
                          <td className="num text-right strong">
                            {hmTotalOf(r).toLocaleString('id-ID')} HM
                          </td>
                          <td className="num text-right">{Number(r.fuelLiters).toLocaleString('id-ID')} L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {page === 'input' && (
          <>
            <div className="page-head">
              <h1 className="page-title">Input Laporan</h1>
              <p className="page-sub">Tanpa login — cukup lengkapi formulir pemakaian alat berat sewa.</p>
            </div>

            <section className="card card-pad" style={{ maxWidth: 560 }}>
              <ReportForm equipment={equipment} operators={operators} onSubmit={handleSubmit} submitLabel="Kirim Laporan" />
            </section>
          </>
        )}

        {page === 'operators' && (
          <>
            <div className="page-head">
              <h1 className="page-title">Operator</h1>
              <p className="page-sub">Daftar operator yang terdaftar pada sistem.</p>
            </div>
            <OperatorList operators={operators} />
          </>
        )}

        {page === 'equipment' && (
          <>
            <div className="page-head">
              <h1 className="page-title">Alat Berat</h1>
              <p className="page-sub">Daftar unit alat berat yang tersedia untuk disewa.</p>
            </div>
            <EquipmentList equipment={equipment} />
          </>
        )}
      </main>

      <PhotoLightbox src={photoView} onClose={() => setPhotoView(null)} />

      {toast && (
        <div className="toast">
          <CheckCircle2 size={15} color="#34d399" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
