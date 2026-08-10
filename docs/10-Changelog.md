# FRNDLY — CHANGELOG

**Project:** FRNDLY
**Document:** Changelog
**File:** `docs/10-Changelog.md`
**Version:** 1.0.0
**Status:** Active
**Format:** Keep a Changelog
**Language:** Bahasa Indonesia

---

# 1. TUJUAN

`docs/10-Changelog.md` digunakan untuk mencatat seluruh perubahan penting pada aplikasi FRNDLY.

Dokumen ini menjadi sumber historis untuk mengetahui:

* fitur yang ditambahkan
* fitur yang diubah
* bug yang diperbaiki
* fitur yang dihapus
* perubahan database
* perubahan API
* perubahan UI/UX
* perubahan security
* perubahan arsitektur
* perubahan dokumentasi
* breaking changes

---

# 2. PRINSIP CHANGELOG

Setiap perubahan penting harus dapat dilacak.

Gunakan prinsip:

```text
Code Change
    ↓
Reason
    ↓
Impact
    ↓
Version
    ↓
Changelog
```

Changelog bukan tempat menyimpan commit setiap baris kode.

Changelog hanya mencatat perubahan yang memiliki dampak terhadap:

* sistem
* fitur
* data
* user
* developer
* deployment
* security

---

# 3. FORMAT CHANGELOG

FRNDLY menggunakan kategori:

```text
Added
Changed
Deprecated
Removed
Fixed
Security
Database
API
Documentation
Breaking
```

---

# 4. DEFINISI KATEGORI

## Added

Fitur baru.

Contoh:

```text
Added customer management.
Added invoice generation.
Added review system.
```

---

## Changed

Perubahan pada fitur yang sudah ada.

Contoh:

```text
Changed dashboard layout.
Changed invoice template.
Changed order status workflow.
```

---

## Deprecated

Fitur yang masih tersedia tetapi akan dihentikan.

Contoh:

```text
Deprecated old invoice template.
```

---

## Removed

Fitur yang benar-benar dihapus.

Contoh:

```text
Removed unused product field.
```

---

## Fixed

Perbaikan bug.

Contoh:

```text
Fixed incorrect order total calculation.
```

---

## Security

Perubahan yang berkaitan dengan keamanan.

Contoh:

```text
Fixed unauthorized invoice access.
```

---

## Database

Perubahan database.

Contoh:

```text
Added order_items table.
Added index to customers.phone.
```

---

## API

Perubahan API.

Contoh:

```text
Added GET /api/orders.
Changed order response structure.
```

---

## Documentation

Perubahan dokumentasi.

Contoh:

```text
Updated ERD documentation.
Updated API specification.
```

---

## Breaking

Perubahan yang dapat menyebabkan fitur existing tidak bekerja.

Contoh:

```text
Changed API response structure.
Renamed database column.
Removed deprecated endpoint.
```

---

# 5. VERSIONING

FRNDLY menggunakan Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Contoh:

```text
1.0.0
1.1.0
1.1.1
2.0.0
```

---

# 6. MAJOR VERSION

Naik ketika terdapat breaking change besar.

Contoh:

```text
1.x.x
↓
2.0.0
```

Contoh perubahan:

* perubahan arsitektur besar
* perubahan database besar
* API breaking change
* perubahan authentication system
* migrasi framework besar

---

# 7. MINOR VERSION

Naik ketika terdapat fitur baru yang backward compatible.

Contoh:

```text
1.2.0
```

Contoh:

* fitur review
* fitur shipping
* fitur export
* fitur activity center

---

# 8. PATCH VERSION

Naik ketika terdapat bug fix atau perubahan kecil.

Contoh:

```text
1.2.1
```

Contoh:

* fix invoice alignment
* fix search bug
* fix validation message
* security patch kecil

---

# 9. DEVELOPMENT VERSION

Selama development dapat menggunakan:

```text
0.x.x
```

Contoh:

```text
0.1.0
0.2.0
0.3.0
```

Artinya aplikasi masih dalam tahap pengembangan aktif.

---

# 10. PRE-RELEASE

Jika diperlukan:

```text
1.0.0-alpha
1.0.0-beta
1.0.0-rc.1
```

Definisi:

```text
alpha
= fitur masih eksperimental

beta
= fitur utama sudah tersedia tetapi testing berlangsung

rc
= release candidate
```

---

# 11. CHANGELOG FORMAT

Gunakan format:

