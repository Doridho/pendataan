// Data awal aplikasi (dipakai sekali saat localStorage masih kosong)

export const SEED_EQUIPMENT = [
  { id: 'eq-01', unitCode: 'EX-200-01', name: 'Komatsu PC200-8M0', category: 'Excavator' },
  { id: 'eq-02', unitCode: 'DZ-85-02', name: 'Caterpillar D85SS-2', category: 'Bulldozer' },
  { id: 'eq-03', unitCode: 'WL-500-01', name: 'Hitachi ZW310-5A', category: 'Wheel Loader' },
  { id: 'eq-04', unitCode: 'CR-50T-01', name: 'Tadano GR-500EX', category: 'Crane' },
  { id: 'eq-05', unitCode: 'EX-330-02', name: 'Hitachi ZAXIS 330LC-5G', category: 'Excavator' },
  { id: 'eq-06', unitCode: 'DT-40-01', name: 'Komatsu HM400-2', category: 'Dump Truck' },
]

export const SEED_OPERATORS = [
  { id: 'op-01', name: 'Ahmad Supriyadi', status: 'Aktif' },
  { id: 'op-02', name: 'Budi Santoso', status: 'Aktif' },
  { id: 'op-03', name: 'Dedi Kurniawan', status: 'Aktif' },
  { id: 'op-04', name: 'Rian Hidayat', status: 'Nonaktif' },
]

export const SEED_REPORTS = [
  {
    id: 'r-001',
    equipmentId: 'eq-01',
    operatorId: 'op-01',
    date: '2026-10-03',
    location: 'Site Bendungan Sepaku, IKN',
    hmStart: 120,
    hmEnd: 138,
    fuelLiters: 120,
    photoUrl: '',
    createdAt: '2026-10-03T17:00:00.000Z',
  },
  {
    id: 'r-002',
    equipmentId: 'eq-02',
    operatorId: 'op-02',
    date: '2026-10-04',
    location: 'Tol Probowangi Seksi 3, Probolinggo',
    hmStart: 45,
    hmEnd: 61,
    fuelLiters: 140,
    photoUrl: '',
    createdAt: '2026-10-04T17:10:00.000Z',
  },
  {
    id: 'r-003',
    equipmentId: 'eq-01',
    operatorId: 'op-01',
    date: '2026-10-05',
    location: 'Site Bendungan Sepaku, IKN',
    hmStart: 138,
    hmEnd: 155,
    fuelLiters: 115,
    photoUrl: '',
    createdAt: '2026-10-05T16:45:00.000Z',
  },
]
