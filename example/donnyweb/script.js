/* ==========================================================================
   FRNDLY SUITES — SCRIPT.JS
   Struktur:
   1) Dummy Data (siap diganti fetch ke Google Apps Script / Google Sheets)
   2) Util (format, id generator, toast)
   3) Icon Library (SVG string, dipakai berulang)
   4) Navigasi & Layout (sidebar, header, dropdown, mobile)
   5) Chart Helper (line chart & donut chart digambar manual pakai SVG)
   6) Halaman Dashboard
   7) Halaman Invoice (list, filter, modal buat/detail, preview)
   8) Halaman Customer (list, filter, modal tambah, status toggle)
   9) Halaman Produk (list, filter, modal tambah)
   10) Halaman Pengaturan (5 section, semua tombol simpan berfungsi)
   11) Modal & Toast Generik
   12) Inisialisasi Aplikasi
   ========================================================================== */

/* ==========================================================================
   1) DUMMY DATA
   Catatan: seluruh data disimpan di object/array JS berikut, TIDAK ada angka
   yang ditulis langsung di HTML. Struktur ini didesain agar setiap array
   bisa langsung diganti menjadi hasil fetch() dari Google Apps Script
   Web App (yang membaca Google Sheets) tanpa mengubah kode rendering.
   ========================================================================== */

// Ringkasan angka dashboard. Nilainya TIDAK statis lagi — object ini diisi ulang
// setiap kali rentang tanggal difilter, lewat computeDashboardData() (lihat bag. 6).
// Saat sudah terhubung Google Apps Script, cukup ganti isi computeDashboardData()
// agar mengambil hasil agregasi dari Sheets sesuai rentang tanggal yang dipilih.
let dashboardData = {
  totalInvoice: 0,
  totalRevenue: 0,
  totalCustomer: 0,
  totalProduct: 0,
  deltaInvoice: "+12% dari bulan lalu",
  deltaRevenue: "+18% dari bulan lalu",
  deltaCustomer: "+8% dari bulan lalu",
  deltaProduct: "+5% dari bulan lalu",
};

// (dashboardDateRange dideklarasikan di bawah, setelah TODAY_ISO tersedia)

// Data customer — setiap object mewakili satu baris di Google Sheets "Customer"
// segmentOverride: null -> segmen dihitung otomatis dari riwayat transaksi (lihat getCustomerSegment).
// Jika admin menetapkan segmen manual lewat Edit Customer, nilainya diisi label segmen dari master data.
let customersData = [
  { id: "C001", name: "PT Maju Bersama", contact: "0812 3456 7890", email: "maju@bersama.com", city: "Surabaya", type: "Perusahaan", joined: "2026-06-15", segmentOverride: null },
  { id: "C002", name: "CV Kreatif Digital", contact: "0822 1234 5678", email: "info@kreatifdigital.com", city: "Jakarta", type: "Perusahaan", joined: "2026-05-02", segmentOverride: null },
  { id: "C003", name: "UD Sejahtera", contact: "0813 5678 9012", email: "sejahtera@ud.com", city: "Bandung", type: "Perusahaan", joined: "2026-04-21", segmentOverride: null },
  { id: "C004", name: "Toko Makmur", contact: "0821 2345 6789", email: "tokomakmur@gmail.com", city: "Surabaya", type: "Toko", joined: "2026-03-11", segmentOverride: null },
  { id: "C005", name: "PT Sukses Selalu", contact: "0812 9876 5432", email: "suksesselalu@pt.com", city: "Jakarta", type: "Perusahaan", joined: "2026-02-18", segmentOverride: null },
  { id: "C006", name: "Bangun Jaya Corp", contact: "0823 1111 2222", email: "bangunjaya@corp.com", city: "Semarang", type: "Perusahaan", joined: "2026-01-29", segmentOverride: null },
  { id: "C007", name: "Nusa Teknologi", contact: "0811 2222 3333", email: "nusa@teknologi.com", city: "Yogyakarta", type: "Perusahaan", joined: "2025-12-10", segmentOverride: null },
  { id: "C008", name: "Sentosa Retail", contact: "0821 3333 4444", email: "sentosa@retail.com", city: "Malang", type: "Toko", joined: "2025-11-30", segmentOverride: null },
  { id: "C009", name: "Prima Abadi", contact: "0813 4444 5555", email: "primaabadi@gmail.com", city: "Surabaya", type: "Perusahaan", joined: "2025-10-14", segmentOverride: null },
  { id: "C010", name: "CV Indah Karya", contact: "0822 5555 6666", email: "indahkarya@cv.com", city: "Jakarta", type: "Perusahaan", joined: "2025-09-08", segmentOverride: null },
];

// MASTER DATA — Tipe Customer & Segmen Customer (bisa Tambah/Edit/Hapus di Pengaturan > Master Customer).
// Semua dropdown terkait Tipe & Segmen di halaman Customer mengambil pilihannya dari sini.
// Kota TIDAK termasuk master data ini — tetap kolom teks bebas seperti sebelumnya.
let customerTypesData = [
  { id: "CTYPE-1", label: "Perusahaan", color: "#6366F1" },
  { id: "CTYPE-2", label: "Toko", color: "#F59E0B" },
  { id: "CTYPE-3", label: "Distributor", color: "#22C55E" },
];
// "key" dipakai internal oleh algoritma segmentasi otomatis (getCustomerSegment) untuk tahu
// segmen mana yang sedang dihitung — key ini tidak ditampilkan/diedit, hanya label & warnanya.
let customerSegmentsData = [
  { id: "CSEG-1", key: "baru", label: "Baru", color: "#22C55E" },
  { id: "CSEG-2", key: "aktif", label: "Aktif", color: "#6366F1" },
  { id: "CSEG-3", key: "repeat", label: "Repeat", color: "#F59E0B" },
  { id: "CSEG-4", key: "tidak_aktif", label: "Tidak Aktif", color: "#EF4444" },
];

// Data produk — minimal 3 produk sesuai permintaan (baris di Sheet "Produk")
let productsData = [
  { id: "P001", name: "Jasa Konsultasi Bisnis", category: "Jasa", price: 2500000, stock: 999, unit: "Paket", status: "Aktif", description: "Sesi konsultasi strategi bisnis dan operasional." },
  { id: "P002", name: "Paket Desain Logo & Branding", category: "Jasa", price: 1750000, stock: 999, unit: "Paket", status: "Aktif", description: "Desain logo lengkap dengan panduan brand identity." },
  { id: "P003", name: "Software Kasir Pro (Lisensi/Thn)", category: "Produk Digital", price: 3200000, stock: 42, unit: "Lisensi", status: "Aktif", description: "Lisensi tahunan aplikasi kasir untuk toko/percetakan." },
];

// Konsep status invoice dipisah jadi dua:
// A. STATUS PEMBAYARAN -> Belum Bayar, DP, Lunas, Overdue
// B. STATUS PRODUKSI    -> Draft, Diproses, Siap Diambil, Selesai, Dibatalkan
// Kedua daftar ini adalah MASTER DATA (bisa Tambah/Edit/Hapus di Pengaturan > Master Status Invoice).
// Semua dropdown & badge status di halaman Invoice (filter, form edit, tabel, PDF/preview)
// serta donut chart di Dashboard mengambil pilihannya dari sini — bukan hardcode lagi.
let paymentStatusesData = [
  { id: "PST-1", label: "Belum Bayar", color: "#6B7280" },
  { id: "PST-2", label: "DP", color: "#F59E0B" },
  { id: "PST-3", label: "Lunas", color: "#22C55E" },
  { id: "PST-4", label: "Overdue", color: "#EF4444" },
];
let productionStatusesData = [
  { id: "PRD-1", label: "Draft", color: "#9CA3AF" },
  { id: "PRD-2", label: "Menunggu Konfirmasi", color: "#F59E0B" },
  { id: "PRD-3", label: "Diproses", color: "#6366F1" },
  { id: "PRD-4", label: "Siap Diambil", color: "#38BDF8" },
  { id: "PRD-5", label: "Selesai", color: "#22C55E" },
  { id: "PRD-6", label: "Dibatalkan", color: "#EF4444" },
];

// Referensi "hari ini" SELALU mengikuti tanggal & waktu lokal perangkat pengguna saat aplikasi dibuka
// (bukan nilai tersimpan/hardcode). Ini dipakai oleh seluruh preset filter periode Dashboard.
const TODAY_ISO = toLocalISO(new Date());

// Rentang tanggal dashboard yang sedang aktif (default: 30 Hari Terakhir, dihitung dari TODAY_ISO)
let dashboardDateRange = { from: addDaysISO(TODAY_ISO, -29), to: TODAY_ISO };

