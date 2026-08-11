# LAPORAN AUDIT FRNDLY — SESI 2 (DOKUMENTASI + IMPLEMENTASI)

**Tanggal audit:** 2026-08-11
**Cakupan:** Implementasi backend (Laravel), frontend (React/Vite), dokumentasi (`docs/`, `ai/`, `revision/`), serta status tindak lanjut rekomendasi AUDIT-REPORT-2026-08-09.
**Git:** 17 commit (`7b61282` … `1fddd47`), 13 commit baru sejak audit sebelumnya.
**Kesehatan proyek:** `php artisan test` → **56 passed / 207 assertions**; `npm run build` → sukses (386 kB JS / 41 kB CSS); `oxlint` → bersih.

---

## 1. RINGKASAN STATUS REKOMENDASI AUDIT SEBELUMNYA

| Rekomendasi (AUDIT-REPORT-2026-08-09) | Status |
|------|--------|
| 1. Lengkapi `docs/11-Business-Rules.md` | ✅ **Tuntas** (102 → 725 baris, 20 kelompok aturan) |
| 2. Perbaiki header `File:` docs 05–10 + referensi silang | ✅ **Tuntas** (commit `9bc3c24`) |
| 3. Samakan enum `process`/`processing`, payment type, login, `customers.phone` | ✅ **Tuntas** (semua `processing`, `dp/final`, login email, phone non-unique) |
| 4. Reconcile daftar entity lama | ✅ **Tuntas** (catatan konseptual, final = ERD) |
| 5. Bereskan pola endpoint `06-API.md` | ⚠️ **Sebagian** — sisa drift endpoint (lihat §3.1) |
| 6. Update `README.md` (modul, SQLite→MySQL, login) | ✅ **Tuntas** |
| 7. Isi detail FR-048, production cost, repeat customer, reset invoice | ✅ **Tuntas** |
| 8. Deduplikasi judul UIUX + tambah halaman Payments/Invoices | ✅ **Tuntas** |
| 9. Update `10-Changelog.md` (status proyek & release history) | ✅ **Tuntas** (Development/MVP, roadmap 0.1–1.0) |
| 10. Isi `backend/README.md` & `frontend/README.md` | ✅ **Tuntas** |

Semua rekomendasi dokumentasi dari audit sebelumnya telah ditindaklanjuti. Fokus temuan baru kali ini berpindah ke **kualitas implementasi kode** (business rule enforcement, authorization, dan konsistensi frontend–backend).

---

## 2. TEMUAN KRITIS (harus segera ditangani)

