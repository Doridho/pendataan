import { useState } from 'react'
import { LayoutDashboard, FileText, Users, Truck, LogOut, Plus, Search, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { Storage, createId, hmStartOf, hmEndOf, hmTotalOf } from '../services/storage'
import Sidebar from './Sidebar'
import Stats from './Stats'
import ReportForm from './ReportForm'
import OperatorList from './OperatorList'
import EquipmentList from './EquipmentList'
import Modal from './Modal'
import PhotoLightbox from './PhotoLightbox'

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminDashboard({ onLogout }) {
  const [equipment, setEquipment] = useState(() => Storage.getEquipment())
  const [operators, setOperators] = useState(() => Storage.getOperators())
  const [reports, setReports] = useState(() => Storage.getReports())
  const [page, setPage] = useState('dashboard') // 'dashboard' | 'laporan' | 'operators' | 'equipment'
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // { mode: 'add' } | { mode: 'edit', report } | { mode: 'addOperator' } | { mode: 'addEquipment' }
  const [opForm, setOpForm] = useState({ name: '', status: 'Aktif' })
  const [eqForm, setEqForm] = useState({ unitCode: '', name: '', category: 'Excavator' })
  const [photoView, setPhotoView] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const persist = (updated) => {
    setReports(updated)
    Storage.saveReports(updated)
  }

  const handleAdd = (data) => {
    persist([{ id: createId(), ...data, createdAt: new Date().toISOString() }, ...reports])
    setModal(null)
    showToast('Laporan berhasil ditambahkan.')
  }

  const handleEdit = (data) => {
    persist(reports.map((r) => {
      if (r.id !== modal.report.id) return r
      const merged = { ...r, ...data }
      delete merged.kmStart
      delete merged.kmEnd
      return merged
    }))
    setModal(null)
    showToast('Perubahan laporan disimpan.')
  }

  const handleDelete = (report) => {
    if (!window.confirm('Hapus laporan ini secara permanen?')) return
    persist(reports.filter((r) => r.id !== report.id))
    showToast('Laporan telah dihapus.')
  }

  const handleAddOperator = (e) => {
    e.preventDefault()
    const name = opForm.name.trim()
    if (!name) return
    const updated = [{ id: createId(), name, status: opForm.status }, ...operators]
    setOperators(updated)
    Storage.saveOperators(updated)
    setModal(null)
    setOpForm({ name: '', status: 'Aktif' })
    showToast('Operator berhasil ditambahkan.')
  }

  const handleAddEquipment = (e) => {
    e.preventDefault()
    const unitCode = eqForm.unitCode.trim()
    const name = eqForm.name.trim()
    if (!unitCode || !name) return
    const updated = [{ id: createId(), unitCode, name, category: eqForm.category }, ...equipment]
    setEquipment(updated)
    Storage.saveEquipment(updated)
    setModal(null)
    setEqForm({ unitCode: '', name: '', category: 'Excavator' })
    showToast('Unit alat berat berhasil ditambahkan.')
  }

  const handleDeleteOperator = (op) => {
    const used = reports.filter((r) => r.operatorId === op.id).length
    const extra = used > 0 ? ` Nama ini dipakai di ${used} laporan (data laporan tetap ada, kolom operator jadi "-").` : ''
    if (!window.confirm(`Hapus operator "${op.name}" secara permanen?${extra}`)) return
    const updated = operators.filter((o) => o.id !== op.id)
    setOperators(updated)
    Storage.saveOperators(updated)
    showToast('Operator telah dihapus.')
  }

  const handleDeleteEquipment = (eq) => {
    const used = reports.filter((r) => r.equipmentId === eq.id).length
    const extra = used > 0 ? ` Unit ini dipakai di ${used} laporan (data laporan tetap ada, kolom unit jadi "-").` : ''
    if (!window.confirm(`Hapus unit "${eq.unitCode}" secara permanen?${extra}`)) return
    const updated = equipment.filter((e) => e.id !== eq.id)
    setEquipment(updated)
    Storage.saveEquipment(updated)
    showToast('Unit alat berat telah dihapus.')
  }

  const equipmentById = (id) => equipment.find((e) => e.id === id)
  const operatorName = (id) => operators.find((o) => o.id === id)?.name || '-'

  const query = search.trim().toLowerCase()
  const filtered = query
    ? reports.filter((r) => {
        const eq = equipmentById(r.equipmentId)
        return (
          r.location.toLowerCase().includes(query) ||
          r.date.includes(query) ||
          operatorName(r.operatorId).toLowerCase().includes(query) ||
          eq?.unitCode.toLowerCase().includes(query) ||
          eq?.name.toLowerCase().includes(query)
        )
      })
    : reports

  const renderTable = (rows) => (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Bukti</th>
            <th>Tanggal</th>
            <th>Operator</th>
            <th>Unit</th>
            <th>Lokasi</th>
            <th className="text-right">HM Awal</th>
            <th className="text-right">HM Akhir</th>
            <th className="text-right">Total HM</th>
            <th className="text-right">BBM (L)</th>
            <th className="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const eq = equipmentById(r.equipmentId)
            return (
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
                <td>
                  <div className="strong">{eq?.unitCode || '-'}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{eq?.name}</div>
                </td>
                <td className="text-muted">{r.location}</td>
                <td className="num text-right">{hmStartOf(r).toLocaleString('id-ID')}</td>
                <td className="num text-right">{hmEndOf(r).toLocaleString('id-ID')}</td>
                <td className="num text-right strong">
                  {hmTotalOf(r).toLocaleString('id-ID')} HM
                </td>
                <td className="num text-right">{Number(r.fuelLiters).toLocaleString('id-ID')}</td>
                <td className="text-right">
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-icon"
                      title="Edit laporan"
                      onClick={() => setModal({ mode: 'edit', report: r })}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm btn-icon"
                      title="Hapus laporan"
                      onClick={() => handleDelete(r)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="layout">
      <Sidebar
        title="Laporan Alat Berat"
        subtitle="Dashboard Admin"
        items={[
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, active: page === 'dashboard', onClick: () => setPage('dashboard') },
          { id: 'laporan', label: 'Data Laporan', icon: <FileText size={16} />, active: page === 'laporan', onClick: () => setPage('laporan') },
          { id: 'operators', label: 'Operator', icon: <Users size={16} />, active: page === 'operators', onClick: () => setPage('operators') },
          { id: 'equipment', label: 'Alat Berat', icon: <Truck size={16} />, active: page === 'equipment', onClick: () => setPage('equipment') },
        ]}
        footer={
          <button type="button" className="nav-item" onClick={onLogout}>
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        }
      />

      <main className="content">
        {page === 'dashboard' && (
          <>
            <div className="page-head">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-sub">Ringkasan seluruh laporan yang masuk dari operator.</p>
            </div>

            <Stats equipment={equipment} reports={reports} />

            <section className="card">
              <div className="card-pad" style={{ paddingBottom: 0 }}>
                <h2 className="card-title">5 Laporan Terakhir</h2>
                <p className="card-sub">Kelola selengkapnya di menu Data Laporan.</p>
              </div>
              {reports.length === 0 ? (
                <div className="empty">Belum ada laporan dari operator.</div>
              ) : (
                renderTable(reports.slice(0, 5))
              )}
            </section>
          </>
        )}

        {page === 'laporan' && (
          <>
            <div className="page-head">
              <h1 className="page-title">Data Laporan</h1>
              <p className="page-sub">Kelola (tambah, ubah, hapus) seluruh laporan operasional.</p>
            </div>

            <section className="card card-pad">
              <div className="toolbar">
                <div className="search-wrap">
                  <span className="search-icon"><Search size={15} /></span>
                  <input
                    type="text"
                    className="input"
                    placeholder="Cari unit, lokasi, atau tanggal..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
                  <Plus size={15} /> Tambah Laporan
                </button>
              </div>

              {filtered.length === 0 ? (
                <div className="empty">
                  {reports.length === 0
                    ? 'Belum ada laporan dari operator.'
                    : 'Tidak ada laporan yang cocok dengan pencarian.'}
                </div>
              ) : (
                renderTable(filtered)
              )}
            </section>
          </>
        )}

        {page === 'operators' && (
          <>
            <div className="page-head">
              <h1 className="page-title">Operator</h1>
              <p className="page-sub">Tambahkan nama agar bisa dipilih operator saat menginput laporan.</p>
            </div>
            <OperatorList
              operators={operators}
              onAdd={() => {
                setOpForm({ name: '', status: 'Aktif' })
                setModal({ mode: 'addOperator' })
              }}
              onDelete={handleDeleteOperator}
            />
          </>
        )}

        {page === 'equipment' && (
          <>
            <div className="page-head">
              <h1 className="page-title">Alat Berat</h1>
              <p className="page-sub">Tambahkan unit agar bisa dipilih operator saat menginput laporan.</p>
            </div>
            <EquipmentList
              equipment={equipment}
              onAdd={() => {
                setEqForm({ unitCode: '', name: '', category: 'Excavator' })
                setModal({ mode: 'addEquipment' })
              }}
              onDelete={handleDeleteEquipment}
            />
          </>
        )}
      </main>

      {modal?.mode === 'add' && (
        <Modal title="Tambah Laporan" onClose={() => setModal(null)}>
          <ReportForm equipment={equipment} operators={operators} onSubmit={handleAdd} />
        </Modal>
      )}

      {modal?.mode === 'edit' && (
        <Modal title="Edit Laporan" onClose={() => setModal(null)}>
          <ReportForm
            equipment={equipment}
            operators={operators}
            initial={modal.report}
            onSubmit={handleEdit}
            submitLabel="Simpan Perubahan"
          />
        </Modal>
      )}

      {modal?.mode === 'addOperator' && (
        <Modal title="Tambah Operator" onClose={() => setModal(null)}>
          <form onSubmit={handleAddOperator}>
            <div className="form-group">
              <label className="label" htmlFor="op-name">Nama Lengkap *</label>
              <input
                id="op-name"
                type="text"
                className="input"
                placeholder="cth: Ahmad Supriyadi"
                value={opForm.name}
                onChange={(e) => setOpForm({ ...opForm, name: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="op-status">Status</label>
              <select
                id="op-status"
                className="input"
                value={opForm.status}
                onChange={(e) => setOpForm({ ...opForm, status: e.target.value })}
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Simpan Operator</button>
          </form>
        </Modal>
      )}

      {modal?.mode === 'addEquipment' && (
        <Modal title="Tambah Alat Berat" onClose={() => setModal(null)}>
          <form onSubmit={handleAddEquipment}>
            <div className="form-group">
              <label className="label" htmlFor="eq-code">Kode Unit *</label>
              <input
                id="eq-code"
                type="text"
                className="input"
                placeholder="cth: EX-200-03"
                value={eqForm.unitCode}
                onChange={(e) => setEqForm({ ...eqForm, unitCode: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="eq-name">Nama / Model Alat *</label>
              <input
                id="eq-name"
                type="text"
                className="input"
                placeholder="cth: Komatsu PC200-8M0"
                value={eqForm.name}
                onChange={(e) => setEqForm({ ...eqForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="eq-category">Kategori</label>
              <select
                id="eq-category"
                className="input"
                value={eqForm.category}
                onChange={(e) => setEqForm({ ...eqForm, category: e.target.value })}
              >
                <option value="Excavator">Excavator</option>
                <option value="Bulldozer">Bulldozer</option>
                <option value="Wheel Loader">Wheel Loader</option>
                <option value="Crane">Crane</option>
                <option value="Dump Truck">Dump Truck</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Simpan Alat Berat</button>
          </form>
        </Modal>
      )}

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
