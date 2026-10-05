import { useState } from 'react'
import { Camera, X } from 'lucide-react'
import { fileToResizedDataUrl } from '../utils/image'

/**
 * Form laporan operasional alat berat.
 * Dipakai oleh operator (halaman input) dan admin (modal tambah/edit).
 */
export default function ReportForm({ equipment, operators, initial, onSubmit, submitLabel = 'Simpan Laporan' }) {
  const normalizedInitial = initial
    ? { ...initial, hmStart: initial.hmStart ?? initial.kmStart ?? '', hmEnd: initial.hmEnd ?? initial.kmEnd ?? '' }
    : null
  const [form, setForm] = useState(
    () =>
      normalizedInitial || {
        operatorId: '',
        equipmentId: equipment[0]?.id || '',
        date: new Date().toISOString().slice(0, 10),
        location: '',
        hmStart: '',
        hmEnd: '',
        fuelLiters: '',
        photoUrl: '',
      }
  )
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      setForm((prev) => ({ ...prev, photoUrl: dataUrl }))
      setError('')
    } catch (err) {
      setError(err.message || 'Gagal membaca file foto.')
    } finally {
      e.target.value = '' // izinkan memilih file yang sama kembali
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.operatorId) return setError('Silakan pilih nama operator.')
    if (!form.equipmentId) return setError('Silakan pilih unit alat berat.')
    if (!form.date) return setError('Tanggal laporan wajib diisi.')
    if (!form.location.trim()) return setError('Lokasi pekerjaan wajib diisi.')

    const hmStart = Number(form.hmStart)
    const hmEnd = Number(form.hmEnd)
    const fuel = Number(form.fuelLiters)

    if (form.hmStart === '' || hmStart < 0) return setError('HM awal tidak valid.')
    if (form.hmEnd === '' || hmEnd < hmStart) return setError('HM akhir harus lebih besar atau sama dengan HM awal.')
    if (form.fuelLiters === '' || fuel < 0) return setError('Pemakaian BBM tidak valid.')

    onSubmit({
      operatorId: form.operatorId,
      equipmentId: form.equipmentId,
      date: form.date,
      location: form.location.trim(),
      hmStart,
      hmEnd,
      fuelLiters: fuel,
      photoUrl: form.photoUrl || '',
    })

    // Reset field input (kecuali unit & tanggal) setelah submit baru
    if (!initial) {
      setForm((prev) => ({ ...prev, location: '', hmStart: '', hmEnd: '', fuelLiters: '', photoUrl: '' }))
    }
  }

  const totalHm = Number(form.hmEnd) - Number(form.hmStart)

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label className="label" htmlFor="rf-operator">Nama Operator *</label>
        <select id="rf-operator" className="input" value={form.operatorId} onChange={set('operatorId')}>
          <option value="" disabled>— Pilih nama Anda —</option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}{op.status !== 'Aktif' ? ' (Nonaktif)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="rf-unit">Unit Alat Berat *</label>
        <select id="rf-unit" className="input" value={form.equipmentId} onChange={set('equipmentId')}>
          {equipment.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.unitCode} — {eq.name} ({eq.category})
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="label" htmlFor="rf-date">Tanggal *</label>
          <input id="rf-date" type="date" className="input" value={form.date} onChange={set('date')} />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="rf-location">Lokasi Pekerjaan *</label>
          <input
            id="rf-location"
            type="text"
            className="input"
            placeholder="cth: Site IKN, Kaltim"
            value={form.location}
            onChange={set('location')}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="label" htmlFor="rf-hmstart">HM Awal *</label>
          <input
            id="rf-hmstart"
            type="number"
            min="0"
            step="0.1"
            className="input"
            placeholder="0"
            value={form.hmStart}
            onChange={set('hmStart')}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="rf-hmend">HM Akhir *</label>
          <input
            id="rf-hmend"
            type="number"
            min="0"
            step="0.1"
            className="input"
            placeholder="0"
            value={form.hmEnd}
            onChange={set('hmEnd')}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="rf-fuel">Pemakaian BBM Selama Masa Sewa (Liter) *</label>
        <input
          id="rf-fuel"
          type="number"
          min="0"
          step="0.1"
          className="input"
          placeholder="0"
          value={form.fuelLiters}
          onChange={set('fuelLiters')}
        />
      </div>

      <div className="form-group">
        <label className="label">
          Bukti Foto <span className="label-opt">(opsional — foto hour meter / kondisi unit di lokasi)</span>
        </label>
        <div className="photo-box">
          <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
            <Camera size={14} /> {form.photoUrl ? 'Ganti Foto' : 'Ambil / Pilih Foto'}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </label>
          {!form.photoUrl && (
            <p className="photo-hint">Foto akan diperkecil otomatis sebelum disimpan.</p>
          )}
          {form.photoUrl && (
            <div className="photo-preview">
              <img src={form.photoUrl} alt="Pratinjau bukti foto" />
              <button
                type="button"
                className="btn btn-danger btn-sm btn-icon photo-remove"
                title="Hapus foto"
                onClick={() => setForm((prev) => ({ ...prev, photoUrl: '' }))}
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {form.hmStart !== '' && form.hmEnd !== '' && totalHm >= 0 && (
        <p className="text-muted" style={{ margin: '0 0 14px', fontSize: 13 }}>
          Total jam: <span className="strong num">{totalHm.toLocaleString('id-ID')} HM</span>
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-block">
        {submitLabel}
      </button>
    </form>
  )
}