```markdown
## [Version] — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Security
- ...

### Database
- ...

### API
- ...

### Documentation
- ...
```

Kategori kosong boleh dihilangkan.

---

# 12. CHANGELOG ENTRY RULE

Setiap entry harus menjawab minimal:

```text
Apa yang berubah?
Mengapa berubah?
Apa dampaknya?
```

Jika perubahan cukup besar, tambahkan:

```text
Migration required?
Breaking?
Affected module?
```

---

# 13. CHANGELOG TIDAK BOLEH

Jangan menulis:

```text
Fixed some bugs.
Updated code.
Changed things.
```

Gunakan:

```text
Fixed incorrect remaining-payment calculation when an order has a single DP.
```

---

# 14. CURRENT PROJECT STATUS

FRNDLY saat ini berada pada tahap:

```text
Development / MVP
```

Backend REST API (Laravel + Sanctum) dan frontend (React + Vite) telah terimplementasi untuk modul:

```text
Auth (login/logout/me)
Dashboard (dengan filter periode)
Customers
Products
Orders
Payments
Invoices (termasuk PDF)
Production
Shipping
Reviews
Testimonials
Reports (termasuk export CSV)
Settings
```

Database aktif saat ini: **MySQL/MariaDB** (target project). Detail status rilis lihat `# 32. RELEASE HISTORY`.

---

# 14b. [0.3.0] — 2026-08-10 — REVISION 02: ADVANCED MODULES + FRONTEND MODERNIZATION

## Added

* Backend modul **Production**: production order unik per order, workflow status `design → approval → production → quality_control → packing → shipping`, histori event, larangan mundur status.
* Backend modul **Shipping**: shipment per order, data penerima dan kurir, tracking number, workflow status `pending → packed → shipped → in_transit → delivered`, histori event, larangan membatalkan shipment yang sudah dikirim.
* Backend modul **Reviews**: review hanya untuk order lunas, rating 1–10, satu review per order, toggle publish/unpublish.
* Backend modul **Testimonials**: testimonial berbasis review, customer otomatis dari review, toggle featured/published.
* Backend modul **Reports**: laporan `sales`, `profit`, `customers`, `products` dengan summary agregat + export CSV.
* Backend modul **Settings**: application settings kelompok `appearance`, `business`, `order`, `invoice` dengan default value yang konsisten.
* Frontend **design system** baru: design token light/dark theme, spacing, radius, shadow, focus-visible, reduced-motion.
* Frontend **komponen reusable**: Button, Modal, ConfirmDialog, Dropdown, Toast, EmptyState, Skeleton, Pagination, StatusBadge, Toolbar, PageHeader, dll.
* Frontend **app shell**: sidebar collapsible + drawer mobile + backdrop, header + breadcrumb, global search (Ctrl+K), toggle tema, menu profil.
* Seluruh **13 halaman** dimodernisasi: Dashboard, Login, Customers, Products, Orders, Payments, Invoices, Production, Shipping, Reviews, Testimonials, Reports, Settings.
* **Responsive layout** dengan breakpoint 1100/860/640/420 px.

## Changed

* Dashboard mendukung **filter periode** (`this_month`, `last_month`, `last_3_months`, `this_year`, `all_time`) yang memfilter order, payment, dan customer; nilai default diambil dari settings `appearance.default_period`.
* Settings `appearance.default_theme` kini **terhubung ke tema aplikasi** (`system`/`light`/`dark`); toggle tema di header berlaku sebagai override perangkat (localStorage).
* **Global search** kini membuka record spesifik (modal edit) alih-alih hanya berpindah ke section halaman.

## Database

* Menambahkan tabel: `production_orders`, `production_events`, `shipments`, `shipment_events`, `reviews`, `testimonials`, `application_settings`.

## API

* Menambahkan endpoint production, shipment, review, testimonial, report, dan settings.
* `GET /api/v1/dashboard` menerima query param `period` dan mengembalikan `data.period`.

## Removed

* Menghapus file sampah `backend/20` (artifact tidak sengaja).

## Documentation

* Memperbarui status modul pada bagian `# 14. CURRENT PROJECT STATUS`.
* Menambahkan entri changelog `0.3.0` ini.

---

# 15. [UNRELEASED]

## Added

### Project Foundation

