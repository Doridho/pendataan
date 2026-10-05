import { Plus, Trash2 } from 'lucide-react'

/**
 * Daftar unit alat berat — read-only.
 * Admin mendapat tombol tambah (onAdd) & hapus (onDelete).
 */
export default function EquipmentList({ equipment, onAdd, onDelete }) {
  return (
    <section className="card">
      <div className="card-pad card-head">
        <div>
          <h2 className="card-title">Daftar Alat Berat</h2>
          <p className="card-sub" style={{ margin: 0 }}>
            Unit di bawah ini dapat dipilih saat menginput laporan.
          </p>
        </div>
        {onAdd && (
          <button type="button" className="btn btn-primary btn-sm" onClick={onAdd}>
            <Plus size={14} /> Tambah Alat
          </button>
        )}
      </div>

      {equipment.length === 0 ? (
        <div className="empty">Belum ada unit alat berat terdaftar.</div>
      ) : (
        <ul className="op-list">
          {equipment.map((eq) => (
            <li key={eq.id} className="op-row">
              <span className="avatar">{eq.unitCode.charAt(0)}</span>
              <span style={{ flex: 1 }}>
                <span className="strong" style={{ display: 'block' }}>{eq.unitCode}</span>
                <span className="text-muted" style={{ fontSize: 12 }}>{eq.name}</span>
              </span>
              <span className="badge">{eq.category}</span>
              {onDelete && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm btn-icon"
                  title={`Hapus ${eq.unitCode}`}
                  onClick={() => onDelete(eq)}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
