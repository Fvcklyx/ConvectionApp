# FRNDLY — CURRENT SESSION STATE

> Shared working memory for all AI models working through OpenCode/9Router.
>
> IMPORTANT:
> This file contains project state, decisions, progress, and handoff
> information. It must NOT contain hidden chain-of-thought.

---

## Current Phase

COMPLETE

Possible values:

- IDLE
- EXPLORATION
- PLANNING
- IMPLEMENTATION
- TESTING
- REVIEW
- BLOCKED
- COMPLETE

---

## Current Task

Audit menyeluruh implementasi FRNDLY terhadap dokumentasi proyek, lanjutkan
perubahan yang sudah ada, dan terapkan gap terkonfirmasi yang aman tanpa
perubahan schema atau keputusan bisnis baru.

---

## Objective

1. Pastikan seluruh modul yang sudah direalisasikan dapat dimuat dan diuji.
2. Tutup gap keamanan/data pada profil publik landing page.
3. Lengkapi SEO dan aksesibilitas target interaksi.
4. Pertahankan seluruh perubahan kerja sebelumnya.

---

## Completed

### Audit implementasi menyeluruh (2026-09-02)
- Seluruh source aplikasi, route, migration, model, controller, komponen frontend,
  test, dan dokumentasi proyek diinventaris; dokumentasi dependency dikecualikan
  sebagai spesifikasi pihak ketiga.
- Browser QA memuat landing page, login, Dashboard, Customers, Products, Orders,
  Payments, Invoices, Production, Shipping, Reviews, Testimonials, Reports, dan
  Settings tanpa alert/error aplikasi.
- `ApplicationSettingController::publicProfile` sekarang membatasi product,
  review, dan testimonial ke company aktif; ID relasi internal tidak lagi
  diekspos pada payload publik.
- Bug field testimonial publik diperbaiki dari field tidak valid `content` ke
  field schema yang benar, `quote`; frontend landing memakai `quote`.
- Review publik sekarang menyertakan nama customer dari relasi yang sudah
  dipublikasikan.
- Metadata description, theme color, Open Graph, dan Twitter card ditambahkan.
- Seluruh target interaksi landing dan application shell minimum 44px.
- Overflow horizontal shell pada viewport mobile diperbaiki dengan flex sizing
  topbar/search yang eksplisit.
- Regression test public profile multi-company + testimonial quote ditambahkan.

### Sinkronisasi image (sesi sebelumnya, dilanjutkan)
- `frontend/src/App.jsx`: `loadAll()` kini juga fetch `/auth/me` dan memanggil
  `onUserUpdate(user)` sehingga `user` tidak lagi `null` setelah refresh halaman.
- Backend `ApplicationSettingController`: `uploadLogo`/`deleteLogo` mengembalikan
  `$company->fresh()` agar `logo_url` pada response tidak basi.

### Performa loading dashboard
- ROOT CAUSE: `handleLogout` di `App` tidak stabil (recreated tiap render).
  Karena `loadAll` bergantung pada `onLogout`, setiap re-render `App` (misalnya
  setelah `setUser` dari `/auth/me`) membuat `useEffect([loadAll])` menembak ulang
  SELURUH 13 request + skeleton flash. Data dimuat dua kali di setiap refresh.
- Fix: `handleLogin`/`handleUserUpdate`/`handleLogout` kini `useCallback` stabil.
- Dashboard fetch digabung ke `Promise.all` di `loadAll` (satu batch paralel);
  `loadDashboard` hanya berjalan saat `period` berubah (guard `initialLoadDone`
  ref), tidak lagi dobel saat mount.
- `periodRef` ditambahkan agar retry (`ErrorBanner`) memakai periode terkini.
- Backend `InvoiceController@pdf`: 4 query `ApplicationSetting` digabung jadi
  1 query `whereIn`.
- Backend `ProductController@index`: eager-load `company` yang tak terpakai dihapus.

### Test suite backend: 22/71 → 71/71 PASS
- `app/Traits/ScopesByCompany.php` (ROOT CAUSE utama): early-return
  `if ($request->user()) return null;` membuat fallback "company aktif tunggal"
  tidak terjangkau bagi semua user terautentikasi tanpa `company_id` — akibatnya
  index list kosong dan create resource gagal 500 (NOT NULL company_id).
  Block tersebut dihapus sesuai docblock trait; fallback aktif untuk semua user
  tanpa pemetaan company. (44 test pulih)
- `PaymentController::syncOrderAfterPaymentChange`: invoice kini disinkronkan
  pada SETIAP perubahan pembayaran (sebelumnya pembayaran parsial tidak
  menyentuh invoice). Dua method sync identik digabung jadi `syncInvoicesFromOrder`.
