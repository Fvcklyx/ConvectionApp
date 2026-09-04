# FRNDLY — CURRENT SESSION STATE

> Shared working memory for all AI models working through OpenCode/9Router.
>
> IMPORTANT:
> This file contains project state, decisions, progress, and handoff
> information. It must NOT contain hidden chain-of-thought.

---

## Latest revision — 2026-09-04: sticky navigation and product images

### Dashboard navigation loading removal — 2026-09-05

- User reported per-menu loaders preventing navigation. Dashboard page components now use static imports rather than suspending the root App boundary on first menu visit.
- Removed full-screen AppLoading from AppShell, Reports and Settings. Sidebar/header remain mounted during initial dashboard data fetch; Settings uses a local text status and Reports retains its existing inline data placeholder. Startup/auth/landing/customer loaders unchanged.
- Changed App.jsx, ReportsPage.jsx, SettingsPage.jsx and added dashboard-loading.test.js. Frontend lint/build passed; 9 tests passed including guard against dashboard lazy imports/full-screen loaders. No backend/business data changes.
- Browser verified real demo-admin navigation Dashboard → Reports → Settings → Products, including leaving Settings while its request was pending. Sidebar remained usable and Products table rendered without full-screen overlay. Local frontend/backend servers restarted for verification; no business records edited.

### Portal GSM and account navigation polish — 2026-09-04

- Customer name is now an accessible profile button with active/focus states and a profile hint. Removed duplicate profile tab; catalog/orders/engagement remain primary navigation.
- Profile uses account and contact/address fieldsets, bounded content width, clear read-only fields and aligned save action. Mobile account controls stay in one row; form fields and spacing adapt to small screens.
- Bundled Poppins Latin 400–800 locally using @fontsource/poppins, replacing the external Google Fonts stylesheet. Portal typography including controls explicitly inherits GSM Poppins. Fixture imports same fonts; no business API or database changes.
- UI/UX skill used for GSM-preserving layout, navigation and responsive checks. Frontend lint/build and 8 tests passed. Browser verified name click opens profile, computed text font family consistently Poppins, 375px light and 768px dark layouts, no console errors. Theme and viewport restored. Changed CustomerPortal.jsx, storefront.css, fonts.css, index.html, package manifests and portal fixture.

### Portal extension — 2026-09-04 (newest implementation)

- User approved persistent private drafts, submission into admin dashboard, edit/delete only before admin confirmation, and wa.me (manual send, no Business API).
- Added owned customer profiles (`customers.user_id`, unique), automatic code on first profile save, server-scoped PortalController and portal_drafts with optimistic versions and transactional submission. Scoped migration `2026_09_04_000002_create_customer_portal.php` applied locally without reset/seed.
- Draft prices are calculated server-side; unavailable/foreign products and stale prices are rejected. Submission retries return the same order. Confirmed orders or orders with payments/invoices/production/shipment/review cannot be edited/deleted by customer. Admin order mutation now locks the order row.
- Portal shows own drafts and admin-created orders belonging to the explicitly linked customer. Issued/paid own invoices downloadable through reused InvoicePdfService. Reviews require own paid order; reviews and linked testimonials await admin moderation.
- No automatic ownership claim through matching email. Existing legacy Customers/orders need verified account linking before becoming visible; no linking UI was added. Customer deletion rejects existing portal drafts.
- Portal UI now has catalog, orders, profile and engagement tabs, multi-product draft editor, confirmations and encoded WhatsApp template. Dashboard received minor token-based styling; route modules are lazy-loaded behind shared request-driven sewing-shirt loader; Settings/Reports use same data loader. Top landing announcement and obsolete portal simulation banner removed; titles/errors retained.
- UI/UX project skill guided existing GSM reuse, responsive forms and confirmation/error states.
- Verification: backend **92 tests / 423 assertions PASS**; frontend **8 tests PASS**, lint and production build PASS. Browser isolated in-memory fixture verified edit/save, submit-to-order display, profile save, review/testimonial moderation, encoded WA link; no real API writes or WhatsApp sends. Checked 375px mobile dark profile, 768px tablet orders, 812px landscape editor: no horizontal overflow. No browser runtime errors observed. Full live-account end-to-end workflow was not performed.
- QA fixture `frontend/tests/portal.html` is dev-only (not included in production build); adapter handles all requests in memory. Vite started locally on 127.0.0.1:5173. Original theme restored after QA.
- Backend local server started on 127.0.0.1:8000; public profile health check returned HTTP 200. Real login page completed shared loader and rendered without observed runtime errors. Final lint/build and git diff whitespace check passed.