| # | Temuan | Lokasi |
|---|--------|--------|
| K1 | **Hapus/ubah pembayaran tidak pernah menurunkan status order.** `syncOrderAfterPaymentChange()` hanya menaikkan status. Jika pembayaran dihapus/berkurang pada order `paid`, `status` tetap `paid` sedangkan `remaining_amount > 0` — data finansial tidak konsisten secara senyap. | `PaymentController.php:147-168` |
| K2 | **Pembayaran pada order lunas tidak bisa diedit.** Guard di awal `assertValidPayment()` menolak semua mutasi saat `status === 'paid' && remaining_amount <= 0`, mengabaikan `$exceptId`. Logika pengecualian di `:111-127` menjadi mati untuk kasus yang justru dirancang untuk itu (mengoreksi pembayaran salah). | `PaymentController.php:105-109` |
| K3 | **Order bisa dibuat/ditandai `paid` tanpa pembayaran apa pun.** `OrderController::store()` menerima `status`/`paid_amount`/`remaining_amount` dari klien dan `update()`/`updateStatus()` hanya melarang status mundur — lompatan maju ke `paid` diizinkan walau `remaining_amount > 0`. Akibatnya syarat "review hanya untuk order lunas" bisa dibypass (review dibuat pada order yang belum benar-benar lunas). | `OrderController.php:34-40, 136-138, 188-219`; `ReviewController.php:59-63` |
| K4 | **Tidak ada authorization & multi-tenant.** Semua endpoint hanya memakai `auth:sanctum`; tidak ada `$this->authorize()` di API controller, Policy semua mengembalikan `false` dan tidak terdaftar. Setiap user terautentikasi dapat menghapus payment/invoice/shipment/review, publish/unpublish testimonial, dan melihat/memodifikasi data **semua company** (filter `company_id` tidak ada di index). | `routes/api.php:22`; `OrderController.php:17-25`; `PaymentController.php:16-22`; `ReportController.php:233-258`; `App\Policies\*` |
| K5 | **Race condition pembayaran.** `store()`/`update()` memvalidasi sisa tagihan tanpa `lockForUpdate()` pada order — dua request bersamaan bisa sama-sama lolos dan membuat overpayment. | `PaymentController.php:39, 103-145` |
| K6 | **State machine produksi dapat dilewati.** `store()` menerima status awal apa pun (langsung `shipping`), dan `storeEvent()` menulis event tanpa mengubah status/cek transisi — event bisa kontradiktif dengan status order produksi. Produksi juga bisa dimulai dari order `draft`/belum lunas. | `ProductionController.php:29-46, 135-161`; `ShipmentController.php:49` |
| K7 | **`invoice.prefix` (dan `dp_percent`, `require_dp`) tidak dipakai.** Setting `invoice.prefix` tidak memengaruhi `CodeGeneratorService::invoiceNumber()` yang meng-hardcode `INV`; `dp_percent`/`require_dp` tidak pernah divalidasi di PaymentController. Setting dideklarasikan tapi dekoratif. | `ApplicationSettingController.php:25-32`; `CodeGeneratorService.php:11, 26-29` |
| K8 | **Report revenue menyertakan order belum lunas.** `sales()`/`profit()`/`products()` mengagregasi semua order tanpa default `status = paid`; order `draft`/`waiting_dp` menggelembungkan pendapatan/profit. | `ReportController.php:19-22, 55-61, 144-184, 253-255` |
| K9 | **Invoice: jumlah ditulis klien tanpa validasi silang; status tidak pernah sinkron.** `paid_amount` boleh melebihi `total_amount`, `outstanding_amount` bebas, tidak divalidasi terhadap `order.grand_total`/payments. Tidak ada yang mengubah `invoice.status = paid` saat order lunas. Tidak ada unique index `invoices.order_id` padahal relasi `hasOne`. | `InvoiceController.php:27-42, 88-105`; `2026_08_09_000003_create_invoices_table.php:13` |

---

## 3. TEMUAN KONSISTENSI (dokumen vs kode, frontend vs backend)

### 3.1. Drift dokumentasi vs rute aktual

| # | Dokumen menyebut | Implementasi aktual | Lokasi |
|---|------------------|---------------------|--------|
| D1 | `GET /api/v1/search` (Global Search API, §55) | **Tidak ada** — pencarian murni client-side (`searchAll`) | `docs/06-API.md:1544`; `frontend/src/lib/search.js` |
| D2 | `PUT /api/v1/settings/company` | Hanya `GET /api/v1/settings/company` (tidak ada PUT) | `docs/06-API.md:1632`; `routes/api.php:48` |
| D3 | Export report format `pdf`, `csv`, `xlsx` + contoh `?format=xlsx` | Hanya `csv` yang didukung (format lain ditolak 422) | `docs/06-API.md:1523-1535`; `ReportController.php:188-194` |
| D4 | Daftar endpoint `/api/production`, `/api/shipments`, `/api/reports` | Aktual: `/api/v1/productions`, `/orders/{order}/production`, `/orders/{order}/shipments`, `/reports/{sales\|profit\|...}` | `docs/03-Architecture.md:696-699`; `routes/api.php` |

### 3.2. Frontend vs backend

