# Sistem Laporan Alat Berat

Website pencatatan laporan operasional alat berat sewa. Dibangun dengan React + Vite, data disimpan di `localStorage` browser.

## Fitur

**Operator (tanpa login)**
- Tampilan dashboard dengan sidebar: menu Dashboard, Input Laporan, Operator, dan Alat Berat.
- Menginput laporan: pilih nama (dropdown, tanpa mengetik), unit alat, tanggal, lokasi pekerjaan, HM awal–akhir, pemakaian BBM (liter), dan bukti foto (opsional, diperkecil otomatis).
- Menu Operator dan Alat Berat menampilkan daftar (read-only).
- Melihat statistik ringkas (termasuk total HM) dan daftar laporan terbaru (read-only), klik thumbnail untuk melihat foto penuh.

**Admin (wajib login)**
- Dashboard ringkasan seluruh laporan yang diinput operator.
- CRUD penuh: tambah, edit, hapus laporan + pencarian + pratinjau bukti foto.
- Menambah & menghapus nama operator (menu Operator) dan unit alat berat (menu Alat Berat) agar bisa dipilih saat input laporan.

Kredensial admin demo: `admin` / `admin123`

## Menjalankan

```bash
npm install
npm run dev      # mode pengembangan
npm run build    # build produksi ke dist/
npm run preview  # pratinjau hasil build
```

## Struktur

```
src/
├── data/seed.js          # Data awal unit alat berat & contoh laporan
├── services/storage.js   # Akses localStorage + autentikasi admin
└── components/
    ├── PublicDashboard.jsx  # Portal operator (tanpa login)
    ├── AdminLogin.jsx       # Halaman login admin
    ├── AdminDashboard.jsx   # Dashboard admin (CRUD)
    ├── ReportForm.jsx       # Form laporan (dipakai operator & admin)
    ├── Stats.jsx            # Kartu statistik ringkas
    └── Modal.jsx            # Komponen modal umum
```