// Data invoice — minimal 8 dummy. paymentStatus = status pembayaran, productionStatus = status progres
let invoicesData = [
  { id: "INV-2026-0080", customer: "Nusa Teknologi", date: addDaysISO(TODAY_ISO, 0), due: addDaysISO(TODAY_ISO, 7), total: 1800000, taxed: false, paymentStatus: "Lunas", productionStatus: "Selesai", dp: 1800000, items: [{ product: "Software Kasir Pro (Lisensi/Thn)", qty: 1, unit: "Lisensi", price: 1800000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
  { id: "INV-2026-0079", customer: "CV Kreatif Digital", date: addDaysISO(TODAY_ISO, 0), due: addDaysISO(TODAY_ISO, 7), total: 1250000, taxed: false, paymentStatus: "Belum Bayar", productionStatus: "Draft", dp: 0, items: [{ product: "Jasa Konsultasi Bisnis", qty: 1, unit: "Paket", price: 1250000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
  { id: "INV-2026-0078", customer: "PT Maju Bersama", date: addDaysISO(TODAY_ISO, -1), due: addDaysISO(TODAY_ISO, 6), total: 2450000, taxed: false, paymentStatus: "Lunas", productionStatus: "Selesai", dp: 2450000, items: [{ product: "Jasa Konsultasi Bisnis", qty: 1, unit: "Paket", price: 2450000, discount: 0, discountType: "percent" }], notes: "", terms: "Pembayaran via transfer bank." },
  { id: "INV-2026-0077", customer: "CV Kreatif Digital", date: addDaysISO(TODAY_ISO, -2), due: addDaysISO(TODAY_ISO, 5), total: 1850000, taxed: false, paymentStatus: "DP", productionStatus: "Diproses", dp: 500000, items: [{ product: "Paket Desain Logo & Branding", qty: 1, unit: "Paket", price: 1850000, discount: 0, discountType: "percent" }], notes: "", terms: "DP 30% di muka." },
  { id: "INV-2026-0076", customer: "PT Sukses Selalu", date: addDaysISO(TODAY_ISO, -3), due: addDaysISO(TODAY_ISO, 4), total: 3250000, taxed: false, paymentStatus: "Overdue", productionStatus: "Dibatalkan", dp: 0, items: [{ product: "Software Kasir Pro (Lisensi/Thn)", qty: 1, unit: "Lisensi", price: 3250000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
  { id: "INV-2026-0075", customer: "Toko Makmur", date: addDaysISO(TODAY_ISO, -3), due: addDaysISO(TODAY_ISO, 4), total: 950000, taxed: false, paymentStatus: "Lunas", productionStatus: "Selesai", dp: 950000, items: [{ product: "Jasa Konsultasi Bisnis", qty: 1, unit: "Paket", price: 950000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
  { id: "INV-2026-0074", customer: "UD Sejahtera", date: addDaysISO(TODAY_ISO, -4), due: addDaysISO(TODAY_ISO, 3), total: 1150000, taxed: false, paymentStatus: "Belum Bayar", productionStatus: "Draft", dp: 0, items: [{ product: "Paket Desain Logo & Branding", qty: 1, unit: "Paket", price: 1150000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
  { id: "INV-2026-0073", customer: "PT Maju Bersama", date: addDaysISO(TODAY_ISO, -5), due: addDaysISO(TODAY_ISO, 2), total: 2750000, taxed: false, paymentStatus: "Lunas", productionStatus: "Selesai", dp: 2750000, items: [{ product: "Software Kasir Pro (Lisensi/Thn)", qty: 1, unit: "Lisensi", price: 2750000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
  { id: "INV-2026-0072", customer: "Bangun Jaya Corp", date: addDaysISO(TODAY_ISO, -6), due: addDaysISO(TODAY_ISO, 1), total: 4650000, taxed: false, paymentStatus: "DP", productionStatus: "Diproses", dp: 1000000, items: [{ product: "Jasa Konsultasi Bisnis", qty: 2, unit: "Paket", price: 2325000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
  { id: "INV-2026-0071", customer: "Sentosa Retail", date: addDaysISO(TODAY_ISO, -7), due: addDaysISO(TODAY_ISO, 0), total: 1600000, taxed: false, paymentStatus: "DP", productionStatus: "Siap Diambil", dp: 800000, items: [{ product: "Paket Desain Logo & Branding", qty: 1, unit: "Paket", price: 1600000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
  { id: "INV-2026-0070", customer: "Nusa Teknologi", date: addDaysISO(TODAY_ISO, -8), due: addDaysISO(TODAY_ISO, -1), total: 3100000, taxed: false, paymentStatus: "Lunas", productionStatus: "Selesai", dp: 3100000, items: [{ product: "Software Kasir Pro (Lisensi/Thn)", qty: 1, unit: "Lisensi", price: 3100000, discount: 0, discountType: "percent" }], notes: "", terms: "" },
];

// Reminder harian (dummy) — setiap reminder punya tanggal agar ikut mengikuti
// Master Filter Periode Dashboard yang sama seperti komponen lainnya.
let remindersData = [
  { id: "R001", text: "Follow up pembayaran INV-2026-0077 ke CV Kreatif Digital", done: false, date: addDaysISO(TODAY_ISO, -2) },
  { id: "R002", text: "Hubungi customer UD Sejahtera terkait invoice belum dibayar", done: false, date: addDaysISO(TODAY_ISO, -4) },
  { id: "R003", text: "Pesanan INV-2026-0072 (Bangun Jaya Corp) harus selesai hari ini", done: false, date: TODAY_ISO },
  { id: "R004", text: "Sentosa Retail akan mengambil barang sore ini", done: false, date: TODAY_ISO },
];

// Pengaturan perusahaan & invoice (tersimpan di "state", nanti bisa PATCH ke Apps Script)
let settingsData = {
  company: {
    name: "FRNDLY Store",
    address: "Jl. Raya Darmo No. 88, Surabaya",
    phone: "0812 0000 0000",
    email: "hello@frndlystore.com",
    npwp: "01.234.567.8-901.000",
    logo: null, // data URL (base64) hasil upload logo, null = belum ada logo
  },
  invoice: {
    prefix: "INV-2026-",
    dueDays: 7,
    tax: 11,
    autoTax: true,
    terms: "Pembayaran ditransfer ke rekening perusahaan maksimal pada tanggal jatuh tempo.",
  },
  notif: { emailInvoice: true, emailJatuhTempo: true, whatsapp: false, ringkasanMingguan: true },
  profile: { name: "Donny Bagoes", email: "donny@frndlysuites.com", phone: "0812 0000 0000" },
};

/* ==========================================================================
   2) UTIL
   ========================================================================== */
function formatRp(n) {
  n = Math.round(Number(n) || 0);
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDateShort(iso) {
  if (!iso) return "-";
  const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const d = new Date(iso + "T00:00:00");
  return `${String(d.getDate()).padStart(2,"0")} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function genId(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMessage").textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-panel.open").forEach((el) => el.classList.remove("open"));
  document.getElementById("headerChevron").classList.remove("open");
}

/* ==========================================================================
   3) ICON LIBRARY (dipakai di stat card & settings nav)
   ========================================================================== */
const ICONS = {
  invoice: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  revenue: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  customer: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  product: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  alert: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  pencil: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
  download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
  building: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><line x1="10" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="14" y2="6"/><line x1="10" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="14" y2="10"/></svg>',
  receipt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 1V2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/></svg>',
  bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  userCog: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h3"/><circle cx="18" cy="16" r="3"/><path d="M18 12v1M18 19v1M14.5 14l.87.5M20.6 17.5l.87.5M14.5 18l.87-.5M20.6 14.5l.87-.5"/></svg>',
  upload: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  list: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
};

/* ==========================================================================
   4) NAVIGASI & LAYOUT
   ========================================================================== */
const PAGE_META = {
  dashboard: { title: "Dashboard", crumb: "Home / Dashboard" },
  invoice: { title: "Invoice", crumb: "Home / Invoice" },
  customer: { title: "Customer", crumb: "Home / Customer" },
  produk: { title: "Produk", crumb: "Home / Produk" },
  pengaturan: { title: "Pengaturan", crumb: "Home / Pengaturan" },
};

function goToPage(pageKey) {
  document.querySelectorAll(".nav-link").forEach((btn) => btn.classList.toggle("active", btn.dataset.page === pageKey));
  document.querySelectorAll(".page").forEach((sec) => sec.classList.toggle("active", sec.id === `page-${pageKey}`));
  document.getElementById("pageTitle").textContent = PAGE_META[pageKey].title;
  document.getElementById("pageBreadcrumb").textContent = PAGE_META[pageKey].crumb;
  document.getElementById("sidebar").classList.remove("mobile-open");
  document.getElementById("sidebarOverlay").classList.remove("show");
  window.scrollTo(0, 0);
}

function initNavigation() {
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.addEventListener("click", () => goToPage(btn.dataset.page));
  });
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => goToPage(btn.dataset.goto));
  });
}

function initSidebarCollapse() {
  document.getElementById("sidebarToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("collapsed");
  });
  document.getElementById("mobileMenuBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.add("mobile-open");
    document.getElementById("sidebarOverlay").classList.add("show");
  });
  document.getElementById("sidebarOverlay").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("mobile-open");
    document.getElementById("sidebarOverlay").classList.remove("show");
  });
}

function initDropdowns() {
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  const headerProfileBtn = document.getElementById("headerProfileBtn");
  const headerProfileDropdown = document.getElementById("headerProfileDropdown");
  const headerChevron = document.getElementById("headerChevron");
  const sidebarProfileBtn = document.getElementById("sidebarProfileBtn");
  const sidebarProfileDropdown = document.getElementById("sidebarProfileDropdown");

  notifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !notifDropdown.classList.contains("open");
    closeAllDropdowns();
    if (willOpen) notifDropdown.classList.add("open");
  });

  headerProfileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !headerProfileDropdown.classList.contains("open");
    closeAllDropdowns();
    if (willOpen) { headerProfileDropdown.classList.add("open"); headerChevron.classList.add("open"); }
  });

  sidebarProfileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !sidebarProfileDropdown.classList.contains("open");
    closeAllDropdowns();
    if (willOpen) sidebarProfileDropdown.classList.add("open");
  });

  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      closeAllDropdowns();
      if (action === "pengaturan") goToPage("pengaturan");
      else if (action === "profile") { goToPage("pengaturan"); setActiveSettings("pengguna"); }
      else if (action === "logout") showToast("Anda telah keluar (simulasi)");
    });
  });

  document.addEventListener("click", closeAllDropdowns);
}

/* ==========================================================================
   5) CHART HELPER — digambar manual dengan SVG (tanpa library eksternal)
   ========================================================================== */
function buildLineChart(data) {
  const width = 640, height = 230, padL = 64, padR = 10, padT = 10, padB = 26;
  const maxRaw = Math.max(...data.map((d) => d.value), 0) * 1.25 || 1000000;
  const stepX = (width - padL - padR) / Math.max(data.length - 1, 1);
  const points = data.map((d, i) => {
    const x = padL + i * stepX;
    const y = padT + (1 - d.value / maxRaw) * (height - padT - padB);
    return { x, y, label: d.label, value: d.value, paidCount: d.paidCount || 0 };
  });
  const linePath = points.map((p, i) => (i === 0 ? "M" : "L") + p.x + " " + p.y).join(" ");
  const areaPath = points.length > 1
    ? linePath + ` L${points[points.length - 1].x} ${height - padB} L${points[0].x} ${height - padB} Z`
    : "";

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + f * (height - padT - padB);
    const val = Math.round(maxRaw * (1 - f) / 1000) * 1000;
    return `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>
            <text x="${padL - 8}" y="${y + 4}" font-size="10.5" fill="#6B7280" text-anchor="end">${formatRp(val)}</text>`;
  }).join("");

  const xLabels = points.map((p) => `<text x="${p.x}" y="${height - 6}" font-size="11" fill="#6B7280" text-anchor="middle">${p.label}</text>`).join("");
  const dots = points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#fff" stroke="#6366F1" stroke-width="2"><title>${p.label} — ${formatRp(p.value)} — ${p.paidCount} invoice dibayar</title></circle>`).join("");

  return `
  <svg viewBox="0 0 ${width} ${height}" width="100%" height="230">
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6366F1" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#6366F1" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${gridLines}
    ${areaPath ? `<path d="${areaPath}" fill="url(#areaGrad)" stroke="none"/>` : ""}
    <path d="${linePath}" fill="none" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    ${xLabels}
  </svg>`;
}

// segments: [{label, value, color}]
function buildDonutChart(segments, size = 200, strokeWidth = 26) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  let offsetAcc = 0;
  const circles = segments.map((seg) => {
    const fraction = seg.value / total;
    const dash = fraction * circumference;
    const circle = `<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${seg.color}"
      stroke-width="${strokeWidth}" stroke-dasharray="${dash} ${circumference - dash}"
      stroke-dashoffset="${-offsetAcc}" transform="rotate(-90 ${size/2} ${size/2})" stroke-linecap="butt"/>`;
    offsetAcc += dash;
    return circle;
  }).join("");
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${circles}</svg>`;
}

/* ==========================================================================
   6) HALAMAN DASHBOARD
   ========================================================================== */
// Menghitung ulang seluruh angka dashboard berdasarkan rentang tanggal aktif.
// Nanti fungsi ini tinggal diganti menjadi fetch() ke Google Apps Script dengan
// parameter ?from=...&to=... yang mengembalikan bentuk object yang sama.
function computeDashboardData(from, to) {
  const filtered = invoicesData.filter((inv) => (!from || inv.date >= from) && (!to || inv.date <= to));

  // Uang masuk per invoice: Lunas -> total penuh, DP -> hanya nominal DP, lainnya -> 0
  const cashIn = (inv) => inv.paymentStatus === "Lunas" ? inv.total : inv.paymentStatus === "DP" ? (inv.dp || 0) : 0;

  const totalInvoice = filtered.length;
  const totalRevenue = filtered.reduce((s, i) => s + cashIn(i), 0);
  const totalCustomer = new Set(filtered.map((i) => i.customer)).size;
  const totalProduct = new Set(filtered.flatMap((i) => i.items.map((it) => it.product))).size;

  // Grafik pendapatan: TOTAL UANG MASUK per tanggal (bukan total nilai invoice)
  const byDate = {};
  filtered.forEach((inv) => {
    const masuk = cashIn(inv);
    if (!byDate[inv.date]) byDate[inv.date] = { revenue: 0, paidCount: 0 };
    byDate[inv.date].revenue += masuk;
    if (masuk > 0) byDate[inv.date].paidCount += 1;
  });
  const chart = Object.keys(byDate).sort().map((d) => ({
    label: formatDateShort(d).slice(0, 6),
    value: byDate[d].revenue,
    paidCount: byDate[d].paidCount,
  }));

  // Donut status progres
  const productionCount = {};
  productionStatusesData.forEach((p) => { productionCount[p.label] = 0; });
  filtered.forEach((inv) => { productionCount[inv.productionStatus] = (productionCount[inv.productionStatus] || 0) + 1; });

  // Invoice Aktif / Perlu Tindak Lanjut: semua kecuali yang sudah Selesai DAN Lunas
  const active = [...filtered]
    .filter((inv) => !(inv.productionStatus === "Selesai" && inv.paymentStatus === "Lunas"))
    .sort((a, b) => b.date.localeCompare(a.date));

  return { totalInvoice, totalRevenue, totalCustomer, totalProduct, chart, productionCount, active, filteredCount: filtered.length };
}

function renderDashboardStats() {
  const grid = document.getElementById("dashStatGrid");
  const items = [
    { icon: ICONS.invoice, bg: "#EEF0FF", fg: "#6366F1", label: "Total Invoice", value: dashboardData.totalInvoice, delta: dashboardData.deltaInvoice, up: true },
    { icon: ICONS.revenue, bg: "#E9FBF0", fg: "#22C55E", label: "Total Pendapatan", value: formatRp(dashboardData.totalRevenue), delta: dashboardData.deltaRevenue, up: true },
    { icon: ICONS.product, bg: "#FEF6E7", fg: "#F59E0B", label: "Total Produk", value: dashboardData.totalProduct, delta: dashboardData.deltaProduct, up: true },
    { icon: ICONS.customer, bg: "#FDECEC", fg: "#EF4444", label: "Total Customer", value: dashboardData.totalCustomer, delta: dashboardData.deltaCustomer, up: true },
  ];
  grid.innerHTML = items.map((it) => `
    <div class="card stat-card">
      <div class="stat-icon" style="background:${it.bg}; color:${it.fg};">${it.icon}</div>
      <div>
        <p class="stat-label">${it.label}</p>
        <p class="stat-value">${it.value}</p>
      </div>
      <p class="stat-delta ${it.up ? "up" : "down"}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        ${it.delta}
      </p>
    </div>`).join("");
}

function renderDashboardCharts(computed) {
  const chartData = computed.chart.length ? computed.chart : [{ label: "-", value: 0, paidCount: 0 }];
  document.getElementById("revenueChartWrap").innerHTML = buildLineChart(chartData);

  const total = computed.filteredCount;
  const segs = productionStatusesData.map((p) => ({ label: p.label, value: computed.productionCount[p.label] || 0, color: p.color }));
  document.getElementById("statusDonutWrap").innerHTML = buildDonutChart(segs, 190, 26) +
    `<div class="donut-center"><p class="donut-value">${total}</p><p class="donut-label">Total</p></div>`;
  document.getElementById("statusLegend").innerHTML = segs.map((s) => `
    <div class="legend-row">
      <span class="legend-key"><span class="legend-dot" style="background:${s.color};"></span>${s.label}</span>
      <span class="legend-val">${s.value} (${total ? Math.round((s.value/total)*100) : 0}%)</span>
    </div>`).join("");
}

// Tabel bawah Dashboard: hanya invoice yang masih perlu ditindaklanjuti
// (Selesai + Lunas tidak ditampilkan karena sudah tuntas)
function renderDashboardActiveInvoices(computed) {
  const body = document.getElementById("dashRecentInvoiceBody");
  if (computed.active.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="table-empty">Semua invoice pada rentang ini sudah selesai & lunas 🎉</td></tr>`;
    return;
  }
  body.innerHTML = computed.active.slice(0, 8).map((inv) => `
    <tr>
      <td class="cell-link">${inv.id}</td>
      <td>${inv.customer}</td>
      <td>${formatDateShort(inv.date)}</td>
      <td class="cell-strong">${formatRp(inv.total)}</td>
      <td>${statusBadge(inv.productionStatus, findStatusColor(productionStatusesData, inv.productionStatus))}</td>
      <td>${statusBadge(inv.paymentStatus, findStatusColor(paymentStatusesData, inv.paymentStatus))}</td>
      <td><button class="action-btn" data-goto="invoice" title="Lihat">${ICONS.eye}</button></td>
    </tr>`).join("");
  body.querySelectorAll("[data-goto]").forEach((b) => b.addEventListener("click", () => goToPage("invoice")));
}

// Reminder ikut Master Filter Periode Dashboard yang sama seperti komponen lain
function renderReminders() {
  const list = document.getElementById("reminderList");
  if (!list) return;
  const { from, to } = dashboardDateRange;
  const filtered = remindersData.filter((r) => (!from || r.date >= from) && (!to || r.date <= to));

  if (filtered.length === 0) {
    list.innerHTML = `<p style="font-size:12.5px; color:var(--color-text-secondary);">Tidak ada reminder pada periode ini.</p>`;
    return;
  }
  list.innerHTML = filtered.map((r) => `
    <label class="newest-item" style="cursor:pointer; align-items:flex-start;">
      <input type="checkbox" data-id="${r.id}" class="reminder-check" ${r.done ? "checked" : ""} style="margin-top:3px;">
      <span class="newest-name" style="white-space:normal; text-decoration:${r.done ? "line-through" : "none"}; color:${r.done ? "var(--color-text-secondary)" : "var(--color-text-primary)"};">${r.text}</span>
    </label>`).join("");
  list.querySelectorAll(".reminder-check").forEach((chk) => chk.addEventListener("change", (e) => {
    const r = remindersData.find((x) => x.id === e.target.dataset.id);
    r.done = e.target.checked;
    renderReminders();
  }));
}

/* ---------- MASTER FILTER TANGGAL (satu-satunya filter waktu di Dashboard) ---------- */
// Konversi Date -> "YYYY-MM-DD" berdasarkan komponen tanggal LOKAL (bukan UTC).
// Ini memperbaiki bug: toISOString() mengonversi ke UTC sehingga di zona waktu
// positif (WIB/WITA/WIT, UTC+7/+8/+9) tanggal bisa bergeser mundur 1 hari.
function toLocalISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function initDashboardPeriodFilter() {
  const fromInput = document.getElementById("dashDateFrom");
  const toInput = document.getElementById("dashDateTo");
  const applyBtn = document.getElementById("dashDateApplyBtn");

  // Isi input dengan rentang tanggal aktif saat halaman dimuat
  fromInput.value = dashboardDateRange.from;
  toInput.value = dashboardDateRange.to;

  applyBtn.addEventListener("click", () => {
    if (!fromInput.value || !toInput.value) { alert("Lengkapi Tanggal Mulai dan Tanggal Selesai."); return; }
    if (fromInput.value > toInput.value) { alert("Tanggal Mulai tidak boleh lebih besar dari Tanggal Selesai."); return; }
    dashboardDateRange = { from: fromInput.value, to: toInput.value };
    renderDashboard();
    showToast("Dashboard diperbarui sesuai rentang tanggal");
  });
}

function renderDashboard() {
  const computed = computeDashboardData(dashboardDateRange.from, dashboardDateRange.to);
  dashboardData.totalInvoice = computed.totalInvoice;
  dashboardData.totalRevenue = computed.totalRevenue;
  dashboardData.totalCustomer = computed.totalCustomer;
  dashboardData.totalProduct = computed.totalProduct;

  renderDashboardStats();
  renderDashboardCharts(computed);
  renderDashboardActiveInvoices(computed);
  renderReminders();
}

/* ==========================================================================
   HELPER BADGE
   ========================================================================== */
// Cari warna status dari master data (paymentStatusesData / productionStatusesData)
function findStatusColor(list, label) {
  const found = list.find((s) => s.label === label);
  return found ? found.color : null;
}

// Ubah hex color jadi rgba lembut untuk latar badge dinamis
function hexToSoftRgba(hex, alpha) {
  const h = (hex || "").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(full, 16);
  if (isNaN(int)) return `rgba(99, 102, 241, ${alpha})`;
  const r = (int >> 16) & 255, g = (int >> 8) & 255, b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function statusBadge(status, color) {
  // Jika warna dinamis tersedia (status pembayaran/produksi dari master data), pakai itu.
  if (color) {
    return `<span class="badge" style="background:${hexToSoftRgba(color, 0.14)}; color:${color};">${status}</span>`;
  }
  // Fallback untuk status lain di aplikasi (mis. status produk/customer) yang masih pakai kelas statis.
  const map = {
    "Lunas": "badge-lunas", "DP": "badge-dp", "Belum Bayar": "badge-belum-bayar", "Overdue": "badge-overdue",
    "Pending": "badge-pending", "Aktif": "badge-aktif", "Tidak Aktif": "badge-tidak-aktif",
    "Draft": "badge-draft", "Diproses": "badge-diproses", "Siap Diambil": "badge-siap-diambil",
    "Selesai": "badge-lunas", "Dibatalkan": "badge-overdue",
    "Nonaktif": "badge-dp", "Arsip": "badge-overdue",
  };
  return `<span class="badge ${map[status] || ""}">${status}</span>`;
}

/* ==========================================================================
   7) HALAMAN INVOICE
   ========================================================================== */
let invoiceFilters = { from: addDaysISO(TODAY_ISO, -29), to: TODAY_ISO, status: "Semua Status", statusProd: "Semua Status", q: "" };

function getFilteredInvoices() {
  return invoicesData.filter((inv) => {
    if (invoiceFilters.status !== "Semua Status" && inv.paymentStatus !== invoiceFilters.status) return false;
    if (invoiceFilters.statusProd !== "Semua Status" && inv.productionStatus !== invoiceFilters.statusProd) return false;
    if (invoiceFilters.q && !(`${inv.id} ${inv.customer}`.toLowerCase().includes(invoiceFilters.q.toLowerCase()))) return false;
    if (invoiceFilters.from && inv.date < invoiceFilters.from) return false;
    if (invoiceFilters.to && inv.date > invoiceFilters.to) return false;
    return true;
  });
}

// Kartu ke-5 bersifat "carousel": satu kartu, tiga info bisa dipilih lewat dropdown,
// supaya ruang Dashboard tetap ringkas namun informasi tetap lengkap.
const INVOICE_REVENUE_CARD_MODES = {
  nilai: { label: "Total Nilai Invoice", icon: "revenue", bg: "#EEF0FF", fg: "#6366F1" },
  diterima: { label: "Pendapatan Diterima", icon: "check", bg: "#E9FBF0", fg: "#22C55E" },
  piutang: { label: "Sisa Piutang", icon: "clock", bg: "#FEF6E7", fg: "#F59E0B" },
};
let invoiceRevenueCardMode = "nilai";

function renderInvoiceStats() {
  const grid = document.getElementById("invoiceStatGrid");
  const filtered = getFilteredInvoices();

  const lunas = filtered.filter((i) => i.paymentStatus === "Lunas").length;
  const dp = filtered.filter((i) => i.paymentStatus === "DP").length;
  const overdue = filtered.filter((i) => i.paymentStatus === "Overdue").length;

  // Total Nilai Invoice: SELURUH invoice hasil filter, apapun status pembayarannya
  const totalNilaiInvoice = filtered.reduce((s, i) => s + i.total, 0);
  // Pendapatan Diterima: uang yang BENAR-BENAR sudah masuk (Lunas penuh, DP hanya nominal dibayar)
  const cashIn = (inv) => inv.paymentStatus === "Lunas" ? inv.total : inv.paymentStatus === "DP" ? (inv.dp || 0) : 0;
  const pendapatanDiterima = filtered.reduce((s, i) => s + cashIn(i), 0);
  // Sisa Piutang: selisih antara nilai invoice dan uang yang sudah diterima
  const sisaPiutang = totalNilaiInvoice - pendapatanDiterima;
  const revenueValues = { nilai: totalNilaiInvoice, diterima: pendapatanDiterima, piutang: sisaPiutang };

  const items = [
    { icon: ICONS.invoice, bg: "#EEF0FF", fg: "#6366F1", label: "Total Invoice", value: filtered.length },
    { icon: ICONS.check, bg: "#E9FBF0", fg: "#22C55E", label: "Lunas", value: lunas },
    { icon: ICONS.clock, bg: "#FEF6E7", fg: "#F59E0B", label: "DP", value: dp },
    { icon: ICONS.alert, bg: "#FDECEC", fg: "#EF4444", label: "Overdue", value: overdue },
  ];

  const activeMode = INVOICE_REVENUE_CARD_MODES[invoiceRevenueCardMode];
  const revenueCardHTML = `
    <div class="card stat-card">
      <div class="stat-icon" style="background:${activeMode.bg}; color:${activeMode.fg};">${ICONS[activeMode.icon]}</div>
      <div style="position:relative;">
        <button id="invoiceRevenueCardToggle" style="display:flex; align-items:center; gap:5px; border:none; background:none; cursor:pointer; padding:0;">
          <p class="stat-label">${activeMode.label}</p>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--color-text-secondary); flex-shrink:0;"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <p class="stat-value" style="white-space:nowrap;">${formatRp(revenueValues[invoiceRevenueCardMode])}</p>
        <div class="dropdown-panel" id="invoiceRevenueCardDropdown" style="top: calc(100% + 6px); left: 0; right: auto; min-width: 200px;">
          ${Object.entries(INVOICE_REVENUE_CARD_MODES).map(([key, m]) => `<div class="dropdown-item ${key === invoiceRevenueCardMode ? "active-period" : ""}" data-mode="${key}">${m.label}</div>`).join("")}
        </div>
      </div>
    </div>`;

  grid.innerHTML = items.map((it) => `
    <div class="card stat-card">
      <div class="stat-icon" style="background:${it.bg}; color:${it.fg};">${it.icon}</div>
      <div><p class="stat-label">${it.label}</p><p class="stat-value">${it.value}</p></div>
    </div>`).join("") + revenueCardHTML;

  const toggleBtn = document.getElementById("invoiceRevenueCardToggle");
  const dropdown = document.getElementById("invoiceRevenueCardDropdown");
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !dropdown.classList.contains("open");
    closeAllDropdowns();
    if (willOpen) dropdown.classList.add("open");
  });
  dropdown.addEventListener("click", (e) => e.stopPropagation());
  dropdown.querySelectorAll("[data-mode]").forEach((item) => {
    item.addEventListener("click", () => {
      invoiceRevenueCardMode = item.dataset.mode;
      dropdown.classList.remove("open");
      renderInvoiceStats();
    });
  });
}

function renderInvoiceTable() {
  const body = document.getElementById("invoiceTableBody");
  const list = getFilteredInvoices();
  if (list.length === 0) {
    body.innerHTML = `<tr><td colspan="8" class="table-empty">Tidak ada invoice yang cocok dengan filter.</td></tr>`;
    return;
  }
  body.innerHTML = list.map((inv) => `
    <tr class="clickable-row" data-id="${inv.id}">
      <td class="cell-link">${inv.id}</td>
      <td>${inv.customer}</td>
      <td>${formatDateShort(inv.date)}</td>
      <td>${formatDateShort(inv.due)}</td>
      <td class="cell-strong">${formatRp(inv.total)}</td>
      <td>${statusBadge(inv.paymentStatus, findStatusColor(paymentStatusesData, inv.paymentStatus))}</td>
      <td>${statusBadge(inv.productionStatus, findStatusColor(productionStatusesData, inv.productionStatus))}</td>
      <td>
        <div class="row-actions">
          <button class="action-btn btn-preview" data-id="${inv.id}" title="Preview">${ICONS.eye}</button>
          <button class="action-btn btn-edit" data-id="${inv.id}" title="Edit Invoice">${ICONS.pencil}</button>
          <button class="action-btn btn-download" data-id="${inv.id}" title="Download">${ICONS.download}</button>
        </div>
      </td>
    </tr>`).join("");

  body.querySelectorAll(".clickable-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest(".row-actions")) return;
      openInvoiceDetailModal(row.dataset.id);
    });
  });
  body.querySelectorAll(".btn-preview").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); openPreviewModal(invoicesData.find((i) => i.id === b.dataset.id)); }));
  body.querySelectorAll(".btn-edit").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); openInvoiceDetailModal(b.dataset.id); }));
  body.querySelectorAll(".btn-download").forEach((b) => b.addEventListener("click", (e) => {
    e.stopPropagation();
    const inv = invoicesData.find((i) => i.id === b.dataset.id);
    if (inv) downloadInvoicePDF(inv);
  }));
}

// PPN (persentase pajak) kini diatur langsung di halaman Invoice, bukan di Pengaturan.
// Nilainya tetap disimpan di settingsData.invoice.tax agar semua perhitungan
// (form invoice, ringkasan, preview, PDF) otomatis ikut berubah.
function initInvoicePPNSetting() {
  const ppnInput = document.getElementById("invPPNInput");
  const saveBtn = document.getElementById("saveInvPPNBtn");
  ppnInput.value = settingsData.invoice.tax;

  saveBtn.addEventListener("click", () => {
    const val = Number(ppnInput.value);
    if (isNaN(val) || val < 0) { alert("Masukkan persentase PPN yang valid."); return; }
    settingsData.invoice.tax = val;
    showToast(`PPN diperbarui menjadi ${val}%`);
  });
}

// Mengisi ulang dropdown Status Pembayaran & Status Produksi di filter Invoice
// berdasarkan master data terbaru. Dipanggil saat init dan setiap kali master
// data status ditambah/edit/hapus dari Pengaturan.
function populateInvoiceStatusFilterOptions() {
  const statusSel = document.getElementById("fInvStatus");
  const prodSel = document.getElementById("fInvProdStatus");
  const curStatus = statusSel.value;
  const curProd = prodSel.value;

  statusSel.innerHTML = `<option>Semua Status</option>` + paymentStatusesData.map((s) => `<option>${s.label}</option>`).join("");
  prodSel.innerHTML = `<option>Semua Status</option>` + productionStatusesData.map((s) => `<option>${s.label}</option>`).join("");

  const statusOk = [...statusSel.options].some((o) => o.value === curStatus);
  const prodOk = [...prodSel.options].some((o) => o.value === curProd);
  statusSel.value = statusOk ? curStatus : "Semua Status";
  prodSel.value = prodOk ? curProd : "Semua Status";
}

function initInvoiceFilterBar() {
  populateInvoiceStatusFilterOptions();
  // Sinkronkan tampilan input tanggal dengan default dinamis (30 hari terakhir dari hari ini)
  document.getElementById("fInvFrom").value = invoiceFilters.from;
  document.getElementById("fInvTo").value = invoiceFilters.to;

  document.getElementById("applyInvoiceFilterBtn").addEventListener("click", () => {
    invoiceFilters = {
      from: document.getElementById("fInvFrom").value,
      to: document.getElementById("fInvTo").value,
      status: document.getElementById("fInvStatus").value,
      statusProd: document.getElementById("fInvProdStatus").value,
      q: document.getElementById("fInvSearch").value,
    };
    renderInvoiceTable();
    renderInvoiceStats();
  });
  document.getElementById("fInvSearch").addEventListener("input", (e) => {
    invoiceFilters.q = e.target.value;
    renderInvoiceTable();
    renderInvoiceStats();
  });
  document.getElementById("resetInvoiceFilterBtn").addEventListener("click", () => {
    document.getElementById("fInvFrom").value = "";
    document.getElementById("fInvTo").value = "";
    document.getElementById("fInvStatus").value = "Semua Status";
    document.getElementById("fInvProdStatus").value = "Semua Status";
    document.getElementById("fInvSearch").value = "";
    invoiceFilters = { from: "", to: "", status: "Semua Status", statusProd: "Semua Status", q: "" };
    renderInvoiceTable();
    renderInvoiceStats();
  });
  initInvoiceExportMenu();
}

/* ----- EXPORT (PDF / Excel / CSV) — selalu mengikuti invoiceFilters yang sedang aktif ----- */
function initInvoiceExportMenu() {
  const btn = document.getElementById("exportInvoiceBtn");
  // Bungkus tombol Export dengan dropdown pilihan format, tanpa mengubah tampilan tombolnya
  const wrap = document.createElement("div");
  wrap.style.position = "relative";
  btn.parentNode.insertBefore(wrap, btn);
  wrap.appendChild(btn);

  const menu = document.createElement("div");
  menu.className = "dropdown-panel";
  menu.id = "exportInvoiceMenu";
  menu.innerHTML = `
    <div class="dropdown-item" data-format="pdf">Export PDF</div>
    <div class="dropdown-item" data-format="xlsx">Export Excel (.xlsx)</div>
    <div class="dropdown-item" data-format="csv">Export CSV</div>
  `;
  wrap.appendChild(menu);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !menu.classList.contains("open");
    closeAllDropdowns();
    if (willOpen) menu.classList.add("open");
  });
  menu.addEventListener("click", (e) => e.stopPropagation());
  menu.querySelectorAll("[data-format]").forEach((item) => {
    item.addEventListener("click", () => {
      exportFilteredInvoices(item.dataset.format);
      menu.classList.remove("open");
    });
  });
}

function exportFilteredInvoices(format) {
  const list = getFilteredInvoices();
  if (list.length === 0) { showToast("Tidak ada invoice pada filter aktif untuk diexport"); return; }

  const rangeLabel = (invoiceFilters.from || invoiceFilters.to)
    ? `${invoiceFilters.from ? formatDateShort(invoiceFilters.from) : "awal"} - ${invoiceFilters.to ? formatDateShort(invoiceFilters.to) : "akhir"}`
    : "Semua Tanggal";

  if (format === "csv") {
    const header = ["No. Invoice", "Customer", "Tanggal", "Jatuh Tempo", "Total", "Status Pembayaran", "Status Progres"];
    const rows = list.map((inv) => [inv.id, inv.customer, inv.date, inv.due, inv.total, inv.paymentStatus, inv.productionStatus]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadTextFile(csv, `invoice-export-${Date.now()}.csv`, "text/csv;charset=utf-8;");
  } else if (format === "xlsx") {
    // Tanpa library eksternal: Excel tetap bisa membuka file HTML table berekstensi .xls
    const header = ["No. Invoice", "Customer", "Tanggal", "Jatuh Tempo", "Total", "Status Pembayaran", "Status Progres"];
    const rows = list.map((inv) => `<tr><td>${inv.id}</td><td>${inv.customer}</td><td>${inv.date}</td><td>${inv.due}</td><td>${inv.total}</td><td>${inv.paymentStatus}</td><td>${inv.productionStatus}</td></tr>`).join("");
    const html = `<html><head><meta charset="UTF-8"></head><body><table border="1"><tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr>${rows}</table></body></html>`;
    downloadTextFile(html, `invoice-export-${Date.now()}.xls`, "application/vnd.ms-excel");
  } else if (format === "pdf") {
    // Tanpa library eksternal: buka jendela cetak berisi tabel, user pilih "Simpan sebagai PDF"
    const rowsHtml = list.map((inv) => `<tr><td>${inv.id}</td><td>${inv.customer}</td><td>${formatDateShort(inv.date)}</td><td>${formatDateShort(inv.due)}</td><td>${formatRp(inv.total)}</td><td>${inv.paymentStatus}</td><td>${inv.productionStatus}</td></tr>`).join("");
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Export Invoice</title>
      <style>
        body{font-family:Inter,Arial,sans-serif; padding:24px; color:#1F2937;}
        h2{margin-bottom:2px;} p{color:#6B7280; margin-top:0; margin-bottom:18px; font-size:13px;}
        table{width:100%; border-collapse:collapse; font-size:12.5px;}
        th,td{border:1px solid #E5E7EB; padding:8px 10px; text-align:left;}
        th{background:#F8F9FA;}
      </style></head>
      <body>
        <h2>FRNDLY SUITES — Export Invoice</h2>
        <p>Rentang: ${rangeLabel} · Total data: ${list.length}</p>
        <table><thead><tr><th>No. Invoice</th><th>Customer</th><th>Tanggal</th><th>Jatuh Tempo</th><th>Total</th><th>Pembayaran</th><th>Progres</th></tr></thead>
        <tbody>${rowsHtml}</tbody></table>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `);
    win.document.close();
  }
  showToast(`Export ${format.toUpperCase()} berhasil (${list.length} invoice, ${rangeLabel})`);
}

function downloadTextFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ----- MODAL: BUAT / EDIT INVOICE (berbagi UI item & ringkasan yang sama) ----- */
let newInvoiceItems = [];
let invoiceModalMode = "create"; // "create" | "edit"
let editingInvoiceRef = null;    // referensi objek invoice asli yang sedang diedit
let editItemsSnapshot = "";      // snapshot JSON item saat modal dibuka, untuk deteksi perubahan

function nextInvoiceNo() {
  const nums = invoicesData.map((i) => parseInt(i.id.split("-").pop(), 10));
  const next = (Math.max(0, ...nums) + 1).toString().padStart(4, "0");
  return settingsData.invoice.prefix + next;
}

function openCreateInvoiceModal() {
  invoiceModalMode = "create";
  editingInvoiceRef = null;
  newInvoiceItems = [{ product: "", qty: 1, unit: "Paket", price: 0, discount: 0, discountType: "percent" }];
  document.getElementById("invoiceModalTitle").textContent = "Buat Invoice";
  document.getElementById("invoiceModalSub").textContent = "Lengkapi detail invoice di bawah ini";

  const today = TODAY_ISO;
  const due = addDaysISO(today, settingsData.invoice.dueDays);

  document.getElementById("invoiceModalBody").innerHTML = `
    <div class="two-col" style="grid-template-columns: 2fr 1fr;">
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="card pad">
          <p class="section-title" style="font-size:15px; margin-bottom:14px;">Informasi Invoice</p>
          <div class="form-row cols-3">
            <div class="form-field"><label>Tanggal Invoice <span class="req">*</span></label><input type="date" id="newInvDate" value="${today}"></div>
            <div class="form-field"><label>No. Invoice <span class="req">*</span></label><input type="text" id="newInvNo" value="${nextInvoiceNo()}" readonly style="background:#F8F9FA;"></div>
            <div class="form-field"><label>Jatuh Tempo <span class="req">*</span></label><input type="date" id="newInvDue" value="${due}"></div>
          </div>
          <div class="form-row cols-2">
            <div class="form-field">
              <label>Customer <span class="req">*</span></label>
              <select id="newInvCustomer"><option value="">Pilih customer...</option>${customersData.map((c) => `<option value="${c.name}">${c.name}</option>`).join("")}</select>
            </div>
            <div class="form-field">
              <label>Sales (Opsional)</label>
              <select id="newInvSales"><option value="">Pilih sales...</option><option>Donny Bagoes</option><option>Rina Amelia</option></select>
            </div>
          </div>
          <div class="form-field"><label>Catatan (Opsional)</label><textarea id="newInvNotes" rows="2" placeholder="Tulis catatan untuk invoice ini..."></textarea></div>
        </div>

        <div class="card pad">
          <p class="section-title" style="font-size:15px; margin-bottom:14px;">Detail Produk / Jasa</p>
          <div id="itemsContainer"></div>
          <button class="btn btn-outline-primary btn-sm" id="addItemBtn">${ICONS.plus} Tambah Item</button>
          <div class="form-field" style="margin-top:16px;"><label>Syarat & Ketentuan (Opsional)</label><textarea id="newInvTerms" rows="2" placeholder="Tulis syarat dan ketentuan pembayaran...">${settingsData.invoice.terms}</textarea></div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="summary-box">
          <p class="section-title" style="font-size:15px; margin-bottom:12px;">Ringkasan Invoice</p>
          <div class="summary-row"><span>Subtotal</span><span id="sumSubtotal">Rp 0</span></div>
          <div class="summary-row"><span>Diskon</span><span id="sumDiscount">Rp 0</span></div>
          <div class="summary-row"><span>Pajak (PPN ${settingsData.invoice.tax}%)</span><span id="sumTax">Rp 0</span></div>
          <div class="summary-total-row"><span>Total</span><span id="sumTotal">Rp 0</span></div>
          <label class="checkbox-row" style="margin-top:12px; margin-bottom:0;"><input type="checkbox" id="newInvTaxed" ${settingsData.invoice.autoTax ? "checked" : ""}> Invoice sudah termasuk pajak</label>
        </div>
        <button class="btn btn-outline-primary btn-block" id="btnLihatPreview">${ICONS.eye} Lihat Preview</button>
        <div class="help-box">
          <p class="help-title">Bantuan</p>
          <ul>
            <li>• No. Invoice akan terisi otomatis</li>
            <li>• Pastikan tanggal invoice dan jatuh tempo benar</li>
            <li>• Pilih customer sebelum menambah item</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById("invoiceModalFooter").innerHTML = `
    <button class="btn btn-ghost" id="btnBatalInvoice">Batal</button>
    <button class="btn btn-primary" id="btnSimpanInvoice">${ICONS.check} Simpan Invoice</button>
  `;

  renderItemRows();
  document.getElementById("addItemBtn").addEventListener("click", () => { newInvoiceItems.push({ product: "", qty: 1, unit: "Paket", price: 0, discount: 0, discountType: "percent" }); renderItemRows(); });
  document.getElementById("btnBatalInvoice").addEventListener("click", closeInvoiceModal);
  document.getElementById("btnLihatPreview").addEventListener("click", () => {
    const draft = collectInvoiceForm();
    openPreviewModal(draft);
  });
  document.getElementById("btnSimpanInvoice").addEventListener("click", saveNewInvoice);
  document.getElementById("newInvTaxed").addEventListener("change", updateInvoiceSummary);

  document.getElementById("invoiceModalOverlay").classList.add("open");
}

function addDaysISO(iso, days) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toLocalISO(d);
}

function renderItemRows() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = newInvoiceItems.map((it, idx) => {
    const isPercent = (it.discountType || "percent") === "percent";
    return `
    <div class="item-row">
      <div class="form-field">
        ${idx === 0 ? "<label>Produk</label>" : ""}
        <select data-idx="${idx}" class="product-select">
          <option value="">Pilih produk...</option>
          ${productsData.map((p) => `<option value="${p.name}" ${it.product === p.name ? "selected" : ""}>${p.name}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">${idx === 0 ? "<label>Qty</label>" : ""}<input type="number" min="1" data-idx="${idx}" class="qty-input" value="${it.qty}"></div>
      <div class="form-field">${idx === 0 ? "<label>Harga Satuan</label>" : ""}<input type="number" data-idx="${idx}" class="price-input" value="${it.price}"></div>
      <div class="form-field">
        ${idx === 0 ? "<label>Diskon</label>" : ""}
        <div style="display:flex; gap:6px;">
          <select data-idx="${idx}" class="discount-type-select" style="width:88px; flex-shrink:0;">
            <option value="percent" ${isPercent ? "selected" : ""}>Persen (%)</option>
            <option value="nominal" ${!isPercent ? "selected" : ""}>Nominal (Rp)</option>
          </select>
          <input type="number" data-idx="${idx}" class="discount-input" value="${it.discount}" placeholder="${isPercent ? "cth. 10" : "cth. 100000"}" style="flex:1;">
        </div>
      </div>
      <button class="remove-item-btn" data-idx="${idx}" title="Hapus item">${ICONS.trash}</button>
    </div>
  `;
  }).join("");

  container.querySelectorAll(".product-select").forEach((el) => el.addEventListener("change", (e) => {
    const idx = Number(e.target.dataset.idx);
    const product = productsData.find((p) => p.name === e.target.value);
    newInvoiceItems[idx].product = e.target.value;
    newInvoiceItems[idx].price = product ? product.price : 0;
    newInvoiceItems[idx].unit = product ? product.unit : "Paket";
    renderItemRows();
  }));
  container.querySelectorAll(".qty-input").forEach((el) => el.addEventListener("input", (e) => { newInvoiceItems[Number(e.target.dataset.idx)].qty = Number(e.target.value) || 0; updateInvoiceSummary(); }));
  container.querySelectorAll(".price-input").forEach((el) => el.addEventListener("input", (e) => { newInvoiceItems[Number(e.target.dataset.idx)].price = Number(e.target.value) || 0; updateInvoiceSummary(); }));
  container.querySelectorAll(".discount-type-select").forEach((el) => el.addEventListener("change", (e) => {
    const idx = Number(e.target.dataset.idx);
    newInvoiceItems[idx].discountType = e.target.value;
    newInvoiceItems[idx].discount = 0; // reset nilai saat ganti metode agar tidak salah hitung
    renderItemRows();
  }));
  container.querySelectorAll(".discount-input").forEach((el) => el.addEventListener("input", (e) => { newInvoiceItems[Number(e.target.dataset.idx)].discount = Number(e.target.value) || 0; updateInvoiceSummary(); }));
  container.querySelectorAll(".remove-item-btn").forEach((el) => el.addEventListener("click", (e) => {
    const idx = Number(e.currentTarget.dataset.idx);
    if (newInvoiceItems.length === 1) { showToast("Minimal 1 item diperlukan"); return; }
    newInvoiceItems.splice(idx, 1);
    renderItemRows();
  }));

  updateInvoiceSummary();
}

// Menghitung diskon per item sesuai metode: persen dari (qty x harga), atau nominal langsung (Rp)
function itemDiscountAmount(it) {
  const lineTotal = it.qty * it.price;
  if ((it.discountType || "percent") === "nominal") {
    return Math.min(it.discount || 0, lineTotal); // nominal tidak boleh melebihi nilai baris
  }
  return lineTotal * ((it.discount || 0) / 100);
}

function calcInvoiceTotals(items, taxed) {
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const discountTotal = items.reduce((s, it) => s + itemDiscountAmount(it), 0);
  const afterDiscount = subtotal - discountTotal;
  const tax = taxed ? afterDiscount * (settingsData.invoice.tax / 100) : 0;
  const total = afterDiscount + tax;
  return { subtotal, discountTotal, tax, total };
}

function updateInvoiceSummary() {
  const taxed = document.getElementById("newInvTaxed").checked;
  const { subtotal, discountTotal, tax, total } = calcInvoiceTotals(newInvoiceItems, taxed);
  document.getElementById("sumSubtotal").textContent = formatRp(subtotal);
  document.getElementById("sumDiscount").textContent = formatRp(discountTotal);
  document.getElementById("sumTax").textContent = formatRp(tax);
  document.getElementById("sumTotal").textContent = formatRp(total);

  // Mode edit: Sisa Tagihan ikut menyesuaikan setiap kali item/pajak berubah
  const dpInput = document.getElementById("editInvDp");
  const sisaEl = document.getElementById("sisaTagihan");
  if (invoiceModalMode === "edit" && dpInput && sisaEl) {
    const sisa = Math.max(total - (Number(dpInput.value) || 0), 0);
    sisaEl.textContent = formatRp(sisa);
  }
}

function collectInvoiceForm() {
  const taxed = document.getElementById("newInvTaxed").checked;
  const { total } = calcInvoiceTotals(newInvoiceItems, taxed);
  return {
    id: document.getElementById("newInvNo").value,
    date: document.getElementById("newInvDate").value,
    due: document.getElementById("newInvDue").value,
    customer: document.getElementById("newInvCustomer").value || "(Belum dipilih)",
    notes: document.getElementById("newInvNotes").value,
    terms: document.getElementById("newInvTerms").value,
    items: newInvoiceItems,
    total, taxed, dp: 0,
    paymentStatus: paymentStatusesData[0] ? paymentStatusesData[0].label : "Belum Bayar",
    productionStatus: productionStatusesData[0] ? productionStatusesData[0].label : "Draft",
  };
}

function saveNewInvoice() {
  const customer = document.getElementById("newInvCustomer").value;
  if (!customer) { alert("Pilih customer terlebih dahulu."); return; }
  if (newInvoiceItems.some((it) => !it.product)) { alert("Lengkapi produk pada setiap item."); return; }
  const inv = collectInvoiceForm();
  invoicesData.unshift(inv);
  dashboardData.totalInvoice = invoicesData.length;
  closeInvoiceModal();
  renderInvoiceStats(); renderInvoiceTable(); renderDashboard(); refreshCustomerViews();
  showToast("Invoice berhasil dibuat");
}

// Dipanggil setiap kali data invoice berubah (buat/edit) agar Total Pembelian,
// Total Piutang, dan Segmen di halaman Customer selalu ikut ter-update otomatis.
function refreshCustomerViews() {
  if (document.getElementById("customerTableBody")) renderCustomerTable();
  if (document.getElementById("customerStatGrid")) renderCustomerStats();
  if (document.getElementById("customerSummaryBox")) renderCustomerSidePanels();
}

/* ----- MODAL: EDIT INVOICE (item, diskon, catatan, jatuh tempo, status & pembayaran) ----- */
function openInvoiceDetailModal(id) {
  const inv = invoicesData.find((i) => i.id === id);
  if (!inv) return;

  invoiceModalMode = "edit";
  editingInvoiceRef = inv;
  // deep-copy item supaya perubahan di form tidak langsung memengaruhi data asli sebelum disimpan
  newInvoiceItems = inv.items.map((it) => ({ ...it, discountType: it.discountType || "percent" }));
  editItemsSnapshot = JSON.stringify(newInvoiceItems);

  document.getElementById("invoiceModalTitle").textContent = `Edit Invoice — ${inv.id}`;
  document.getElementById("invoiceModalSub").textContent = "Ubah item, catatan, jatuh tempo, atau status invoice";

  document.getElementById("invoiceModalBody").innerHTML = `
    <div class="two-col" style="grid-template-columns: 2fr 1fr;">
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="card pad">
          <p class="section-title" style="font-size:15px; margin-bottom:14px;">Informasi Invoice</p>
          <div class="form-row cols-3">
            <div class="form-field"><label>No. Invoice</label><input type="text" value="${inv.id}" readonly style="background:#F8F9FA;"></div>
            <div class="form-field"><label>Tanggal Invoice</label><input type="text" value="${formatDateShort(inv.date)}" readonly style="background:#F8F9FA;"></div>
            <div class="form-field"><label>Jatuh Tempo</label><input type="date" id="newInvDue" value="${inv.due}"></div>
          </div>
          <div class="form-field"><label>Customer</label><input type="text" value="${inv.customer}" readonly style="background:#F8F9FA;"></div>
          <div class="form-field"><label>Catatan (Opsional)</label><textarea id="newInvNotes" rows="2" placeholder="Tulis catatan untuk invoice ini...">${inv.notes || ""}</textarea></div>
        </div>

        <div class="card pad">
          <p class="section-title" style="font-size:15px; margin-bottom:14px;">Detail Produk / Jasa</p>
          <div id="itemsContainer"></div>
          <button class="btn btn-outline-primary btn-sm" id="addItemBtn">${ICONS.plus} Tambah Item</button>
          <div class="form-field" style="margin-top:16px;"><label>Syarat & Ketentuan (Opsional)</label><textarea id="newInvTerms" rows="2" placeholder="Tulis syarat dan ketentuan pembayaran...">${inv.terms || ""}</textarea></div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="summary-box">
          <p class="section-title" style="font-size:15px; margin-bottom:12px;">Ringkasan Invoice</p>
          <div class="summary-row"><span>Subtotal</span><span id="sumSubtotal">Rp 0</span></div>
          <div class="summary-row"><span>Diskon</span><span id="sumDiscount">Rp 0</span></div>
          <div class="summary-row"><span>Pajak (PPN ${settingsData.invoice.tax}%)</span><span id="sumTax">Rp 0</span></div>
          <div class="summary-total-row"><span>Grand Total</span><span id="sumTotal">Rp 0</span></div>
          <label class="checkbox-row" style="margin-top:12px; margin-bottom:0;"><input type="checkbox" id="newInvTaxed" ${inv.taxed ? "checked" : ""}> Invoice sudah termasuk pajak</label>
        </div>

        <div class="card pad">
          <p class="section-title" style="font-size:15px; margin-bottom:14px;">Status & Pembayaran</p>
          <div class="form-field">
            <label>Status Pembayaran</label>
            <select id="editInvStatus">
              ${paymentStatusesData.map((s) => `<option ${inv.paymentStatus === s.label ? "selected" : ""}>${s.label}</option>`).join("")}
            </select>
          </div>
          <div class="form-field">
            <label>Status Produksi</label>
            <select id="editInvProdStatus">
              ${productionStatusesData.map((p) => `<option ${inv.productionStatus === p.label ? "selected" : ""}>${p.label}</option>`).join("")}
            </select>
          </div>
          <div class="form-field"><label>Jumlah DP Dibayar</label><input type="number" id="editInvDp" value="${inv.dp || 0}"></div>
          <div class="summary-row"><span>Sisa Tagihan</span><span id="sisaTagihan" style="font-weight:700; color:#EF4444;">${formatRp(Math.max(inv.total - (inv.dp||0), 0))}</span></div>
        </div>

        <button class="btn btn-outline-primary btn-block" id="btnLihatPreview">${ICONS.eye} Lihat Preview</button>
      </div>
    </div>
  `;

  document.getElementById("invoiceModalFooter").innerHTML = `
    <button class="btn btn-ghost" id="btnBatalInvoice">Batal</button>
    <button class="btn btn-primary" id="btnSimpanInvoice">${ICONS.check} Simpan Perubahan</button>
  `;

  renderItemRows();
  document.getElementById("addItemBtn").addEventListener("click", () => { newInvoiceItems.push({ product: "", qty: 1, unit: "Paket", price: 0, discount: 0, discountType: "percent" }); renderItemRows(); });
  document.getElementById("btnBatalInvoice").addEventListener("click", closeInvoiceModal);
  document.getElementById("newInvTaxed").addEventListener("change", updateInvoiceSummary);
  document.getElementById("editInvDp").addEventListener("input", updateInvoiceSummary);
  document.getElementById("btnLihatPreview").addEventListener("click", () => openPreviewModal(collectEditInvoiceForm()));
  document.getElementById("btnSimpanInvoice").addEventListener("click", saveEditedInvoice);

  document.getElementById("invoiceModalOverlay").classList.add("open");
}

// Bentuk data invoice sementara (untuk preview) berdasarkan isi form edit yang sedang berjalan
function collectEditInvoiceForm() {
  const inv = editingInvoiceRef;
  const taxed = document.getElementById("newInvTaxed").checked;
  const { total } = calcInvoiceTotals(newInvoiceItems, taxed);
  return {
    id: inv.id,
    date: inv.date,
    due: document.getElementById("newInvDue").value,
    customer: inv.customer,
    notes: document.getElementById("newInvNotes").value,
    terms: document.getElementById("newInvTerms").value,
    items: newInvoiceItems,
    total, taxed,
    dp: Number(document.getElementById("editInvDp").value) || 0,
    paymentStatus: document.getElementById("editInvStatus").value,
    productionStatus: document.getElementById("editInvProdStatus").value,
  };
}

function saveEditedInvoice() {
  const inv = editingInvoiceRef;
  if (!inv) return;
  if (newInvoiceItems.length === 0 || newInvoiceItems.some((it) => !it.product)) {
    alert("Lengkapi produk pada setiap item.");
    return;
  }

  const itemsChanged = JSON.stringify(newInvoiceItems) !== editItemsSnapshot;
  const hasPayment = inv.paymentStatus === "DP" || inv.paymentStatus === "Lunas";

  const applyChanges = () => {
    const taxed = document.getElementById("newInvTaxed").checked;
    const { total } = calcInvoiceTotals(newInvoiceItems, taxed);

    inv.items = newInvoiceItems;
    inv.taxed = taxed;
    inv.total = total;
    inv.due = document.getElementById("newInvDue").value;
    inv.notes = document.getElementById("newInvNotes").value;
    inv.terms = document.getElementById("newInvTerms").value;
    inv.paymentStatus = document.getElementById("editInvStatus").value;
    inv.productionStatus = document.getElementById("editInvProdStatus").value;
    inv.dp = Number(document.getElementById("editInvDp").value) || 0;

    closeInvoiceModal();
    renderInvoiceStats(); renderInvoiceTable(); renderDashboard(); refreshCustomerViews();
    showToast(itemsChanged
      ? "✅ Invoice berhasil diperbarui. Total tagihan dan sisa pembayaran telah dihitung ulang."
      : "Invoice berhasil diperbarui.");
  };

  if (hasPayment && itemsChanged) {
    showConfirmDialog({
      message: "Invoice ini sudah memiliki pembayaran.<br><br>Mengubah item akan menghitung ulang total tagihan dan sisa pembayaran.<br><br>Apakah Anda yakin ingin melanjutkan?",
      confirmLabel: "Lanjutkan",
      cancelLabel: "Batal",
      onConfirm: applyChanges,
    });
  } else {
    applyChanges();
  }
}

function closeInvoiceModal() { document.getElementById("invoiceModalOverlay").classList.remove("open"); }

// Dialog konfirmasi generik (dibuat dinamis, memakai class modal yang sama persis
// dengan modal lain agar tampilannya konsisten dengan desain FRNDLY SUITES).
function showConfirmDialog({ message, confirmLabel = "Lanjutkan", cancelLabel = "Batal", onConfirm }) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay open";
  overlay.style.zIndex = "250";
  overlay.innerHTML = `
    <div class="modal-box" style="max-width:440px;">
      <div class="modal-head">
        <p class="modal-title" style="font-size:16px;">Konfirmasi Perubahan</p>
      </div>
      <div class="modal-body">
        <p style="font-size:13.5px; color:var(--color-text-primary); line-height:1.6;">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="confirmDialogCancel">${cancelLabel}</button>
        <button class="btn btn-primary" id="confirmDialogOk">${confirmLabel}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const remove = () => document.body.removeChild(overlay);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) remove(); });
  overlay.querySelector("#confirmDialogCancel").addEventListener("click", remove);
  overlay.querySelector("#confirmDialogOk").addEventListener("click", () => { remove(); onConfirm(); });
}

/* ----- MODAL: PREVIEW INVOICE ----- */
// Membangun markup preview invoice (dipakai baik oleh modal Preview maupun oleh generator PDF)
function buildInvoicePreviewHTML(invoiceLike) {
  const taxed = invoiceLike.taxed !== undefined ? invoiceLike.taxed : true;
  const { subtotal, discountTotal, tax, total } = calcInvoiceTotals(invoiceLike.items, taxed);
  const dp = invoiceLike.dp || 0;
  const sisa = (invoiceLike.total || total) - dp;

  const itemRows = invoiceLike.items.map((it) => `
    <tr>
      <td>${it.product || "-"}</td>
      <td style="text-align:center;">${it.qty} ${it.unit}</td>
      <td style="text-align:right;">${formatRp(it.price)}</td>
      <td style="text-align:right;">${(it.discountType || "percent") === "nominal" ? formatRp(it.discount || 0) : `${it.discount || 0}%`}</td>
      <td style="text-align:right; font-weight:600;">${formatRp(it.qty * it.price - itemDiscountAmount(it))}</td>
    </tr>`).join("");

  return `
    <div class="invoice-preview">
      <div class="preview-head">
        <div>
          <div class="preview-company">
            <span class="preview-logo">${settingsData.company.logo
              ? `<img src="${settingsData.company.logo}" alt="Logo ${settingsData.company.name}">`
              : (settingsData.company.name || "?").trim().charAt(0).toUpperCase()}</span>
            ${settingsData.company.name}
          </div>
          <p style="font-size:12px; color:#6B7280;">${settingsData.company.address}</p>
          <p style="font-size:12px; color:#6B7280;">${settingsData.company.phone} · ${settingsData.company.email}</p>
        </div>
        <div style="text-align:right;">
          <p style="font-size:20px; font-weight:800; color:#6366F1;">INVOICE</p>
          <p style="font-weight:700;">${invoiceLike.id || "-"}</p>
        </div>
      </div>
      <div class="preview-meta-grid">
        <div><p class="label">Ditagihkan kepada</p><p style="font-weight:700;">${invoiceLike.customer}</p></div>
        <div><p class="label">Tanggal Invoice</p><p>${formatDateShort(invoiceLike.date)}</p></div>
        <div><p class="label">Jatuh Tempo</p><p>${formatDateShort(invoiceLike.due)}</p></div>
      </div>
      <div class="table-wrap">
        <table class="preview-table">
          <thead><tr><th>Produk / Jasa</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Harga</th><th style="text-align:right;">Diskon</th><th style="text-align:right;">Total</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>
      <div class="preview-totals">
        <div class="box">
          <div class="row"><span>Subtotal</span><span>${formatRp(subtotal)}</span></div>
          <div class="row"><span>Diskon</span><span>${formatRp(discountTotal)}</span></div>
          <div class="row"><span>Pajak (PPN ${settingsData.invoice.tax}%)</span><span>${formatRp(tax)}</span></div>
          <div class="row grand"><span>Total</span><span>${formatRp(invoiceLike.total || total)}</span></div>
          <div class="row"><span>DP Dibayar</span><span style="color:#22C55E;">${formatRp(dp)}</span></div>
          <div class="row" style="font-weight:700;"><span>Sisa Tagihan</span><span style="color:${sisa > 0 ? "#EF4444" : "#22C55E"};">${formatRp(Math.max(sisa,0))}</span></div>
        </div>
      </div>
      ${invoiceLike.terms ? `<div><p style="font-weight:700; font-size:12.5px; margin-bottom:4px;">Syarat & Ketentuan</p><p style="font-size:12px; color:#6B7280;">${invoiceLike.terms}</p></div>` : ""}
    </div>
  `;
}

function openPreviewModal(invoiceLike) {
  document.getElementById("previewModalSub").textContent = invoiceLike.id || invoiceLike.customer;
  document.getElementById("previewModalBody").innerHTML = buildInvoicePreviewHTML(invoiceLike);
  document.getElementById("previewModalOverlay").classList.add("open");
}

// Download PDF sungguhan (html2pdf.js) — tidak lagi simulasi.
// Membuat elemen preview di luar layar, di-render ke PDF, lalu dibersihkan.
function downloadInvoicePDF(invoiceLike) {
  if (typeof html2pdf === "undefined") {
    showToast("Gagal memuat library PDF. Periksa koneksi internet Anda.");
    return;
  }
  const holder = document.createElement("div");
  holder.style.position = "fixed";
  holder.style.left = "-10000px";
  holder.style.top = "0";
  holder.style.width = "800px";
  holder.innerHTML = buildInvoicePreviewHTML(invoiceLike);
  document.body.appendChild(holder);

  const filename = `${invoiceLike.id || "Invoice"}.pdf`;
  showToast(`Menyiapkan PDF ${filename}...`);

  html2pdf()
    .set({
      margin: 8,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(holder.querySelector(".invoice-preview"))
    .save()
    .then(() => { document.body.removeChild(holder); showToast(`PDF ${filename} berhasil diunduh`); })
    .catch(() => { document.body.removeChild(holder); showToast("Gagal membuat PDF. Coba lagi."); });
}

function initInvoiceModalCloseHandlers() {
  document.getElementById("closeInvoiceModal").addEventListener("click", closeInvoiceModal);
  document.getElementById("invoiceModalOverlay").addEventListener("click", (e) => { if (e.target.id === "invoiceModalOverlay") closeInvoiceModal(); });
  document.getElementById("closePreviewModal").addEventListener("click", () => document.getElementById("previewModalOverlay").classList.remove("open"));
  document.getElementById("previewModalOverlay").addEventListener("click", (e) => { if (e.target.id === "previewModalOverlay") document.getElementById("previewModalOverlay").classList.remove("open"); });
  document.getElementById("printPreviewBtn").addEventListener("click", () => window.print());
  document.getElementById("openCreateInvoiceBtn").addEventListener("click", openCreateInvoiceModal);
}

/* ==========================================================================
   8) HALAMAN CUSTOMER
   ========================================================================== */

// Ambang batas "masih aktif bertransaksi" dalam hari, dipakai untuk segmentasi customer
const CUSTOMER_ACTIVE_WINDOW_DAYS = 90;

function diffDaysISO(fromIso, toIso) {
  const a = new Date(fromIso + "T00:00:00");
  const b = new Date(toIso + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

// Seluruh invoice milik seorang customer (dicocokkan berdasarkan nama)
function getCustomerInvoices(customerName) {
  return invoicesData.filter((inv) => inv.customer === customerName);
}

// Total Pembelian = seluruh NILAI invoice milik customer tsb (bukan hanya yang lunas),
// otomatis mengikuti invoicesData sehingga selalu sinkron saat invoice dibuat/diubah.
function getCustomerTotalPembelian(customerName) {
  return getCustomerInvoices(customerName).reduce((s, inv) => s + inv.total, 0);
}

// Total Piutang = sisa yang belum dibayar dari seluruh invoice customer tsb
function getCustomerTotalPiutang(customerName) {
  const cashIn = (inv) => inv.paymentStatus === "Lunas" ? inv.total : inv.paymentStatus === "DP" ? (inv.dp || 0) : 0;
  return getCustomerInvoices(customerName).reduce((s, inv) => s + (inv.total - cashIn(inv)), 0);
}

// Ambil label segmen yang sedang aktif di master data berdasarkan key internal
// ("baru"/"aktif"/"repeat"/"tidak_aktif"). Kalau item-nya sudah dihapus admin,
// fallback ke key itu sendiri supaya tidak error.
function segmentLabelByKey(key) {
  const found = customerSegmentsData.find((s) => s.key === key);
  return found ? found.label : key;
}

// Segmentasi customer berdasarkan perilaku transaksi (menggantikan status Aktif/Tidak Aktif manual):
// 🟢 Baru     -> baru pertama kali order (tepat 1 invoice) dan masih dalam 90 hari terakhir
// 🔵 Aktif    -> pernah order dalam 90 hari terakhir (2x order)
// 🟠 Repeat   -> pernah order dalam 90 hari terakhir DAN sudah order lebih dari 2 kali
// 🔴 Tidak Aktif -> tidak pernah order, atau order terakhir lebih dari 90 hari lalu
// Admin bisa menimpa (override) segmen ini secara manual lewat Edit Customer; kalau
// segmentOverride diisi, nilai itu yang dipakai dan algoritma otomatis di bawah dilewati.
function getCustomerSegment(customerName) {
  const cust = customersData.find((c) => c.name === customerName);
  if (cust && cust.segmentOverride) return cust.segmentOverride;

  const invs = getCustomerInvoices(customerName);
  if (invs.length === 0) return segmentLabelByKey("tidak_aktif");
  const lastDate = invs.reduce((max, inv) => (inv.date > max ? inv.date : max), invs[0].date);
  const daysSince = diffDaysISO(lastDate, TODAY_ISO);
  if (daysSince > CUSTOMER_ACTIVE_WINDOW_DAYS) return segmentLabelByKey("tidak_aktif");
  if (invs.length === 1) return segmentLabelByKey("baru");
  if (invs.length > 2) return segmentLabelByKey("repeat");
  return segmentLabelByKey("aktif");
}

let customerFilters = { q: "", status: "Semua Segmen", city: "Semua Kota", type: "Semua Tipe" };

function populateCustomerCityFilter() {
  const cities = [...new Set(customersData.map((c) => c.city))];
  document.getElementById("fCustCity").innerHTML = `<option>Semua Kota</option>` + cities.map((c) => `<option>${c}</option>`).join("");
}

function getFilteredCustomers() {
  return customersData.filter((c) => {
    if (customerFilters.status !== "Semua Segmen" && getCustomerSegment(c.name) !== customerFilters.status) return false;
    if (customerFilters.city !== "Semua Kota" && c.city !== customerFilters.city) return false;
    if (customerFilters.type !== "Semua Tipe" && c.type !== customerFilters.type) return false;
    if (customerFilters.q && !c.name.toLowerCase().includes(customerFilters.q.toLowerCase())) return false;
    return true;
  });
}

function renderCustomerStats() {
  const grid = document.getElementById("customerStatGrid");
  // Total Customer: SELURUH customer yang tersimpan (tidak terpengaruh filter apapun)
  const totalCustomer = customersData.length;
  // Customer Aktif: pernah bertransaksi dalam 90 hari terakhir (segmen Baru/Aktif/Repeat)
  const aktif = customersData.filter((c) => getCustomerSegment(c.name) !== "Tidak Aktif").length;
  // Customer Baru: transaksi pertamanya baru terjadi (tepat 1x order, masih dalam 90 hari)
  const baru = customersData.filter((c) => getCustomerSegment(c.name) === "Baru").length;
  const totalPiutang = customersData.reduce((s, c) => s + getCustomerTotalPiutang(c.name), 0);
  const items = [
    { icon: ICONS.customer, bg: "#EEF0FF", fg: "#6366F1", label: "Total Customer", value: totalCustomer },
    { icon: ICONS.check, bg: "#E9FBF0", fg: "#22C55E", label: "Customer Aktif (90 hari)", value: aktif },
    { icon: ICONS.plus, bg: "#EEF0FF", fg: "#6366F1", label: "Customer Baru", value: baru },
    { icon: ICONS.revenue, bg: "#FEF6E7", fg: "#F59E0B", label: "Total Piutang", value: formatRp(totalPiutang) },
  ];
  grid.innerHTML = items.map((it) => `
    <div class="card stat-card">
      <div class="stat-icon" style="background:${it.bg}; color:${it.fg};">${it.icon}</div>
      <div><p class="stat-label">${it.label}</p><p class="stat-value" style="white-space:nowrap;">${it.value}</p></div>
    </div>`).join("");
}

function renderCustomerTable() {
  const body = document.getElementById("customerTableBody");
  const list = getFilteredCustomers();
  if (list.length === 0) { body.innerHTML = `<tr><td colspan="8" class="table-empty">Tidak ada customer yang cocok dengan filter.</td></tr>`; return; }
  body.innerHTML = list.map((c) => {
    const segment = getCustomerSegment(c.name);
    const totalPembelian = getCustomerTotalPembelian(c.name);
    const totalPiutang = getCustomerTotalPiutang(c.name);
    return `
    <tr>
      <td><p class="cell-strong">${c.name}</p><p class="cell-sub">${c.email}</p></td>
      <td>${c.contact}</td>
      <td>${c.city}</td>
      <td>${statusBadge(c.type, findStatusColor(customerTypesData, c.type))}</td>
      <td>${statusBadge(segment, findStatusColor(customerSegmentsData, segment))}</td>
      <td class="cell-strong" style="white-space:nowrap;">${formatRp(totalPembelian)}</td>
      <td style="font-weight:600; white-space:nowrap; color:${totalPiutang > 0 ? "#EF4444" : "#6B7280"};">${formatRp(totalPiutang)}</td>
      <td><button class="action-btn btn-edit-customer" data-id="${c.id}" title="Edit Customer">${ICONS.pencil}</button></td>
    </tr>`;
  }).join("");

  body.querySelectorAll(".btn-edit-customer").forEach((btn) => btn.addEventListener("click", () => openEditCustomerModal(btn.dataset.id)));
}

function renderCustomerSidePanels() {
  const byType = {};
  customerTypesData.forEach((t) => { byType[t.label] = 0; });
  customersData.forEach((c) => { byType[c.type] = (byType[c.type] || 0) + 1; });

  const segCount = {};
  customerSegmentsData.forEach((s) => { segCount[s.label] = 0; });
  customersData.forEach((c) => { const seg = getCustomerSegment(c.name); segCount[seg] = (segCount[seg] || 0) + 1; });

  document.getElementById("customerSummaryBox").innerHTML = `
    ${Object.entries(byType).map(([k, v]) => `<div class="summary-row"><span>${k}</span><span class="cell-strong">${v}</span></div>`).join("")}
    ${customerSegmentsData.map((s, i) => `
    <div class="summary-row${i === 0 ? " divider" : ""}"><span><span class="legend-dot" style="background:${s.color}; display:inline-block; margin-right:7px; vertical-align:middle;"></span>${s.label}</span><span style="font-weight:700; color:${s.color};">${segCount[s.label] || 0}</span></div>`).join("")}
  `;

  const totalPiutang = customersData.reduce((s, c) => s + getCustomerTotalPiutang(c.name), 0);
  const segs = [
    { label: "Belum Jatuh Tempo", value: Math.round(totalPiutang * 0.41), color: "#EF4444" },
    { label: "Jatuh Tempo 1-30 Hari", value: Math.round(totalPiutang * 0.27), color: "#F59E0B" },
    { label: "Jatuh Tempo 31-60 Hari", value: Math.round(totalPiutang * 0.17), color: "#FBBF24" },
    { label: "Jatuh Tempo > 60 Hari", value: Math.round(totalPiutang * 0.15), color: "#22C55E" },
  ];
  document.getElementById("piutangDonutWrap").innerHTML = buildDonutChart(segs, 170, 22) +
    `<div class="donut-center"><p style="font-weight:800; font-size:13px; white-space:nowrap;">${formatRp(totalPiutang)}</p><p class="donut-label">Total Piutang</p></div>`;
  document.getElementById("piutangLegend").innerHTML = segs.map((s) => `
    <div class="legend-row"><span class="legend-key"><span class="legend-dot" style="background:${s.color};"></span>${s.label}</span><span class="legend-val" style="white-space:nowrap;">${formatRp(s.value)}</span></div>`).join("");

  const newest = [...customersData].sort((a, b) => (b.joined || "").localeCompare(a.joined || "")).slice(0, 5);
  document.getElementById("newestCustomerList").innerHTML = newest.map((c) => `
    <div class="newest-item">
      <div class="newest-icon">${ICONS.customer}</div>
      <p class="newest-name">${c.name}</p>
      <p class="newest-date">${formatDateShort(c.joined)}</p>
    </div>`).join("");
}

// Mengisi ulang dropdown Segmen & Tipe Customer di filter berdasarkan master data
// terbaru. Dipanggil saat init dan setiap kali master data diubah dari Pengaturan.
function populateCustomerStatusTypeFilterOptions() {
  const segSel = document.getElementById("fCustStatus");
  const typeSel = document.getElementById("fCustType");
  const curSeg = segSel.value;
  const curType = typeSel.value;

  segSel.innerHTML = `<option>Semua Segmen</option>` + customerSegmentsData.map((s) => `<option>${s.label}</option>`).join("");
  typeSel.innerHTML = `<option>Semua Tipe</option>` + customerTypesData.map((t) => `<option>${t.label}</option>`).join("");

  segSel.value = [...segSel.options].some((o) => o.value === curSeg) ? curSeg : "Semua Segmen";
  typeSel.value = [...typeSel.options].some((o) => o.value === curType) ? curType : "Semua Tipe";
}

function initCustomerFilterBar() {
  populateCustomerCityFilter();
  populateCustomerStatusTypeFilterOptions();
  document.getElementById("applyCustomerFilterBtn").addEventListener("click", () => {
    customerFilters = {
      q: document.getElementById("fCustSearch").value,
      status: document.getElementById("fCustStatus").value,
      city: document.getElementById("fCustCity").value,
      type: document.getElementById("fCustType").value,
    };
    renderCustomerTable();
  });
  document.getElementById("fCustSearch").addEventListener("input", (e) => { customerFilters.q = e.target.value; renderCustomerTable(); });
  document.getElementById("resetCustomerFilterBtn").addEventListener("click", () => {
    document.getElementById("fCustSearch").value = "";
    document.getElementById("fCustStatus").value = "Semua Segmen";
    document.getElementById("fCustCity").value = "Semua Kota";
    document.getElementById("fCustType").value = "Semua Tipe";
    customerFilters = { q: "", status: "Semua Segmen", city: "Semua Kota", type: "Semua Tipe" };
    renderCustomerTable();
  });
  initCustomerExportMenu();
}

/* ----- EXPORT CUSTOMER (PDF / Excel / CSV) — mengikuti customerFilters yang aktif ----- */
function initCustomerExportMenu() {
  const btn = document.getElementById("exportCustomerBtn");
  const wrap = document.createElement("div");
  wrap.style.position = "relative";
  btn.parentNode.insertBefore(wrap, btn);
  wrap.appendChild(btn);

  const menu = document.createElement("div");
  menu.className = "dropdown-panel";
  menu.id = "exportCustomerMenu";
  menu.innerHTML = `
    <div class="dropdown-item" data-format="pdf">Export PDF</div>
    <div class="dropdown-item" data-format="xlsx">Export Excel (.xlsx)</div>
    <div class="dropdown-item" data-format="csv">Export CSV</div>
  `;
  wrap.appendChild(menu);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !menu.classList.contains("open");
    closeAllDropdowns();
    if (willOpen) menu.classList.add("open");
  });
  menu.addEventListener("click", (e) => e.stopPropagation());
  menu.querySelectorAll("[data-format]").forEach((item) => {
    item.addEventListener("click", () => {
      exportFilteredCustomers(item.dataset.format);
      menu.classList.remove("open");
    });
  });
}

function exportFilteredCustomers(format) {
  const list = getFilteredCustomers();
  if (list.length === 0) { showToast("Tidak ada customer pada filter aktif untuk diexport"); return; }

  const rows = list.map((c) => ({
    name: c.name, contact: c.contact, email: c.email, city: c.city, type: c.type,
    segment: getCustomerSegment(c.name),
    totalPembelian: getCustomerTotalPembelian(c.name),
    totalPiutang: getCustomerTotalPiutang(c.name),
  }));
  const header = ["Nama Customer", "Kontak", "Email", "Kota", "Tipe", "Segmen", "Total Pembelian", "Total Piutang"];

  if (format === "csv") {
    const csvRows = rows.map((r) => [r.name, r.contact, r.email, r.city, r.type, r.segment, r.totalPembelian, r.totalPiutang]);
    const csv = [header, ...csvRows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadTextFile(csv, `customer-export-${Date.now()}.csv`, "text/csv;charset=utf-8;");
  } else if (format === "xlsx") {
    const trs = rows.map((r) => `<tr><td>${r.name}</td><td>${r.contact}</td><td>${r.email}</td><td>${r.city}</td><td>${r.type}</td><td>${r.segment}</td><td>${r.totalPembelian}</td><td>${r.totalPiutang}</td></tr>`).join("");
    const html = `<html><head><meta charset="UTF-8"></head><body><table border="1"><tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr>${trs}</table></body></html>`;
    downloadTextFile(html, `customer-export-${Date.now()}.xls`, "application/vnd.ms-excel");
  } else if (format === "pdf") {
    const trs = rows.map((r) => `<tr><td>${r.name}</td><td>${r.contact}</td><td>${r.city}</td><td>${r.type}</td><td>${r.segment}</td><td>${formatRp(r.totalPembelian)}</td><td>${formatRp(r.totalPiutang)}</td></tr>`).join("");
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Export Customer</title>
      <style>
        body{font-family:Inter,Arial,sans-serif; padding:24px; color:#1F2937;}
        h2{margin-bottom:2px;} p{color:#6B7280; margin-top:0; margin-bottom:18px; font-size:13px;}
        table{width:100%; border-collapse:collapse; font-size:12.5px;}
        th,td{border:1px solid #E5E7EB; padding:8px 10px; text-align:left;}
        th{background:#F8F9FA;}
      </style></head>
      <body>
        <h2>FRNDLY SUITES — Export Customer</h2>
        <p>Total data: ${list.length}</p>
        <table><thead><tr><th>Nama</th><th>Kontak</th><th>Kota</th><th>Tipe</th><th>Segmen</th><th>Total Pembelian</th><th>Total Piutang</th></tr></thead>
        <tbody>${trs}</tbody></table>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `);
    win.document.close();
  }
  showToast(`Export ${format.toUpperCase()} berhasil (${list.length} customer)`);
}

/* ----- MODAL: TAMBAH CUSTOMER ----- */
let customerModalMode = "create"; // "create" | "edit"
let editingCustomerRef = null;

// c = null untuk mode Tambah, atau object customer yang ada untuk mode Edit
function buildCustomerForm(c) {
  const typeOptions = customerTypesData.map((t) => `<option ${c && c.type === t.label ? "selected" : ""}>${t.label}</option>`).join("");
  const segmentField = c ? `
    <div class="form-field">
      <label>Segmen Customer</label>
      <select id="newCustSegmentOverride">
        <option value="" ${!c.segmentOverride ? "selected" : ""}>Otomatis (berdasarkan riwayat transaksi)</option>
        ${customerSegmentsData.map((s) => `<option value="${s.label}" ${c.segmentOverride === s.label ? "selected" : ""}>${s.label} (Manual)</option>`).join("")}
      </select>
    </div>` : "";

  return `
    <div class="form-field"><label>Nama Customer <span class="req">*</span></label><input type="text" id="newCustName" placeholder="cth. PT Contoh Jaya" value="${c ? c.name : ""}"></div>
    <div class="form-field"><label>No. Kontak <span class="req">*</span></label><input type="text" id="newCustContact" placeholder="0812 xxxx xxxx" value="${c ? c.contact : ""}"></div>
    <div class="form-field"><label>Email</label><input type="email" id="newCustEmail" placeholder="email@customer.com" value="${c ? (c.email || "") : ""}"></div>
    <div class="form-row cols-2">
      <div class="form-field"><label>Kota</label><input type="text" id="newCustCity" placeholder="cth. Surabaya" value="${c ? (c.city || "") : ""}"></div>
      <div class="form-field"><label>Tipe Customer</label><select id="newCustType">${typeOptions}</select></div>
    </div>
    ${segmentField}
    <div class="help-box">
      <p class="help-title">Info Segmen Customer</p>
      <ul>
        <li>• Segmen dihitung otomatis dari riwayat invoice customer ini, kecuali di-override manual.</li>
        <li>• Customer baru akan berstatus Tidak Aktif sampai invoice pertamanya dibuat.</li>
        <li>• Daftar Tipe & Segmen bisa dikelola di Pengaturan → Master Customer.</li>
      </ul>
    </div>
  `;
}

function openAddCustomerModal() {
  customerModalMode = "create";
  editingCustomerRef = null;
  document.getElementById("customerModalTitle").textContent = "Tambah Customer";
  document.getElementById("customerModalSub").textContent = "Lengkapi data customer baru";
  document.getElementById("saveCustomerBtn").textContent = "Simpan Customer";
  document.getElementById("customerModalBody").innerHTML = buildCustomerForm(null);
  document.getElementById("customerModalOverlay").classList.add("open");
}

function openEditCustomerModal(id) {
  const c = customersData.find((x) => x.id === id);
  if (!c) return;
  customerModalMode = "edit";
  editingCustomerRef = c;
  document.getElementById("customerModalTitle").textContent = `Edit Customer — ${c.name}`;
  document.getElementById("customerModalSub").textContent = "Ubah tipe atau segmen customer ini";
  document.getElementById("saveCustomerBtn").textContent = "Simpan Perubahan";
  document.getElementById("customerModalBody").innerHTML = buildCustomerForm(c);
  document.getElementById("customerModalOverlay").classList.add("open");
}

function initCustomerModal() {
  document.getElementById("openAddCustomerBtn").addEventListener("click", openAddCustomerModal);
  document.getElementById("closeCustomerModal").addEventListener("click", () => document.getElementById("customerModalOverlay").classList.remove("open"));
  document.getElementById("cancelCustomerBtn").addEventListener("click", () => document.getElementById("customerModalOverlay").classList.remove("open"));
  document.getElementById("customerModalOverlay").addEventListener("click", (e) => { if (e.target.id === "customerModalOverlay") document.getElementById("customerModalOverlay").classList.remove("open"); });
  document.getElementById("saveCustomerBtn").addEventListener("click", () => {
    const name = document.getElementById("newCustName").value.trim();
    const contact = document.getElementById("newCustContact").value.trim();
    if (!name || !contact) { alert("Nama dan kontak wajib diisi."); return; }
    const email = document.getElementById("newCustEmail").value.trim();
    const city = document.getElementById("newCustCity").value.trim() || "-";
    const type = document.getElementById("newCustType").value;

    if (customerModalMode === "edit" && editingCustomerRef) {
      const segOverrideEl = document.getElementById("newCustSegmentOverride");
      editingCustomerRef.name = name;
      editingCustomerRef.contact = contact;
      editingCustomerRef.email = email;
      editingCustomerRef.city = city;
      editingCustomerRef.type = type;
      editingCustomerRef.segmentOverride = segOverrideEl.value || null;
      showToast("Perubahan customer disimpan");
    } else {
      customersData.unshift({ id: genId("C"), name, contact, email, city, type, joined: TODAY_ISO, segmentOverride: null });
      dashboardData.totalCustomer = customersData.length;
      showToast("Customer baru berhasil ditambahkan");
    }

    document.getElementById("customerModalOverlay").classList.remove("open");
    populateCustomerCityFilter();
    renderCustomerTable(); renderCustomerStats(); renderCustomerSidePanels(); renderDashboard();
  });
}

/* ==========================================================================
   9) HALAMAN PRODUK
   ========================================================================== */
let productFilters = { q: "", category: "Semua Kategori", status: "Semua Status" };

function getFilteredProducts() {
  return productsData.filter((p) => {
    if (productFilters.category !== "Semua Kategori" && p.category !== productFilters.category) return false;
    if (productFilters.status !== "Semua Status" && p.status !== productFilters.status) return false;
    if (productFilters.q && !p.name.toLowerCase().includes(productFilters.q.toLowerCase())) return false;
    return true;
  });
}

function renderProductStats() {
  const grid = document.getElementById("productStatGrid");
  const aktif = productsData.filter((p) => p.status === "Aktif").length;
  const avgPrice = productsData.reduce((s, p) => s + p.price, 0) / (productsData.length || 1);
  const items = [
    { icon: ICONS.product, bg: "#EEF0FF", fg: "#6366F1", label: "Total Produk", value: productsData.length },
    { icon: ICONS.check, bg: "#E9FBF0", fg: "#22C55E", label: "Produk Aktif", value: aktif },
    { icon: ICONS.revenue, bg: "#FEF6E7", fg: "#F59E0B", label: "Rata-rata Harga", value: formatRp(avgPrice) },
  ];
  grid.innerHTML = items.map((it) => `
    <div class="card stat-card">
      <div class="stat-icon" style="background:${it.bg}; color:${it.fg};">${it.icon}</div>
      <div><p class="stat-label">${it.label}</p><p class="stat-value">${it.value}</p></div>
    </div>`).join("");
}

function renderProductTable() {
  const body = document.getElementById("productTableBody");
  const list = getFilteredProducts();
  if (list.length === 0) { body.innerHTML = `<tr><td colspan="7" class="table-empty">Tidak ada produk yang cocok dengan filter.</td></tr>`; return; }
  body.innerHTML = list.map((p) => `
    <tr>
      <td class="cell-strong">${p.name}</td>
      <td>${p.category}</td>
      <td class="cell-strong" style="white-space:nowrap;">${formatRp(p.price)}</td>
      <td>${p.stock >= 999 ? "Tanpa Batas" : p.stock}</td>
      <td>${p.unit}</td>
      <td>${statusBadge(p.status)}</td>
      <td>
        <button class="action-btn btn-edit-product" data-id="${p.id}" title="Edit Produk">${ICONS.pencil}</button>
      </td>
    </tr>`).join("");

  body.querySelectorAll(".btn-edit-product").forEach((btn) => btn.addEventListener("click", () => openEditProductModal(btn.dataset.id)));
}

function initProductFilterBar() {
  document.getElementById("applyProductFilterBtn").addEventListener("click", () => {
    productFilters = {
      q: document.getElementById("fProdSearch").value,
      category: document.getElementById("fProdCategory").value,
      status: document.getElementById("fProdStatus").value,
    };
    renderProductTable();
  });
  document.getElementById("fProdSearch").addEventListener("input", (e) => { productFilters.q = e.target.value; renderProductTable(); });
  initProductExportMenu();
}

/* ----- EXPORT PRODUK (PDF / Excel / CSV) — mengikuti productFilters yang aktif ----- */
function initProductExportMenu() {
  const btn = document.getElementById("exportProductBtn");
  const wrap = document.createElement("div");
  wrap.style.position = "relative";
  btn.parentNode.insertBefore(wrap, btn);
  wrap.appendChild(btn);

  const menu = document.createElement("div");
  menu.className = "dropdown-panel";
  menu.id = "exportProductMenu";
  menu.innerHTML = `
    <div class="dropdown-item" data-format="pdf">Export PDF</div>
    <div class="dropdown-item" data-format="xlsx">Export Excel (.xlsx)</div>
    <div class="dropdown-item" data-format="csv">Export CSV</div>
  `;
  wrap.appendChild(menu);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !menu.classList.contains("open");
    closeAllDropdowns();
    if (willOpen) menu.classList.add("open");
  });
  menu.addEventListener("click", (e) => e.stopPropagation());
  menu.querySelectorAll("[data-format]").forEach((item) => {
    item.addEventListener("click", () => {
      exportFilteredProducts(item.dataset.format);
      menu.classList.remove("open");
    });
  });
}

function exportFilteredProducts(format) {
  const list = getFilteredProducts();
  if (list.length === 0) { showToast("Tidak ada produk pada filter aktif untuk diexport"); return; }
  const header = ["Nama Produk", "Kategori", "Harga", "Stok", "Satuan", "Status", "Deskripsi"];

  if (format === "csv") {
    const rows = list.map((p) => [p.name, p.category, p.price, p.stock >= 999 ? "Tanpa Batas" : p.stock, p.unit, p.status, p.description || ""]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadTextFile(csv, `produk-export-${Date.now()}.csv`, "text/csv;charset=utf-8;");
  } else if (format === "xlsx") {
    const trs = list.map((p) => `<tr><td>${p.name}</td><td>${p.category}</td><td>${p.price}</td><td>${p.stock >= 999 ? "Tanpa Batas" : p.stock}</td><td>${p.unit}</td><td>${p.status}</td><td>${p.description || ""}</td></tr>`).join("");
    const html = `<html><head><meta charset="UTF-8"></head><body><table border="1"><tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr>${trs}</table></body></html>`;
    downloadTextFile(html, `produk-export-${Date.now()}.xls`, "application/vnd.ms-excel");
  } else if (format === "pdf") {
    const trs = list.map((p) => `<tr><td>${p.name}</td><td>${p.category}</td><td>${formatRp(p.price)}</td><td>${p.stock >= 999 ? "Tanpa Batas" : p.stock}</td><td>${p.unit}</td><td>${p.status}</td></tr>`).join("");
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Export Produk</title>
      <style>
        body{font-family:Inter,Arial,sans-serif; padding:24px; color:#1F2937;}
        h2{margin-bottom:2px;} p{color:#6B7280; margin-top:0; margin-bottom:18px; font-size:13px;}
        table{width:100%; border-collapse:collapse; font-size:12.5px;}
        th,td{border:1px solid #E5E7EB; padding:8px 10px; text-align:left;}
        th{background:#F8F9FA;}
      </style></head>
      <body>
        <h2>FRNDLY SUITES — Export Produk</h2>
        <p>Total data: ${list.length}</p>
        <table><thead><tr><th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Satuan</th><th>Status</th></tr></thead>
        <tbody>${trs}</tbody></table>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `);
    win.document.close();
  }
  showToast(`Export ${format.toUpperCase()} berhasil (${list.length} produk)`);
}

/* ----- MODAL: TAMBAH / EDIT PRODUK (berbagi UI yang sama) ----- */
let newProductStatus = "Aktif";
let productModalMode = "create"; // "create" | "edit"
let editingProductRef = null;

function buildProductForm(p) {
  return `
    <div class="form-field"><label>Nama Produk / Jasa <span class="req">*</span></label><input type="text" id="newProdName" placeholder="cth. Jasa Instalasi Sistem" value="${p ? p.name : ""}"></div>
    <div class="form-row cols-2">
      <div class="form-field"><label>Kategori</label>
        <select id="newProdCategory">
          <option ${!p || p.category === "Jasa" ? "selected" : ""}>Jasa</option>
          <option ${p && p.category === "Produk Digital" ? "selected" : ""}>Produk Digital</option>
          <option ${p && p.category === "Produk Fisik" ? "selected" : ""}>Produk Fisik</option>
        </select>
      </div>
      <div class="form-field"><label>Satuan</label>
        <select id="newProdUnit">
          <option ${!p || p.unit === "Paket" ? "selected" : ""}>Paket</option>
          <option ${p && p.unit === "Lisensi" ? "selected" : ""}>Lisensi</option>
          <option ${p && p.unit === "Pcs" ? "selected" : ""}>Pcs</option>
          <option ${p && p.unit === "Jam" ? "selected" : ""}>Jam</option>
        </select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-field"><label>Harga <span class="req">*</span></label><input type="number" id="newProdPrice" placeholder="0" value="${p ? p.price : ""}"></div>
      <div class="form-field"><label>Stok / Quantity</label><input type="number" id="newProdStock" placeholder="0" value="${p ? p.stock : ""}"></div>
    </div>
    <div class="form-field"><label>Deskripsi (Opsional)</label><textarea id="newProdDesc" rows="2" placeholder="Deskripsi singkat produk...">${p && p.description ? p.description : ""}</textarea></div>
    <div class="form-field">
      <label>Status Produk</label>
      <div class="toggle-group" id="newProdStatusToggle">
        <div class="toggle-option ${(!p || p.status === "Aktif") ? "selected" : ""}" data-status="Aktif">🟢 Aktif</div>
        <div class="toggle-option ${p && p.status === "Nonaktif" ? "selected" : ""}" data-status="Nonaktif">🟡 Nonaktif</div>
        <div class="toggle-option ${p && p.status === "Arsip" ? "selected" : ""}" data-status="Arsip">🔴 Arsip</div>
      </div>
    </div>
  `;
}

function openAddProductModal() {
  productModalMode = "create";
  editingProductRef = null;
  newProductStatus = "Aktif";
  document.getElementById("productModalTitle").textContent = "Tambah Produk";
  document.getElementById("productModalSub").textContent = "Lengkapi data produk atau jasa baru";
  document.getElementById("saveProductBtn").textContent = "Simpan Produk";
  document.getElementById("productModalBody").innerHTML = buildProductForm(null);
  bindProductStatusToggle();
  document.getElementById("productModalOverlay").classList.add("open");
}

function openEditProductModal(id) {
  const p = productsData.find((x) => x.id === id);
  if (!p) return;
  productModalMode = "edit";
  editingProductRef = p;
  newProductStatus = p.status;
  document.getElementById("productModalTitle").textContent = `Edit Produk — ${p.name}`;
  document.getElementById("productModalSub").textContent = "Ubah data produk yang sudah ada";
  document.getElementById("saveProductBtn").textContent = "Simpan Perubahan";
  document.getElementById("productModalBody").innerHTML = buildProductForm(p);
  bindProductStatusToggle();
  document.getElementById("productModalOverlay").classList.add("open");
}

function bindProductStatusToggle() {
  document.querySelectorAll("#newProdStatusToggle .toggle-option").forEach((opt) => opt.addEventListener("click", () => {
    document.querySelectorAll("#newProdStatusToggle .toggle-option").forEach((o) => o.classList.remove("selected"));
    opt.classList.add("selected");
    newProductStatus = opt.dataset.status;
  }));
}

function initProductModal() {
  document.getElementById("openAddProductBtn").addEventListener("click", openAddProductModal);
  document.getElementById("closeProductModal").addEventListener("click", () => document.getElementById("productModalOverlay").classList.remove("open"));
  document.getElementById("cancelProductBtn").addEventListener("click", () => document.getElementById("productModalOverlay").classList.remove("open"));
  document.getElementById("productModalOverlay").addEventListener("click", (e) => { if (e.target.id === "productModalOverlay") document.getElementById("productModalOverlay").classList.remove("open"); });
  document.getElementById("saveProductBtn").addEventListener("click", () => {
    const name = document.getElementById("newProdName").value.trim();
    const price = Number(document.getElementById("newProdPrice").value);
    if (!name || !price) { alert("Nama dan harga wajib diisi."); return; }
    const data = {
      name,
      category: document.getElementById("newProdCategory").value,
      price, stock: Number(document.getElementById("newProdStock").value) || 0,
      unit: document.getElementById("newProdUnit").value,
      description: document.getElementById("newProdDesc").value.trim(),
      status: newProductStatus,
    };

    if (productModalMode === "edit" && editingProductRef) {
      Object.assign(editingProductRef, data);
      document.getElementById("productModalOverlay").classList.remove("open");
      renderProductTable(); renderProductStats();
      showToast("Produk berhasil diperbarui");
    } else {
      productsData.unshift({ id: genId("P"), ...data });
      dashboardData.totalProduct = productsData.length;
      document.getElementById("productModalOverlay").classList.remove("open");
      renderProductTable(); renderProductStats(); renderDashboard();
      showToast("Produk baru berhasil ditambahkan");
    }
  });
}

/* ==========================================================================
   10) HALAMAN PENGATURAN
   ========================================================================== */
const SETTINGS_SECTIONS = [
  { key: "perusahaan", label: "Profil Perusahaan", desc: "Nama, alamat, dan kontak bisnis Anda", icon: ICONS.building },
  { key: "invoice", label: "Pengaturan Invoice", desc: "Prefiks nomor dan jatuh tempo default", icon: ICONS.receipt },
  { key: "statusInvoice", label: "Master Status Invoice", desc: "Kelola status pembayaran & status produksi", icon: ICONS.list },
  { key: "masterCustomer", label: "Master Customer", desc: "Kelola tipe & segmen customer", icon: ICONS.customer },
  { key: "notifikasi", label: "Notifikasi", desc: "Atur pengingat & pemberitahuan", icon: ICONS.bell },
  { key: "keamanan", label: "Keamanan", desc: "Kata sandi dan verifikasi akun", icon: ICONS.shield },
  { key: "pengguna", label: "Profil Pengguna", desc: "Data admin yang login", icon: ICONS.userCog },
];

let activeSettingsKey = "perusahaan";

function renderSettingsNav() {
  const nav = document.getElementById("settingsNav");
  nav.innerHTML = SETTINGS_SECTIONS.map((s) => `
    <button class="settings-nav-item ${s.key === activeSettingsKey ? "active" : ""}" data-key="${s.key}">
      <div class="settings-nav-icon">${s.icon}</div>
      <div><p class="settings-nav-title">${s.label}</p><p class="settings-nav-desc">${s.desc}</p></div>
    </button>`).join("");
  nav.querySelectorAll(".settings-nav-item").forEach((btn) => btn.addEventListener("click", () => setActiveSettings(btn.dataset.key)));
}

function setActiveSettings(key) {
  activeSettingsKey = key;
  renderSettingsNav();
  renderSettingsPanel();
}

function renderSettingsPanel() {
  const meta = SETTINGS_SECTIONS.find((s) => s.key === activeSettingsKey);
  document.getElementById("settingsPanelIcon").innerHTML = meta.icon;
  document.getElementById("settingsPanelTitle").textContent = meta.label;
  document.getElementById("settingsPanelDesc").textContent = meta.desc;

  const body = document.getElementById("settingsPanelBody");

  if (activeSettingsKey === "perusahaan") {
    const c = settingsData.company;
    body.innerHTML = `
      <div class="form-field">
        <label>Logo Perusahaan</label>
        <div class="logo-upload-box">
          <div class="logo-preview" id="logoPreviewBox">
            ${c.logo ? `<img src="${c.logo}" alt="Logo Perusahaan">` : `<span class="logo-preview-placeholder">Belum ada logo</span>`}
          </div>
          <div class="logo-actions">
            <input type="file" id="companyLogoInput" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;">
            <button type="button" class="btn btn-outline-primary btn-sm" id="uploadLogoBtn">${ICONS.upload} ${c.logo ? "Ganti Logo" : "Upload Logo"}</button>
            ${c.logo ? `<button type="button" class="btn btn-ghost btn-sm" id="removeLogoBtn" style="color:#EF4444;">${ICONS.trash} Hapus Logo</button>` : ""}
          </div>
        </div>
        <p style="font-size:11.5px; color:var(--color-text-secondary); margin-top:8px;">Format PNG/JPG/SVG, disarankan latar transparan, maks. 2MB. Logo ini otomatis dipakai pada Invoice, Preview Invoice, dan PDF Invoice.</p>
      </div>
      <div class="form-field"><label>Nama Perusahaan</label><input type="text" id="setCompanyName" value="${c.name}"></div>
      <div class="form-field"><label>Alamat</label><textarea id="setCompanyAddress" rows="2">${c.address}</textarea></div>
      <div class="form-row cols-2">
        <div class="form-field"><label>No. Telepon</label><input type="text" id="setCompanyPhone" value="${c.phone}"></div>
        <div class="form-field"><label>Email Bisnis</label><input type="email" id="setCompanyEmail" value="${c.email}"></div>
      </div>
      <div class="form-field"><label>NPWP</label><input type="text" id="setCompanyNpwp" value="${c.npwp}"></div>
      <button class="btn btn-primary" id="saveCompanyBtn">${ICONS.check} Simpan Perubahan</button>
    `;

    const logoInput = document.getElementById("companyLogoInput");
    document.getElementById("uploadLogoBtn").addEventListener("click", () => logoInput.click());
    logoInput.addEventListener("change", () => {
      const file = logoInput.files && logoInput.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) { alert("File harus berupa gambar (PNG/JPG/SVG)."); return; }
      if (file.size > 2 * 1024 * 1024) { alert("Ukuran logo maksimal 2MB."); return; }
      const reader = new FileReader();
      reader.onload = () => {
        settingsData.company.logo = reader.result;
        renderSettingsPanel();
        showToast("Logo perusahaan berhasil diunggah");
      };
      reader.readAsDataURL(file);
    });
    const removeBtn = document.getElementById("removeLogoBtn");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        settingsData.company.logo = null;
        renderSettingsPanel();
        showToast("Logo perusahaan dihapus");
      });
    }

    document.getElementById("saveCompanyBtn").addEventListener("click", () => {
      settingsData.company.name = document.getElementById("setCompanyName").value;
      settingsData.company.address = document.getElementById("setCompanyAddress").value;
      settingsData.company.phone = document.getElementById("setCompanyPhone").value;
      settingsData.company.email = document.getElementById("setCompanyEmail").value;
      settingsData.company.npwp = document.getElementById("setCompanyNpwp").value;
      showToast("Profil perusahaan disimpan");
    });
  }

  if (activeSettingsKey === "invoice") {
    const iv = settingsData.invoice;
    body.innerHTML = `
      <div class="form-row cols-2">
        <div class="form-field"><label>Prefiks No. Invoice</label><input type="text" id="setInvPrefix" value="${iv.prefix}"></div>
        <div class="form-field"><label>Jatuh Tempo Default (hari)</label><input type="number" id="setInvDueDays" value="${iv.dueDays}"></div>
      </div>
      <div class="form-field"><label>Syarat & Ketentuan Default</label><textarea id="setInvTerms" rows="3">${iv.terms}</textarea></div>
      <label class="checkbox-row"><input type="checkbox" id="setInvAutoTax" ${iv.autoTax ? "checked" : ""}> Terapkan pajak otomatis pada invoice baru</label>
      <p style="font-size:11.5px; color:var(--color-text-secondary); margin:-4px 0 4px;">Persentase PPN kini diatur langsung di halaman Invoice.</p>
      <button class="btn btn-primary" id="saveInvoiceSettingsBtn">${ICONS.check} Simpan Perubahan</button>
    `;
    document.getElementById("saveInvoiceSettingsBtn").addEventListener("click", () => {
      settingsData.invoice.prefix = document.getElementById("setInvPrefix").value;
      settingsData.invoice.dueDays = Number(document.getElementById("setInvDueDays").value) || 7;
      settingsData.invoice.autoTax = document.getElementById("setInvAutoTax").checked;
      settingsData.invoice.terms = document.getElementById("setInvTerms").value;
      showToast("Pengaturan invoice disimpan");
    });
  }

  if (activeSettingsKey === "statusInvoice") {
    body.innerHTML = `
      <p style="font-size:12.5px; color:var(--color-text-secondary); margin:-4px 0 16px;">Kelola daftar status yang tersedia di halaman Invoice. Semua dropdown & badge status invoice (filter, form, tabel, preview, PDF) otomatis mengikuti daftar ini.</p>
      <div class="form-row cols-2" style="align-items:start;">
        <div>
          <p class="section-title" style="font-size:14px; margin-bottom:10px;">Status Pembayaran</p>
          <div id="paymentStatusList" class="status-master-list"></div>
          <div class="status-master-add">
            <input type="color" id="newPaymentStatusColor" value="#6366F1">
            <input type="text" id="newPaymentStatusLabel" placeholder="Nama status baru...">
            <button class="btn btn-outline-primary btn-sm" id="addPaymentStatusBtn">${ICONS.plus} Tambah</button>
          </div>
        </div>
        <div>
          <p class="section-title" style="font-size:14px; margin-bottom:10px;">Status Produksi</p>
          <div id="productionStatusList" class="status-master-list"></div>
          <div class="status-master-add">
            <input type="color" id="newProductionStatusColor" value="#6366F1">
            <input type="text" id="newProductionStatusLabel" placeholder="Nama status baru...">
            <button class="btn btn-outline-primary btn-sm" id="addProductionStatusBtn">${ICONS.plus} Tambah</button>
          </div>
        </div>
      </div>
    `;

    renderStatusMasterList("paymentStatusList", paymentStatusesData, paymentStatusOpts);
    renderStatusMasterList("productionStatusList", productionStatusesData, productionStatusOpts);

    document.getElementById("addPaymentStatusBtn").addEventListener("click", () => {
      handleAddStatus(paymentStatusesData, "newPaymentStatusLabel", "newPaymentStatusColor", "paymentStatusList", paymentStatusOpts);
    });
    document.getElementById("addProductionStatusBtn").addEventListener("click", () => {
      handleAddStatus(productionStatusesData, "newProductionStatusLabel", "newProductionStatusColor", "productionStatusList", productionStatusOpts);
    });
  }

  if (activeSettingsKey === "masterCustomer") {
    body.innerHTML = `
      <p style="font-size:12.5px; color:var(--color-text-secondary); margin:-4px 0 16px;">Kelola daftar Tipe & Segmen yang tersedia di halaman Customer. Semua dropdown & badge terkait otomatis mengikuti daftar ini. Kota tidak termasuk di sini — tetap kolom teks bebas.</p>
      <div class="form-row cols-2" style="align-items:start;">
        <div>
          <p class="section-title" style="font-size:14px; margin-bottom:10px;">Tipe Customer</p>
          <div id="customerTypeList" class="status-master-list"></div>
          <div class="status-master-add">
            <input type="color" id="newCustomerTypeColor" value="#6366F1">
            <input type="text" id="newCustomerTypeLabel" placeholder="Nama tipe baru...">
            <button class="btn btn-outline-primary btn-sm" id="addCustomerTypeBtn">${ICONS.plus} Tambah</button>
          </div>
        </div>
        <div>
          <p class="section-title" style="font-size:14px; margin-bottom:10px;">Segmen Customer</p>
          <div id="customerSegmentList" class="status-master-list"></div>
          <div class="status-master-add">
            <input type="color" id="newCustomerSegmentColor" value="#6366F1">
            <input type="text" id="newCustomerSegmentLabel" placeholder="Nama segmen baru...">
            <button class="btn btn-outline-primary btn-sm" id="addCustomerSegmentBtn">${ICONS.plus} Tambah</button>
          </div>
          <p style="font-size:11.5px; color:var(--color-text-secondary); margin-top:8px;">Segmen bawaan (Baru/Aktif/Repeat/Tidak Aktif) terhitung otomatis dari riwayat transaksi; segmen tambahan bisa dipakai sebagai penanda manual lewat Edit Customer.</p>
        </div>
      </div>
    `;

    renderStatusMasterList("customerTypeList", customerTypesData, customerTypeOpts);
    renderStatusMasterList("customerSegmentList", customerSegmentsData, customerSegmentOpts);

    document.getElementById("addCustomerTypeBtn").addEventListener("click", () => {
      handleAddStatus(customerTypesData, "newCustomerTypeLabel", "newCustomerTypeColor", "customerTypeList", customerTypeOpts);
    });
    document.getElementById("addCustomerSegmentBtn").addEventListener("click", () => {
      handleAddStatus(customerSegmentsData, "newCustomerSegmentLabel", "newCustomerSegmentColor", "customerSegmentList", customerSegmentOpts);
    });
  }

  if (activeSettingsKey === "notifikasi") {
    const n = settingsData.notif;
    const rows = [
      ["emailInvoice", "Kirim email saat invoice dibuat"],
      ["emailJatuhTempo", "Ingatkan saya H-3 sebelum jatuh tempo"],
      ["whatsapp", "Kirim notifikasi via WhatsApp"],
      ["ringkasanMingguan", "Kirim ringkasan bisnis mingguan"],
    ];
    body.innerHTML = rows.map(([key, label]) => `
      <label class="notif-toggle-row"><span>${label}</span><input type="checkbox" data-key="${key}" class="notif-check" ${n[key] ? "checked" : ""}></label>
    `).join("") + `<button class="btn btn-primary" id="saveNotifBtn" style="margin-top:8px;">${ICONS.check} Simpan Perubahan</button>`;
    document.getElementById("saveNotifBtn").addEventListener("click", () => {
      document.querySelectorAll(".notif-check").forEach((chk) => { settingsData.notif[chk.dataset.key] = chk.checked; });
      showToast("Preferensi notifikasi disimpan");
    });
  }

  if (activeSettingsKey === "keamanan") {
    body.innerHTML = `
      <div class="form-field"><label>Kata Sandi Saat Ini</label><input type="password" id="passCurrent"></div>
      <div class="form-field"><label>Kata Sandi Baru</label><input type="password" id="passNew"></div>
      <div class="form-field"><label>Konfirmasi Kata Sandi Baru</label><input type="password" id="passConfirm"></div>
      <button class="btn btn-primary" id="savePassBtn">${ICONS.shield} Perbarui Kata Sandi</button>
    `;
    document.getElementById("savePassBtn").addEventListener("click", () => {
      const cur = document.getElementById("passCurrent").value;
      const next = document.getElementById("passNew").value;
      const confirm = document.getElementById("passConfirm").value;
      if (!cur || !next) { alert("Lengkapi kata sandi terlebih dahulu."); return; }
      if (next !== confirm) { alert("Konfirmasi kata sandi tidak cocok."); return; }
      document.getElementById("passCurrent").value = "";
      document.getElementById("passNew").value = "";
      document.getElementById("passConfirm").value = "";
      showToast("Kata sandi berhasil diperbarui");
    });
  }

  if (activeSettingsKey === "pengguna") {
    const p = settingsData.profile;
    body.innerHTML = `
      <div class="form-field"><label>Nama Lengkap</label><input type="text" id="setProfName" value="${p.name}"></div>
      <div class="form-field"><label>Email</label><input type="email" id="setProfEmail" value="${p.email}"></div>
      <div class="form-field"><label>No. Telepon</label><input type="text" id="setProfPhone" value="${p.phone}"></div>
      <button class="btn btn-primary" id="saveProfileBtn">${ICONS.check} Simpan Perubahan</button>
    `;
    document.getElementById("saveProfileBtn").addEventListener("click", () => {
      settingsData.profile = {
        name: document.getElementById("setProfName").value,
        email: document.getElementById("setProfEmail").value,
        phone: document.getElementById("setProfPhone").value,
      };
      showToast("Profil pengguna disimpan");
    });
  }
}

/* ==========================================================================
   MASTER DATA CRUD (generik) — dipakai oleh:
   - Master Status Invoice (Status Pembayaran & Status Produksi)
   - Master Customer (Segmen Customer & Tipe Customer)
   Setiap pemanggil memberi tahu lewat `opts` bagaimana cara cek "sedang dipakai",
   cara mengganti nama di data terkait, dan apa yang perlu di-refresh setelahnya.
   ========================================================================== */
function renderStatusMasterList(containerId, list, opts) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (list.length === 0) {
    el.innerHTML = `<p class="table-empty" style="padding:10px 0; text-align:left;">Belum ada ${opts.title.toLowerCase()}.</p>`;
    return;
  }
  el.innerHTML = list.map((s) => `
    <div class="status-master-row" data-id="${s.id}">
      <span class="status-color-dot" style="background:${s.color};"></span>
      <span class="status-master-label">${s.label}</span>
      <div class="status-master-actions">
        <button class="action-btn edit-status-btn" data-id="${s.id}" title="Edit">${ICONS.pencil}</button>
        <button class="action-btn delete-status-btn" data-id="${s.id}" title="Hapus">${ICONS.trash}</button>
      </div>
    </div>`).join("");

  el.querySelectorAll(".edit-status-btn").forEach((btn) => {
    btn.addEventListener("click", () => startEditStatusRow(containerId, list, opts, btn.dataset.id));
  });
  el.querySelectorAll(".delete-status-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteStatusItem(containerId, list, opts, btn.dataset.id));
  });
}

function handleAddStatus(list, labelInputId, colorInputId, containerId, opts) {
  const labelInput = document.getElementById(labelInputId);
  const colorInput = document.getElementById(colorInputId);
  const label = labelInput.value.trim();
  if (!label) { alert(`Nama ${opts.title.toLowerCase()} tidak boleh kosong.`); return; }
  if (list.some((s) => s.label.toLowerCase() === label.toLowerCase())) { alert(`${opts.title} "${label}" sudah ada.`); return; }

  list.push({ id: `${opts.idPrefix}-${Date.now()}`, label, color: colorInput.value || "#6366F1" });
  labelInput.value = "";
  renderStatusMasterList(containerId, list, opts);
  opts.afterChange();
  showToast(`${opts.title} "${label}" berhasil ditambahkan`);
}

function startEditStatusRow(containerId, list, opts, id) {
  const el = document.getElementById(containerId);
  const row = el.querySelector(`.status-master-row[data-id="${id}"]`);
  const item = list.find((s) => s.id === id);
  if (!row || !item) return;

  row.innerHTML = `
    <input type="color" class="edit-status-color" value="${item.color}">
    <input type="text" class="edit-status-label" value="${item.label}">
    <div class="status-master-actions">
      <button class="btn btn-primary btn-sm save-status-btn">Simpan</button>
      <button class="btn btn-ghost btn-sm cancel-status-btn">Batal</button>
    </div>`;

  row.querySelector(".cancel-status-btn").addEventListener("click", () => {
    renderStatusMasterList(containerId, list, opts);
  });
  row.querySelector(".save-status-btn").addEventListener("click", () => {
    const newLabel = row.querySelector(".edit-status-label").value.trim();
    const newColor = row.querySelector(".edit-status-color").value;
    if (!newLabel) { alert(`Nama ${opts.title.toLowerCase()} tidak boleh kosong.`); return; }
    const dup = list.some((s) => s.id !== id && s.label.toLowerCase() === newLabel.toLowerCase());
    if (dup) { alert(`${opts.title} "${newLabel}" sudah ada.`); return; }

    const oldLabel = item.label;
    item.label = newLabel;
    item.color = newColor;
    if (oldLabel !== newLabel) opts.onRename(oldLabel, newLabel);

    renderStatusMasterList(containerId, list, opts);
    opts.afterChange();
    showToast(`${opts.title} "${newLabel}" disimpan`);
  });
}

function deleteStatusItem(containerId, list, opts, id) {
  const item = list.find((s) => s.id === id);
  if (!item) return;

  if (list.length <= 1) { alert(`Minimal harus ada 1 ${opts.title.toLowerCase()}.`); return; }
  if (opts.isInUse(item.label)) {
    alert(opts.inUseMessage ? opts.inUseMessage(item.label) : `Tidak bisa menghapus "${item.label}" karena masih dipakai.`);
    return;
  }

  showConfirmDialog({
    message: `Hapus ${opts.title.toLowerCase()} <b>${item.label}</b>? Tindakan ini tidak bisa dibatalkan.`,
    confirmLabel: "Hapus",
    cancelLabel: "Batal",
    onConfirm: () => {
      const idx = list.findIndex((s) => s.id === id);
      list.splice(idx, 1);
      renderStatusMasterList(containerId, list, opts);
      opts.afterChange();
      showToast(`${opts.title} "${item.label}" dihapus`);
    },
  });
}

/* ---------- Master Status Invoice: opts konkret untuk kedua daftar ---------- */
function afterStatusMasterChange() {
  populateInvoiceStatusFilterOptions();
  if (document.getElementById("invoiceTableBody")) { renderInvoiceTable(); renderInvoiceStats(); }
  if (document.getElementById("dashStatGrid")) renderDashboard();
}

const paymentStatusOpts = {
  title: "Status Pembayaran",
  idPrefix: "paymentStatus",
  isInUse: (label) => invoicesData.some((inv) => inv.paymentStatus === label),
  inUseMessage: (label) => `Tidak bisa menghapus "${label}" karena masih dipakai oleh invoice yang ada. Ubah status invoice tersebut terlebih dahulu.`,
  onRename: (oldLabel, newLabel) => invoicesData.forEach((inv) => { if (inv.paymentStatus === oldLabel) inv.paymentStatus = newLabel; }),
  afterChange: afterStatusMasterChange,
};
const productionStatusOpts = {
  title: "Status Produksi",
  idPrefix: "productionStatus",
  isInUse: (label) => invoicesData.some((inv) => inv.productionStatus === label),
  inUseMessage: (label) => `Tidak bisa menghapus "${label}" karena masih dipakai oleh invoice yang ada. Ubah status invoice tersebut terlebih dahulu.`,
  onRename: (oldLabel, newLabel) => invoicesData.forEach((inv) => { if (inv.productionStatus === oldLabel) inv.productionStatus = newLabel; }),
  afterChange: afterStatusMasterChange,
};

/* ---------- Master Customer: opts konkret untuk Tipe & Segmen Customer ---------- */
function afterCustomerMasterChange() {
  populateCustomerStatusTypeFilterOptions();
  if (document.getElementById("customerTableBody")) { renderCustomerTable(); renderCustomerStats(); renderCustomerSidePanels(); }
}

const customerTypeOpts = {
  title: "Tipe Customer",
  idPrefix: "customerType",
  isInUse: (label) => customersData.some((c) => c.type === label),
  inUseMessage: (label) => `Tidak bisa menghapus "${label}" karena masih dipakai oleh customer yang ada. Ubah tipe customer tersebut terlebih dahulu.`,
  onRename: (oldLabel, newLabel) => customersData.forEach((c) => { if (c.type === oldLabel) c.type = newLabel; }),
  afterChange: afterCustomerMasterChange,
};
const customerSegmentOpts = {
  title: "Segmen Customer",
  idPrefix: "customerSegment",
  // "Dipakai" di sini berarti segmen tsb sedang jadi hasil AKTIF (baik otomatis maupun override manual)
  // untuk salah satu customer — bukan sekadar dicocokkan ke field mentah seperti status invoice.
  isInUse: (label) => customersData.some((c) => getCustomerSegment(c.name) === label),
  inUseMessage: (label) => `Tidak bisa menghapus "${label}" karena masih dipakai oleh customer yang ada. Ubah segmen customer tersebut terlebih dahulu.`,
  onRename: (oldLabel, newLabel) => customersData.forEach((c) => { if (c.segmentOverride === oldLabel) c.segmentOverride = newLabel; }),
  afterChange: afterCustomerMasterChange,
};

function initSettingsPage() {
  renderSettingsNav();
  renderSettingsPanel();
}

/* ==========================================================================
   12) INISIALISASI APLIKASI
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initSidebarCollapse();
  initDropdowns();
  initDashboardPeriodFilter();
  initInvoicePPNSetting();
  initInvoiceFilterBar();
  initInvoiceModalCloseHandlers();
  initCustomerFilterBar();
  initCustomerModal();
  initProductFilterBar();
  initProductModal();
  initSettingsPage();

  renderDashboard();
  renderInvoiceStats();
  renderInvoiceTable();
  renderCustomerStats();
  renderCustomerTable();
  renderCustomerSidePanels();
  renderProductStats();
  renderProductTable();
});

/* ==========================================================================
   CATATAN UNTUK TAHAP GOOGLE APPS SCRIPT / GOOGLE SHEETS
   ==========================================================================
   Saat siap dihubungkan ke backend:
   1. Ganti isi array customersData, productsData, invoicesData dari data
      statis di atas menjadi hasil fetch() ke Web App URL Apps Script, lalu
      panggil fungsi render terkait (mis. renderCustomerTable()) di dalam
      then()/async setelah data diterima.
   2. Setiap fungsi "save..." (saveNewInvoice, saveCustomerBtn click, dst.)
      cukup ditambahkan pemanggilan fetch(POST) ke Apps Script Web App
      sebelum/​sesudah memperbarui array lokal, agar Google Sheets ikut
      ter-update.
   3. Struktur object tiap data (id, name, status, dst.) sudah dibuat rata
      dengan penamaan kolom yang mudah dipetakan 1:1 ke header kolom Sheets.
   ========================================================================== */