| # | Perbedaan | Frontend | Backend |
|---|-----------|----------|---------|
| C1 | **Payment type `full`** — `constants.js` & dropdown PaymentsPage menyediakan `full: 'Lunas'`, tapi validasi backend hanya menerima `dp`/`final`. Nilai `full` tidak akan pernah valid; di sisi lain test `NewModulesTest:474` meng-insert `full` langsung ke DB (artefak). | `frontend/src/lib/constants.js:184-194`; `PaymentsPage.jsx:149` | `PaymentController.php:14`; `NewModulesTest.php:474` |
| C2 | **Status order diedit bebas di frontend** — dropdown semua status di modal, backend menolak transisi mundur dan menyediakan `PATCH /orders/{id}/status` yang **tidak pernah dipakai** frontend. | `OrdersPage.jsx:527-534` | `OrderController.php:188-219`; `routes/api.php:33` |
| C3 | **Paginasi tidak sinkron** — backend `paginate(20)`, frontend mengambil halaman 1 saja dan mem-paginasi client-side atas subset 20 baris; "Halaman 2/3" tampil tapi data server halaman 2 tidak pernah dimuat. | `App.jsx:146-147`; `ui.jsx:410-446` | `OrderController.php:23`, `CustomerController.php:17`, dst. |
| C4 | **Bentuk angka tidak konsisten** — resource endpoints mengembalikan uang sebagai string (`decimal:2`), report endpoints sebagai float. | `Order.php:22-27` | `ReportController.php:30-33, 66-71` |
| C5 | **Semantik event tidak seragam** — `ShipmentController::storeEvent()` memperbarui status+timestamp, `ProductionController::storeEvent()` hanya menulis event. Bentuk response "one-per-order" juga beda: produksi → objek/null, review → array. | `ProductionController.php:150-155` | `ShipmentController.php:157-167`; `ReviewController.php:24-32` |

### 3.3. Code smells

| # | Temuan | Lokasi |
|---|--------|--------|
| N1 | **Kredensial demo di-hardcode di LoginPage** (`admin@frndly.test`/`password123`) dan terisi otomatis di form + hint publik. | `LoginPage.jsx:8, 93` |
| N2 | **`networkFailures >= 2` → token dihapus & logout otomatis** saat API tak merespons (blip jaringan singkat bisa menghancurkan sesi); counter tak pernah reset pada 401. | `api.js:7-14, 41-48` |
| N3 | **`loadAll()` memakai `Promise.all`** 11 request — satu kegagalan non-401 membuat seluruh app menampilkan ErrorBanner tanpa render parsial. | `App.jsx:190-198` |
| N4 | **`JSON.parse(localStorage.getItem(...))` tanpa try/catch** di tiap render — nilai korup mem-crash halaman. | `OrdersPage.jsx:158` |
| N5 | **Dead code berbahaya**: controller non-Api (`app/Http/Controllers/*`) + FormRequest dengan `authorize() = false` + Policy semua `false`. Tidak dirutekan hari ini, tapi menjadi "landmine" — mengaktifkan policy discovery atau memakai FormRequest akan mengunci seluruh API. | `backend/app/Http/Controllers/*.php`; `StorePaymentRequest.php:13-16`; `App\Policies\*` |
| N6 | **CSV export rentan formula injection** — nilai baris ditulis verbatim; nilai berawalan `=`,`+`,`-`,`@` berisiko. | `ReportController.php:219-221` |
| N7 | **`destroy()` shipment/order tanpa pembatasan status** — shipment `delivered` tetap bisa dihapus; cascade delete order menghapus payments/invoice/review/production sekaligus tanpa soft delete. | `ShipmentController.php:182-194`; `OrderController.php:221-229`; migrasi `cascadeOnDelete` |
| N8 | **N+1 & beban memori**: `products()` memanggil `Product::find()` per grup; `customers()` memuat semua order; `recentActivities()` 6 query per load dashboard. | `ReportController.php:108, 153`; `DashboardController.php:80-130` |

---

## 4. TEMUAN POSITIF (verifikasi yang lolos)