### Earlier revision

- Landing navbar is sticky with anchor offsets and bounded mobile menu. Copyright is a separate bottom row: `Copyright © [current year] [business.company_name]. All Rights Reserved.` Business name comes from Dashboard Settings/public profile, not hardcoded.
- Product create/edit forms support optional JPEG/PNG/WebP upload, local preview and 10 MiB validation. Multipart POST with `_method=PUT` supports Laravel updates; upload timeout is 120 seconds.
- Added nullable `products.image_path` through scoped migration `2026_09_04_000001_add_image_path_to_products_table.php`, applied to local database without reset or seed. Existing products remain unchanged.
- Backend validates type, size and image dimensions; stores randomized names on public disk, exposes only `image_url`, preserves old image when no replacement is sent or validation fails, and cleans replaced images after successful save. Existing admin/company authorization remains enforced.
- Landing catalog uses product photos with lazy loading; absent or broken photos fall back to the existing cardboard icon for every category. GSM/dashboard styling retained.
- Verification: backend 83 tests / 352 assertions passed, including five new ProductImageTest cases (size boundary, invalid content, replacement/preservation, dynamic business name, authorization). Frontend lint/build and 3 tests passed. Browser verified sticky nav and visible catalog heading at 375px, tablet layout, upload preview and add/edit fields without saving user products; no user data was created/deleted during browser QA.

## Latest revision — 2026-09-04: request-driven startup animation

- Added shared `frontend/src/components/AppLoading.jsx` and `frontend/public/boot-loader.css`: animated SVG garment seam, business name, status text, retry state, responsive landscape/mobile layout and reduced-motion CSS. GSM/Poppins and light/dark semantic tokens preserved.
- `frontend/index.html` renders matching loader before the JS bundle runs, reads the saved theme before first render, and offers reload on module/startup failure. Safe text-only business-name cache is refreshed from existing profile/settings responses; no extra endpoint or backend change.
- Loader lifetime follows actual auth, lazy-module, dashboard collections, storefront profile and customer/login data requests. No minimum display duration, fake percentages or completion timers. Below-fold product images remain lazy-loaded and do not block entry.
- Storefront stays mounted behind an inert/ARIA-hidden loading screen to preserve motion refs; scroll is locked while loader exists. On catalog failure, animation stops and retry issues a real new request. Login branding failure retains the existing usable fallback form behavior.
- Verification: frontend lint/build pass; 7 tests pass (including brand-cache safety, boot/React artwork parity, no loader timers and pre-render light/dark/system/storage-failure cases). Dev-only `frontend/tests/loading.html` harness uses explicitly resolved/rejected promises, no real API writes, and is excluded from production build. Browser verified pending→ready, pending→error→retry→ready, light/dark, 375px mobile and 812x375 landscape. Actual landing and authenticated dashboard loaded with no console errors/warnings. Reduced motion verified in source, not OS-emulated; physical devices not tested.
- No business data, schema, authentication permissions or existing backend rules changed in this revision.

## Latest revision — customer portal storefront styling

- Portal customer (not admin Customers menu) now shares landing product artwork via `frontend/src/components/ProductArtwork.jsx`: lazy uploaded image, contain sizing, cardboard fallback on absent/broken image. Storefront imports the same component.
- CustomerPortal header uses landing brand treatment, home link and shared ThemeToggle. Catalog uses landing card/grid/category/price/button styling; portal hero and navigation use GSM tokens and rounded styling. Scoped styles added to storefront.css; admin dashboard styling unchanged.
- Removed display-only invented fallback price Rp65,000 and unsupported catalog minimum-order marketing claim; unavailable price now says Konsultasikan harga. Existing draft flow, quantity validation and temporary-only warning retained.
- Verification: frontend build and 7 existing tests pass; lint cleaned. Browser checked customer catalog at 375px and 768px (no horizontal overflow), light/dark cards, opening and cancelling order modal; no customer records or drafts created. Image rendering reuses the already-tested landing implementation. No backend/schema changes.

## Current Phase

### 2026-09-04 — Freshmarket-inspired storefront and shared GSM theme

