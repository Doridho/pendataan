import { Plus, Trash2 } from 'lucide-react'

/**
 * Daftar nama operator — read-only.
 * Admin mendapat tombol tambah (onAdd) & hapus (onDelete).
 */
export default function OperatorList({ operators, onAdd, onDelete }) {
  return (
    <section className="card">
      <div className="card-pad card-head">
        <div>
          <h2 className="card-title">Daftar Operator</h2>
          <p className="card-sub" style={{ margin: 0 }}>
            Nama di bawah ini dapat dipilih saat menginput laporan.
          </p>
        </div>
        {onAdd && (
          <button type="button" className="btn btn-primary btn-sm" onClick={onAdd}>
            <Plus size={14} /> Tambah Operator
          </button>
        )}
      </div>

      {operators.length === 0 ? (
        <div className="empty">Belum ada operator terdaftar.</div>
      ) : (
        <ul className="op-list">
          {operators.map((op) => (
            <li key={op.id} className="op-row">
              <span className="avatar">{op.name.charAt(0)}</span>
              <span className="strong" style={{ flex: 1 }}>{op.name}</span>
              <span className={`badge ${op.status === 'Aktif' ? 'badge-green' : 'badge-gray'}`}>
                {op.status}
              </span>
              {onDelete && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm btn-icon"
                  title={`Hapus ${op.name}`}
                  onClick={() => onDelete(op)}
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