- **Suit test kuat**: 56 test / 207 assertion hijau — status order tidak bisa mundur, DP sekali, final-setelah-DP, overpayment ditolak, counter invoice reset harian + concurrency-safe (`lockForUpdate`), review hanya untuk order lunas, shipment tidak bisa dibatalkan setelah dikirim, report & settings & period dashboard teruji.
- **Enforcement transisi status** benar-benar diterapkan untuk order/produksi/shipment dan teruji.
- **Generator kode concurrency-safe** (`CodeGeneratorService::next()`) — di-lock dalam transaksi DB, dipakai untuk order/customer/product/invoice.
- **Eager loading** konsisten di seluruh list/show endpoint (tidak ada N+1 di list utama).
- **Scope shipment terhadap order** benar (404 saat shipment bukan milik order).
- **Frontend**: build produksi sukses, `oxlint` bersih, design system modern (13 halaman), keyboard navigation, a11y combobox/menu, tema light/dark, global search fungsional.
- **Dokumentasi**: seluruh rekomendasi audit sebelumnya selesai; `10-Changelog.md` kini mencatat release history 0.1.0–0.3.1 dan CURRENT PROJECT STATUS; README backend/frontend terisi.

---

## 5. REKOMENDASI (urut prioritas)

1. **Perbaiki sinkronisasi status order↔pembayaran** (K1, K2): `syncOrderAfterPaymentChange()` harus menurunkan status ke `dp_received`/`waiting_dp` saat sisa tagihan positif; izinkan edit/hapus pembayaran pada order lunas dengan pengecualian `$exceptId`.
2. **Jangan izinkan order `paid` tanpa pembayaran** (K3): hapus penerimaan `status`/`paid_amount`/`remaining_amount` dari klien saat create; transisi `paid` harus diverifikasi `remaining_amount <= 0`.
3. **Tambahkan authorization & multi-tenant** (K4): scope query per `company_id` + Gate/Permission (atau soft-delete) sebelum release.
4. **Kunci order saat menulis pembayaran** (K5): `lockForUpdate()` pada `Order` di dalam transaksi.
5. **Tegakkan state machine produksi** (K6): `store()` mulai dari `design`; `storeEvent()` harus mengubah status & memeriksa transisi; larang produksi untuk order bukan `dp_received`/`processing`.
6. **Hubungkan settings ke business logic** (K7): pakai `invoice.prefix` di `CodeGeneratorService`, validasi `dp_percent`/`require_dp` di PaymentController, atau hapus dari deklarasi.
7. **Reports: filter status paid** (K8) + **sanitasi CSV** (N6) + hapus N+1 (`products()`, `customers()`).
8. **Invoice: validasi silang** jumlah vs `order.grand_total`, unik `order_id`, dan sinkronkan `invoice.status` saat order lunas (K9).
9. **Selaraskan frontend–backend** (C1–C3): hapus `full` dari dropdown payment; gunakan `PATCH /orders/{id}/status`; implementasikan server pagination.
10. **Bersihkan dead code & sekuriti frontend** (N1–N5): jangan hardcode kredensial; reset `networkFailures`; render parsial `loadAll`; try/catch localStorage; hapus controller/FormRequest/Policy yang tidak dipakai.
11. **Perbarui dokumen** (D1–D4): hapus/koreksi `GET /api/v1/search`, `PUT /settings/company`, format export `pdf`/`xlsx`, dan daftar endpoint di `03-Architecture.md` agar sesuai rute aktual.

---

## 6. MATRIKS CAKUPAN MODUL (implementasi vs dokumentasi)

| Modul | Backend | Frontend | Docs | Test |
|-------|:-------:|:--------:|:----:|:----:|
| Auth | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Customers | ✅ | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ✅ | ✅ |
| Payments | ✅ | ✅ | ✅ | ✅ |
| Invoices (+PDF) | ✅ | ✅ | ✅ | ✅ |
| Production | ✅ | ✅ | ✅ | ✅ |
| Shipping | ✅ | ✅ | ✅ | ✅ |
| Reviews | ✅ | ✅ | ✅ | ✅ |
| Testimonials | ✅ | ✅ | ✅ | ✅ |
| Reports (+CSV) | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ✅ | ✅ |

---

# END OF AUDIT REPORT

**FRNDLY — Business Management System**
**Sesi audit:** 2026-08-11 (dokumentasi + implementasi)