- User-approved scope: retain original blue/Poppins ConvectionApp GSM and dashboard/backend; use Freshmarket only for landing composition and rounded/split-panel presentation.
- Read Freshmarket root login and Dashboard HTML/CSS as references only. No reference files or backend files modified in this design turn.
- Added StorefrontPage and storefront.css: two-column apparel hero, bounded parallax with reduced-motion fallback, benefits, API-backed catalog with search/category filters, process, published testimonials, FAQ, and actual business contact information. Original cinematic components remain on disk but are no longer the landing entry point.
- Added original local SVG apparel illustration (explicitly labeled illustration) and reused installed Lucide icons. No new dependencies or third-party scripts. Google Fonts Poppins remains the existing font source with system fallbacks.
- Login/register now use a responsive Freshmarket-inspired split panel; all form/button typography inherits Poppins, inputs/touch targets enlarged. Added shared theme toggle to landing and authentication.
- ThemeContext synchronizes local preference across routes, reloads, and tabs. Dashboard initialization no longer overrides the shared theme with saved business settings; explicitly saving theme settings still updates the shared current theme. Frontend session state also responds to cross-tab logout/account changes.
- Public landing is now accessible while signed in, with a Buka aplikasi link to /app. Existing authenticated dashboard/customer role routing remains enforced.
- Customer portal header/tab layout wraps on mobile; fixed confirmed 391px overflow at a 375px viewport. No order creation or database writes were used in UI testing beyond ordinary authentication sessions.
- Verification: lint/build clean; frontend 3 tests pass; backend 78 tests / 311 assertions pass. Landing checked at 375/768/1024/1440, login at 375/768/812 landscape/1440, register at 375/768; all 12 dashboard menus checked at 375/768/1024; customer catalog at 375/768/812 landscape/1440 and modal at 375/768. No horizontal overflow after fixes. Poppins computed font confirmed on login controls. Browser-tested search, mobile menu, light-to-login-to-dashboard, dashboard-dark-to-landing, cross-tab theme, cross-tab logout, and customer draft/modal cancellation. No runtime errors in checked pages.
- Limits: responsive desktop-browser emulation, not physical iOS/Android tests. Reduced-motion fallback inspected in source, not OS-emulated. Existing customer orders remain local drafts, not backend transactions. Security regression tests pass but do not constitute a complete penetration test; existing demo passwords and production hosting hardening remain deployment prerequisites.


### 2026-09-04 — Blank-screen and security repair

- Reproduced browser crash: StaticLanding received a module object instead of a React component from lottie-react. Selected its ESM entry and expression-free Lottie player; verified landing in development and production preview.
- Added root render-error recovery, safe theme storage, stable theme updates, authentication retry on transient outages, and session guard for both roles.
- Operational APIs now require admin; BasePolicy also denies non-admin access. Public registration cannot grant admin access. Customer catalog uses the public profile endpoint.
- Removed automatically injected fake customer orders and cross-account sessionStorage order data usage. Portal now explicitly labels its in-memory drafts as not submitted. Real customer order persistence/tracking still needs an ownership model and API design; no business records or existing local storage were deleted.
- Fixed client collection loading to fetch all paginated server batches. Added frontend pagination regression tests.
- Refresh extends the current token rather than accumulating tokens. Registration minimum password is 12 characters. Added settings type/allowlist validation, safe upload replacement order, unambiguous company fallback, and production demo-seeding guard.
- Updated league/commonmark 2.9.0 to 2.10.0 and nette/schema 1.3.5 to 1.3.6 after four high-severity dependency advisories. Composer and npm audits subsequently reported no known advisories.
- Verification: 78 backend tests / 311 assertions passed; 3 frontend tests passed; 109 first-party PHP files syntax-checked; 8 JSON/lock/config assets parsed; lint and production build passed without warnings. Browser smoke-tested admin dashboard + 11 menus, customer login/catalog, logout, and production landing.
- Remaining limits: no guarantee of zero vulnerabilities; this is not a complete penetration test or implementation of every aspirational Markdown requirement. Existing demo account passwords were not changed. Before public deployment rotate those credentials, verify HTTPS/debug/CORS/private-file/backup configuration, and complete the customer-order feature deliberately.
- Preserved all pre-existing dirty edits. No migrations, reseeding, business-data deletion, or commits performed.


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

