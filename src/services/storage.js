import { SEED_EQUIPMENT, SEED_OPERATORS, SEED_REPORTS } from '../data/seed'

const KEYS = {
  EQUIPMENT: 'lab_equipment_v1',
  OPERATORS: 'lab_operators_v1',
  REPORTS: 'lab_reports_v1',
  ADMIN_SESSION: 'lab_admin_session_v1',
}

// Kredensial admin (demo, sisi klien)
const ADMIN = { username: 'admin', password: 'admin123' }

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) return JSON.parse(raw)
  } catch (e) {
    console.error(`Gagal membaca ${key} dari localStorage`, e)
  }
  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error(`Gagal menyimpan ${key} ke localStorage`, e)
  }
}

export function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// Pembaca HM dengan fallback ke format lama (kmStart/kmEnd)
// agar laporan yang tersimpan sebelum perubahan tetap terbaca.
export const hmStartOf = (r) => Number(r.hmStart ?? r.kmStart ?? 0)
export const hmEndOf = (r) => Number(r.hmEnd ?? r.kmEnd ?? 0)
export const hmTotalOf = (r) => hmEndOf(r) - hmStartOf(r)

export const Storage = {
  getEquipment: () => load(KEYS.EQUIPMENT, SEED_EQUIPMENT),
  saveEquipment: (equipment) => save(KEYS.EQUIPMENT, equipment),
  getOperators: () => load(KEYS.OPERATORS, SEED_OPERATORS),
  saveOperators: (operators) => save(KEYS.OPERATORS, operators),
  getReports: () => load(KEYS.REPORTS, SEED_REPORTS),
  saveReports: (reports) => save(KEYS.REPORTS, reports),

  login: (username, password) => {
    const ok = username.trim().toLowerCase() === ADMIN.username && password === ADMIN.password
    if (ok) localStorage.setItem(KEYS.ADMIN_SESSION, '1')
    return ok
  },
  isAdminLoggedIn: () => localStorage.getItem(KEYS.ADMIN_SESSION) === '1',
  logout: () => localStorage.removeItem(KEYS.ADMIN_SESSION),
}