- `InvoiceController@store`: `paid_amount` opsional dari klien (divalidasi
  terhadap total); jika absen diturunkan dari pembayaran order. Guard baru:
  invoice tidak bisa lahir lunas (`paid >= total`) bila pembayaran aktual order
  kurang dari total. `status` tetap prohibited (selalu derived). `update()`
  tidak lagi menolak field terlarang secara eksplisit (nilai tetap derived).
- `ShipmentController@store`: order status `waiting_dp` kini diizinkan membuat
  shipment (sesuai test spec); pesan error diperbarui.
- `DashboardController::recentActivities(?Request $request = null)` menerima
  `$request` dari caller (tidak lagi bergantung global helper).

---

## Current Implementation

Stack: React 19 + Vite 8 + Motion + React Three Fiber; Laravel 13 + Sanctum.

Alur data awal AppShell:
- Satu batch paralel: 9 koleksi + `/settings` + `/settings/company` +
  `/auth/me` + `/dashboard?period=periodRef.current`.
- Semua callback yang menjadi dependency effect (`loadCollection`,
  `onUserUpdate`, `onLogout`) stabil via `useCallback([], ...)`.

---

## Important Decisions

- Perubahan aturan bisnis invoice/shipment mengikuti test suite proyek sendiri
  (executable spec): paid_amount opsional tapi guarded, waiting_dp boleh kirim.
- Multi-tenant fallback mengikuti docblock trait: user tanpa company_id
  memakai company aktif tunggal (MVP single-company).
- Tidak ada dependency baru, tidak ada migrasi DB.

---

## Files Modified

- `frontend/src/App.jsx`
- `backend/app/Http/Controllers/Api/ApplicationSettingController.php`
- `backend/app/Http/Controllers/Api/DashboardController.php`
- `backend/app/Http/Controllers/Api/InvoiceController.php`
- `backend/app/Http/Controllers/Api/PaymentController.php`
- `backend/app/Http/Controllers/Api/ProductController.php`
- `backend/app/Http/Controllers/Api/ShipmentController.php`
- `backend/app/Traits/ScopesByCompany.php`
- `backend/tests/Feature/NewModulesTest.php`
- `frontend/index.html`
- `frontend/src/index.css`

(Sesi landing page sebelumnya: `frontend/src/components/pages/LandingPage.jsx`,
`frontend/src/landing.css`, `frontend/src/components/landing/CinematicWorld.jsx`)

---

## Files That Must Not Be Modified

- Seluruh file `.md` di `revision/`, `ai/`, `docs/`, dan root (governance v4).
- `frontend/src/components/landing/InteractiveCanvas.jsx` (dipertahankan).

---

## Dependencies

Tidak ada dependency baru.

---

## Known Issues

- Chunk `CinematicWorld-*.js` ~888 kB (gzip 236 kB) — sudah lazy-load.
- React Three Fiber/Three.js mengeluarkan warning deprecation internal untuk
  `THREE.Clock` dan `PCFSoftShadowMap`; tidak ada runtime error.
- Reference video v4 (`WhatsApp Video 2026-08-12 at 22.52.14.mp4`) tidak ditemukan
  di project, sehingga parity visual terhadap video tidak dapat diklaim.
- README masih menyebut akun demo `admin@frndly.test/password123`, sedangkan
  seeder aktif memakai `pasarwebbusiness@gmail.com/pasarweb123`. Dokumen tidak
  diubah karena governance v4 melindungi file `.md`.

---

## Remaining Work

- Fitur konseptual yang belum direalisasikan penuh (attachment/versioning,
  pricing history, backup, universal activity/audit trail, autosave draft,
  reminder/activity center, serta export PDF/Excel) membutuhkan keputusan scope
  dan persetujuan perubahan schema; tidak diimplementasikan secara spekulatif.
- QA upload/ganti/hapus avatar dan logo dengan file nyata belum dilakukan karena
  akan mengubah data/storage lokal pengguna.
- Visual comparison terhadap reference video menunggu asset referensi tersedia.

---

## Verification

- `npm run lint` (frontend) → PASS, 0 error.
- `npm run build` (frontend) → PASS; warning chunk 3D >500 kB tetap tercatat.
- `composer validate --no-check-publish` → PASS.
- `php -l` file PHP baru/diubah → PASS.
- `php artisan test` → **72 passed, 0 failed, 267 assertions**.
- `php artisan route:list --path=api/v1 --except-vendor` → 78 routes terdaftar.
- Browser QA desktop + 375x812 + 812x375 → tidak ada horizontal overflow,
  broken image, target interaksi <44px, atau console runtime error aplikasi.

---

## Next Recommended Action

Project Owner menentukan prioritas untuk fitur konseptual yang membutuhkan
schema baru. Setelah itu buat task/migration proposal per fitur; jangan mencoba
menerapkan seluruh roadmap dalam satu perubahan tanpa keputusan data model.