### Fix Image Storage, 3D Cinematic Scene Engine v4, & Customer Portal (2026-09-03)
- Windows Laragon storage symlink: Dibuat directory junction `backend/public/storage <===> backend/storage/app/public` sehingga seluruh file logo dan avatar yang tersimpan di disk `public` dapat langsung diakses via web browser dan endpoint Vite proxy tanpa error 404.
- 3D Cinematic World Engine (Master Revision v4 & GSM):
  - Mengimplementasikan bingkai portal fisik (`PhysicalPortalFrame`) dengan refleksi workbench dan boundary boundary depth.
  - Multi-stage visual storytelling: Kain mentah (`StageFabricRaw`), laser cutting pattern (`StagePatternCutting`), screen printing frame, dan baju 3D dinamis (`Garment3D`) dengan efek breakout forward (+Z) yang menembus frame.
  - Interaksi rotasi kursor mouse tilt, momentum spin drag, dan camera damping mengikuti scroll timeline.
  - Penyesuaian token GSM (`--color-primary`: `#2563eb`, `--color-accent`: `#0ea5e9`, surface dark contrast, Poppins font).
- Auth & Dual-Role Routing:
  - Backend `AuthController`: Tambah route `/auth/register` untuk customer, serta menyertakan `is_admin` pada payload user autentikasi.
  - Frontend `LoginPage.jsx`: Didesain ulang dengan tab selector ("Masuk" vs "Daftar Akun"), input validasi, tombol navigasi kembali ke Beranda, dan quick-fill demo Admin (`admin@frndly.test`) & Customer (`customer@frndly.test`).
  - Frontend `App.jsx`: Dual-role router otomatis mengarahkan admin ke `AppShell` (Dashboard Control Center), dan customer ke `CustomerPortal`.
- Customer Marketplace & Tracking Portal (`CustomerPortal.jsx`):
  - Katalog produk konveksi interaktif terhubung dengan API backend `/products` dan `/company/profile`.
  - Formulir pemesanan custom (kalkulasi subtotal, estimasi DP 50%, spesifikasi custom desain).
  - Pelacak progres pesanan berbasis 5-stage status (`Draft` -> `Menunggu DP` -> `DP Masuk` -> `Proses Produksi` -> `Lunas / Selesai`) dengan konfirmasi WhatsApp langsung.

### Fix bug upload/ganti foto profile bisnis & admin (2026-09-03)
- Frontend `SettingsPage.jsx`: Tambah `validateFile()` helper untuk validasi
  client-side tipe file (JPEG/PNG/WebP) dan ukuran (maks 2MB) sebelum
  dikirim ke backend; pesan error spesifik ditampilkan via toast.
- Frontend `SettingsPage.jsx`: Setelah upload/hapus avatar, `profile` state
  lokal di-merge dengan data user dari response agar field name/email/phone
  tidak hilang dari state lokal; `onUserUpdated` menerima user payload
  lengkap sehingga parent state (Sidebar/Header) sinkron.
- Backend `AuthController::updateAvatar`: Buat direktori `avatars` secara
  otomatis via `Storage::disk('public')->makeDirectory()` jika belum ada
  sebelum `->store()`, mencegah error penyimpanan pada fresh install.
- Backend `ApplicationSettingController::uploadLogo`: Buat direktori `logos`
  secara otomatis jika belum ada sebelum `->store()`.
- Backend `ApplicationSettingController::deleteLogo`: Ganti `$company` dengan
  `$company->fresh()` pada response agar `logo_url` selalu mencerminkan
  state database terkini (konsisten dengan `uploadLogo`).

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
- `backend/app/Http/Controllers/Api/AuthController.php`
- `backend/app/Http/Controllers/Api/DashboardController.php`
- `backend/app/Http/Controllers/Api/InvoiceController.php`
- `backend/app/Http/Controllers/Api/PaymentController.php`
- `backend/app/Http/Controllers/Api/ProductController.php`
- `backend/app/Http/Controllers/Api/ShipmentController.php`
- `backend/app/Traits/ScopesByCompany.php`
- `backend/tests/Feature/NewModulesTest.php`
- `frontend/index.html`
- `frontend/src/index.css`
- `frontend/src/components/pages/SettingsPage.jsx`

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
- QA upload/ganti/hapus avatar dan logo dengan file nyata tetap disarankan
  untuk memastikan storage symlink (`php artisan storage:link`) aktif dan
  direktori `avatars/`/`logos/` dapat ditulis oleh web server.
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