* Menetapkan nama proyek sebagai **FRNDLY**.
* Menetapkan FRNDLY sebagai sistem manajemen bisnis konveksi dan custom apparel.
* Menetapkan fokus awal aplikasi pada administrator.
* Menetapkan responsive web sebagai platform utama.
* Menetapkan Laravel sebagai backend utama.
* Menetapkan React.js sebagai frontend utama.
* Menetapkan MySQL/MariaDB sebagai database.
* Menetapkan deployment target VPS/Cloud.

### Customer Management

Menetapkan kebutuhan pengelolaan data:

* nama
* nomor HP
* email
* alamat
* kota
* provinsi
* catatan
* histori pesanan
* jumlah repeat order

### Order Management

Menetapkan order workflow:

```text
Draft
↓
Menunggu DP
↓
DP Masuk
↓
Proses
↓
Lunas
```

### Product Management

Menetapkan dukungan untuk produk custom seperti:

* kaos
* lanyard
* jaket
* ID card
* pakaian
* atribut event
* produk custom lainnya

Produk dapat memiliki:

* variasi
* ukuran
* quantity
* harga satuan
* notes
* file desain
* biaya/modal

### Multi-Product Order

Satu order dapat memiliki lebih dari satu produk.

Contoh:

```text
Order
├── Kaos
├── Lanyard
├── ID Card
└── Jaket
```

### Payment

Menetapkan:

* DP satu kali
* pelunasan
* remaining payment
* status pembayaran
* pencatatan nominal pembayaran

Pembayaran dilakukan secara manual melalui WhatsApp untuk versi awal.

### Invoice

Menetapkan:

* invoice PDF
* invoice berbasis data order
* invoice berbasis data customer
* nomor invoice otomatis
* Order ID
* company branding
* multiple invoice templates

Format nomor invoice:

```text
INV-YYYYMMDD-000
```

Contoh:

```text
INV-20260804-001
```

### Review

Menetapkan:

* review setelah order lunas
* rating 1–10
* testimonial
* optional customer photo

### Production

Menetapkan sistem tracking proses produksi.

### Shipping

Menetapkan fitur pengiriman yang dapat menyimpan informasi:

* alamat
* ongkir
* shipping status
* tracking information

### Dashboard

Menetapkan dashboard dengan:

* total orders
* unfinished orders
* DP orders
* paid orders
* revenue
* profit
* repeat customers
* deadline
* quick actions

Data tetap menjadi fokus utama dashboard.

### Search

Menetapkan:

* global search
* customer search
* order search
* invoice search
* product search

### Filter

Menetapkan filter lengkap untuk:

* status
* tanggal
* customer
* product
* payment
* shipping

### Export

Menetapkan dukungan:

```text
PDF
CSV
Excel
```

### File Management

Menetapkan universal attachment untuk:

* desain
* revisi
* dokumen
* bukti
* file pendukung

### Design Revision

Menetapkan versioning file desain dan histori revisi.

### Price History

Menetapkan histori perubahan harga.

Harga pada order lama tidak boleh berubah ketika master price berubah.

### Discount

Menetapkan dukungan:

* quantity-based discount
* fixed discount
* percentage discount
* custom discount rules

Nominal dan kondisi diskon ditentukan oleh admin.

### Soft Delete

Menetapkan:

```text
Active
↓
Archive
↓
Restore
```

Data tertentu dapat dihapus permanen melalui archive.

### Audit Trail

Menetapkan pencatatan:

* actor
* action
* entity
* timestamp

### Auto Save Draft

Menetapkan auto-save untuk draft order.

### Activity Center

Menetapkan pusat aktivitas sistem.

### Reminder

Menetapkan reminder untuk aktivitas seperti:

* deadline
* pembayaran
* proses order
* pengiriman

### Backup

Menetapkan sistem backup data.

### Reports

Menetapkan sistem laporan untuk:

* order
* customer
* revenue
* profit
* payment
* product
* shipping
* review

### Customization

Menetapkan halaman settings untuk:

* application theme
* tone warna
* status colors
* company branding
* invoice template
* konfigurasi aplikasi

---

# 16. [UNRELEASED] — ARCHITECTURE

## Added

Dokumen arsitektur FRNDLY mencakup:

```text
Laravel
React.js
MySQL/MariaDB
REST API
Authentication
File Storage
PDF Generation
Backup
Audit Trail
```

Arsitektur harus mengikuti prinsip:

```text
Separation of Concerns
Single Source of Truth
Security by Default
Performance First
```

---

# 17. [UNRELEASED] — DATABASE

## Added

Database requirement mencakup entity utama:

```text
users
customers
products
product_variations
orders
order_items
payments
discounts
shipments
attachments
design_revisions
reviews
testimonials
price_histories
activities
audit_logs
settings
backups
```

Nama entity final harus mengikuti `docs/04-ERD.md` dan `docs/05-Database.md`.

---

# 18. [UNRELEASED] — API

## Added

API specification disiapkan untuk modul:

```text
Authentication
Dashboard
Customers
Products
Orders
Payments
Invoices
Reviews
Shipments
Attachments
Reports
Search
Settings
Activities
```

API harus mengikuti `docs/06-API.md`.

---

# 19. [UNRELEASED] — UI/UX

## Added

Menetapkan prinsip:

```text
Professional
Clean
Modern
Responsive
Data-focused
Minimal pop-up
Fast interaction
Consistent design system
```

---

# 20. [UNRELEASED] — SECURITY

## Added

Menetapkan baseline security:

```text
Authentication
Authorization
CSRF protection
XSS protection
SQL injection protection
Validation
Secure file upload
Session security
Rate limiting
HTTPS
Environment protection
Audit trail
```

Detail mengikuti `docs/08-Security.md`.

---

# 21. [UNRELEASED] — TESTING

## Added

Menetapkan testing framework dan strategy:

```text
Unit Testing
Feature Testing
Integration Testing
API Testing
E2E Testing
Security Testing
Performance Testing
Regression Testing
UAT
```

Critical business logic wajib memiliki automated test.

---

# 21b. [UNRELEASED] — DOCUMENTATION RECONCILIATION (AUDIT)

## Changed

* Melengkapi `docs/11-Business-Rules.md` (sebelumnya terpotong) menjadi 20 kelompok business rule lengkap.
* Memperbaiki header `File:` pada `docs/05-Database.md` s/d `docs/10-Changelog.md`.
* Memperbaiki referensi silang nama dokumen di `08-Security`, `10-Changelog`, `03-Architecture`, `04-ERD`, `05-Database`, `07-UIUX`, `ai/master-rules.md`.
* Menyamakan status order menjadi `processing` (sebelumnya bervariasi `process`/`processing`).
* Menyamakan payment type menjadi `dp`/`final`.
* Menetapkan login menggunakan **email** (menghapus `username` dari ERD, Database, API).
* Menetapkan `customers.phone` **tidak** UNIQUE (hapus dari unique constraints ERD).
* Menetapkan nomor invoice `INV-YYYYMMDD-000` dengan counter **reset harian**.
* Menyamakan stage produksi menjadi `design → approval → production → quality_control → packing → shipping`.
* Melengkapi detail yang belum final: FR-048 REPORTING, field `Production Cost` (FR-020), ambang repeat customer (FR-006), counter invoice reset harian.
* Meng-update `README.md`: melengkapi daftar modul, mengganti SQLite → MySQL/MariaDB, memperbaiki contoh login.
* Mengisi `backend/README.md` dan `frontend/README.md` sesuai proyek (sebelumnya template default).
* Menambahkan catatan konseptual entity pada `ai/project-context.md` dan `ai/master-prompt.md` (final = ERD).

---

# 22. FUTURE — DEFERRED FEATURES

Fitur berikut sengaja tidak menjadi bagian dari initial release:

```text
Customer Portal
Customer Login
Online Payment Gateway
WhatsApp API
Automatic Email
Multi-admin
Role & Permission
Multi-company / Multi-tenant
Native Mobile Application
Customer Landing Page
Marketing Website
```

Fitur tersebut dapat dimasukkan pada fase berikutnya setelah core application stabil.

---

# 23. CHANGELOG DISCIPLINE

Setiap perubahan berikut WAJIB dipertimbangkan untuk masuk ke changelog:

```text
Database schema change
API change
Business logic change
Security change
New feature
Removed feature
Breaking change
Major UI/UX change
Deployment architecture change
```

---

# 24. DATABASE CHANGE RULE

Jika perubahan code membutuhkan migration:

```text
Migration
+
docs/05-Database.md
+
docs/10-Changelog.md
```

harus diperiksa konsistensinya.

---

# 25. API CHANGE RULE

Jika API berubah:

```text
Code
+
docs/06-API.md
+
docs/10-Changelog.md
```

harus tetap sinkron.

---

# 26. ERD CHANGE RULE

Jika entity atau relationship berubah:

```text
Migration
+
docs/04-ERD.md
+
docs/05-Database.md
+
docs/10-Changelog.md
```

harus diperbarui.

---

# 27. UI CHANGE RULE

Jika perubahan UI memengaruhi design system:

```text
UI implementation
+
docs/07-UIUX.md
+
docs/10-Changelog.md
```

harus diperiksa.

---

# 28. SECURITY CHANGE RULE

Perubahan security harus dicatat secara eksplisit.

Contoh:

```text
### Security

- Added rate limiting to authentication endpoint.
- Restricted private attachment access to authenticated users.
```

Jangan menyimpan credential, secret key, password, token, atau informasi sensitif di changelog.

---

# 29. AI CODING RULE

AI coding assistant yang mengubah FRNDLY harus:

1. membaca `master-rules.md`
2. membaca `coding-rules.md`
3. membaca dokumentasi relevan
4. memahami impact perubahan
5. mengimplementasikan perubahan
6. menjalankan testing
7. memperbarui changelog jika diperlukan

AI tidak boleh mengubah architecture atau business rule tanpa persetujuan.

---

# 30. CHANGE IMPACT ANALYSIS

Sebelum perubahan besar:

```text
Requirement
↓
Affected files
↓
Affected database
↓
Affected API
↓
Affected UI
↓
Affected tests
↓
Affected documentation
```

Setelah itu baru implementasi.

---

# 31. CHANGELOG REVIEW

Sebelum release:

```text
[ ] Changelog updated
[ ] Version correct
[ ] Breaking changes documented
[ ] Migration documented
[ ] Security changes documented
[ ] Deprecated features documented
```

---

# 32. RELEASE HISTORY

Belum terdapat production release.

```text
Version | Date       | Status
--------|------------|-------
0.1.0   | 2026-08-09 | Development — foundation + database schema
0.2.0   | 2026-08-09 | Development — auth + customer + product + order + payment + invoice API
0.3.0   | 2026-08-10 | Development — advanced modules (production/shipping/review/testimonial/report/settings) + frontend modernization
1.0.0   | TBD        | Initial Release
```

Tanggal `1.0.0` harus diisi ketika release benar-benar dilakukan.

---

# 33. VERSION ROADMAP

Perkiraan:

```text
0.1.0
Project foundation

0.2.0
Authentication + database foundation

0.3.0
Customer + product

0.4.0
Order + payment

0.5.0
Invoice + attachment

0.6.0
Production + shipping

0.7.0
Review + testimonial

0.8.0
Dashboard + reports

0.9.0
Testing + hardening

1.0.0
Initial production release
```

Nomor versi dapat berubah mengikuti perkembangan aktual.

---

# 34. CHANGELOG RULE FOR SMALL CHANGES

Tidak semua perubahan kecil perlu dicatat.

Tidak perlu mencatat:

```text
Rename local variable
Formatting
Minor refactoring
Typo internal
```

kecuali perubahan tersebut memiliki dampak terhadap public behavior atau dokumentasi.

---

# 35. CHANGELOG RULE FOR REFACTORING

Refactoring besar dicatat jika memengaruhi:

* architecture
* performance
* database
* API
* security
* developer workflow

---

# 36. SINGLE SOURCE OF TRUTH

Changelog **bukan** sumber kebenaran untuk:

```text
Architecture
Database
API
Security
UI/UX
Business requirements
```

Changelog hanya mencatat sejarah perubahan.

Sumber utama masing-masing adalah:

```text
Business Requirement → docs/01-PRD.md / docs/02-SRS.md
Architecture → docs/03-Architecture.md
Database → docs/04-ERD.md / docs/05-Database.md
API → docs/06-API.md
UI/UX → docs/07-UIUX.md
Security → docs/08-Security.md
Testing → docs/09-Testing.md
Business Rules → docs/11-Business-Rules.md
Development rules → ai/coding-rules.md
Project rules → ai/master-rules.md
History → docs/10-Changelog.md
```

---

# 37. FINAL CHANGELOG PRINCIPLE

FRNDLY harus selalu dapat menjawab:

```text
Apa yang berubah?
Kapan berubah?
Mengapa berubah?
Siapa/apa yang terdampak?
Apakah breaking change?
Apakah database berubah?
Apakah API berubah?
Apakah testing perlu diperbarui?
```

Jika jawabannya jelas, maka project lebih mudah dipelihara.

---

# END OF CHANGELOG

**FRNDLY — Business Management System**

Changelog v1.0.0
