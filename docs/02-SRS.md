# FRNDLY — SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

**Project:** FRNDLY
**Document:** Software Requirements Specification
**Version:** 1.0.0
**Status:** Approved Baseline
**Last Updated:** 2026-08-08
**Primary Language:** Bahasa Indonesia
**Backend:** Laravel
**Frontend:** React.js
**Database:** MySQL / MariaDB
**Development Environment:** Laragon
**Deployment Target:** VPS / Cloud
**Application Type:** Responsive Web Application
**Architecture:** Modular Monolith

---

# 1. DOKUMEN OVERVIEW

## 1.1 Tujuan Dokumen

Dokumen ini mendefinisikan kebutuhan perangkat lunak FRNDLY secara lengkap, terstruktur, dan terukur.

SRS menjadi sumber acuan utama untuk:

* pengembangan backend,
* pengembangan frontend,
* database,
* API,
* UI/UX,
* testing,
* security,
* deployment,
* maintenance,
* pengembangan fitur berikutnya.

Semua implementasi harus mengacu pada SRS ini.

Jika terdapat kebutuhan baru yang belum tercantum dalam SRS, kebutuhan tersebut harus dianggap sebagai **Change Request** dan tidak langsung mengubah behavior sistem tanpa evaluasi.

---

# 2. PROJECT OVERVIEW

## 2.1 Nama Aplikasi

**FRNDLY**

FRNDLY adalah aplikasi manajemen bisnis konveksi berbasis web yang digunakan untuk mengelola customer, produk custom, pesanan, pembayaran, produksi, pengiriman, invoice, review, laporan, dan aktivitas bisnis secara terintegrasi.

---

## 2.2 Konsep Utama

FRNDLY menggunakan prinsip:

> **One Source of Truth**

Setiap informasi bisnis harus memiliki satu sumber data utama.

Contoh:

```text
Customer
    ↓
Customer Master
    ↓
Order
    ↓
Order Items
    ↓
Payment
    ↓
Invoice
    ↓
Production
    ↓
Shipment
    ↓
Review
```

Data tidak boleh diduplikasi secara tidak perlu.

---

# 3. BUSINESS CONTEXT

## 3.1 Jenis Bisnis

FRNDLY ditujukan untuk bisnis konveksi/custom apparel dan event attributes.

Produk dapat berupa:

* kaos,
* jaket,
* lanyard,
* ID card,
* atribut event,
* pakaian,
* merchandise,
* produk custom lainnya.

---

## 3.2 Karakteristik Bisnis

Produk bersifat:

* custom,
* berdasarkan pesanan,
* tidak menggunakan stok konvensional,
* dapat memiliki variasi,
* dapat memiliki ukuran,
* dapat memiliki desain,
* dapat memiliki notes khusus,
* harga dapat dipengaruhi quantity,
* dapat memiliki diskon.

Model bisnis utama:

> **Make to Order / Custom Order**

---

# 4. PRODUCT VISION

FRNDLY bertujuan menjadi pusat pengelolaan operasional bisnis konveksi sehingga admin tidak perlu mengelola data customer, pesanan, pembayaran, invoice, produksi, pengiriman, dan laporan secara terpisah.

Sistem harus memberikan:

```text
Input
↓
Process
↓
Tracking
↓
Payment
↓
Production
↓
Shipping
↓
Invoice
↓
Review
↓
Reporting
```

dalam satu ekosistem.

---

# 5. SYSTEM USERS

## 5.1 MVP User

Pada tahap awal hanya terdapat:

### Admin

Admin dapat:

* mengelola customer,
* mengelola produk,
* membuat order,
* mengelola pembayaran,
* mengelola invoice,
* mengelola produksi,
* mengelola pengiriman,
* mengelola review,
* melihat dashboard,
* membuat laporan,
* melakukan backup,
* mengatur aplikasi.

---

## 5.2 Future Users

Belum diimplementasikan:

* Customer,
* Staff,
* Finance,
* Production Staff,
* Sales,
* Multi-admin,
* Role-based users.

---

# 6. OUT OF SCOPE MVP

Fitur berikut sengaja ditunda:

* Customer Portal,
* Customer Login,
* Payment Gateway,
* WhatsApp API,
* Automated Email,
* Multi-admin,
* Role & Permission kompleks,
* Multi-company / Multi-tenant,
* Native Mobile Application,
* Landing Page,
* Marketing Website.

Fitur tersebut dapat dimasukkan pada roadmap berikutnya.

---

# 7. SYSTEM ARCHITECTURE

## 7.1 Technology Stack

### Backend

```text
Laravel
PHP
REST API
Laravel Authentication
Laravel Validation
Laravel Policies
Laravel Queue
Laravel Scheduler
Laravel Storage
```

### Frontend

```text
React.js
JavaScript / TypeScript sesuai keputusan implementasi
Responsive UI
```

### Database

```text
MySQL / MariaDB
```

### Environment

```text
Laragon
```

### Deployment

```text
VPS / Cloud
```

---

# 8. ARCHITECTURAL PRINCIPLE

FRNDLY menggunakan pendekatan:

> **Modular Monolith**

Backend dan frontend berada dalam satu sistem aplikasi terintegrasi tetapi domain bisnis dipisahkan secara modular.

Modul utama:

```text
Authentication
Customer
Product
Order
Payment
Invoice
Production
Shipment
Review
Reporting
Settings
Backup
Audit
Activity
```

---

# 9. FUNCTIONAL REQUIREMENTS

---

# FR-001 — AUTHENTICATION

## Deskripsi

Sistem harus menyediakan authentication untuk admin.

### Fitur

* Login,
* Logout,
* Password management,
* Session management,
* Security protection.

### Future

Authentication dapat dikembangkan menjadi:

```text
Multi-admin
Role
Permission
```

---

# FR-002 — DASHBOARD

Dashboard merupakan halaman utama setelah login.

Dashboard harus menampilkan overview bisnis secara ringkas.

## Informasi utama

### Order

* total order,
* order selesai,
* order belum selesai,
* order draft,
* order menunggu DP,
* order DP masuk,
* order proses,
* order lunas.

### Financial

* total revenue,
* total DP,
* outstanding payment,
* total profit.

### Customer

* total customer,
* customer baru,
* repeat customer.

### Production

* production in progress,
* deadline terdekat.

### Shipment

* belum dikirim,
* sedang dikirim,
* selesai.

---

# FR-003 — DASHBOARD QUICK ACTION

Dashboard dapat menyediakan quick action.

Contoh:

```text
+ Customer
+ Order
+ Product
Record Payment
Generate Invoice
```

Quick action tidak boleh menghilangkan fokus utama dashboard sebagai pusat informasi.

---

# FR-004 — CUSTOMER MANAGEMENT

Sistem harus menyediakan halaman customer.

## Customer Fields

```text
ID
Name
Phone
Email
Address
City
Province
Notes
Created At
Updated At
Deleted At
```

---

# FR-005 — CUSTOMER HISTORY

Setiap customer harus memiliki histori.

Informasi:

* jumlah order,
* total quantity,
* total transaksi,
* total pembayaran,
* outstanding balance,
* order terakhir,
* produk yang pernah dipesan,
* review,
* invoice,
* shipment.

---

# FR-006 — REPEAT CUSTOMER

Sistem harus menghitung jumlah order customer.

Contoh:

```text
Customer:
Felix

Orders:
5

Repeat Customer:
Yes
```

Informasi ini dapat digunakan sebagai dasar analisis customer dan pricing.

---

# FR-007 — CUSTOMER SEARCH

Customer dapat dicari berdasarkan:

* nama,
* nomor HP,
* email.

---

# FR-008 — CUSTOMER FILTER

Filter customer minimal:

* status,
* tanggal,
* jumlah order,
* repeat customer.

---

# FR-009 — PRODUCT MANAGEMENT

Sistem harus menyediakan master data produk.

Contoh:

```text
Kaos
Jaket
Lanyard
ID Card
Event Attribute
```

---

# FR-010 — PRODUCT DATA

Product dapat memiliki:

```text
Name
Category
Description
Base Price
Unit
Material
Notes
Active Status
```

---

# FR-011 — PRODUCT VARIANTS

Produk dapat memiliki variant.

Contoh:

```text
Size
Color
Material
Custom Attribute
```

---

# FR-012 — SIZE MANAGEMENT

Produk seperti kaos dapat memiliki:

```text
XS
S
M
L
XL
XXL
XXXL
```

Namun sistem tidak boleh membatasi produk hanya pada ukuran tersebut.

---

# FR-013 — QUANTITY PER SIZE

Order dapat menyimpan quantity berdasarkan ukuran.

Contoh:

```text
S   20
M   40
L   50
XL  20
```

Total:

```text
130 pcs
```

---

# FR-014 — PRICE MANAGEMENT

Harga disimpan sebagai harga satuan.

Contoh:

```text
100 pcs × Rp50.000
= Rp5.000.000
```

---

# FR-015 — PRICE HISTORY

Perubahan harga master product harus memiliki history.

Contoh:

```text
Rp45.000
↓
Rp47.500
↓
Rp50.000
```

Order lama tidak boleh berubah akibat perubahan harga master.

---

# FR-016 — DISCOUNT MANAGEMENT

Sistem mendukung:

* quantity discount,
* manual discount,
* customer discount,
* campaign discount di masa depan.

Namun nominal dan kondisi discount ditentukan oleh admin.

Jangan hardcode aturan diskon pada frontend.

---

# FR-017 — ORDER MANAGEMENT

Order merupakan inti transaksi FRNDLY.

Satu order dapat memiliki lebih dari satu produk.

Contoh:

```text
Order
├── Kaos
├── Lanyard
├── ID Card
└── Jaket
```

---

# FR-018 — ORDER ID

Setiap order memiliki Order ID.

Format:

```text
ORD-YYYYMMDD-000
```

Contoh:

```text
ORD-20260804-001
```

---

# FR-019 — ORDER STATUS

Status order:

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

Status harus dikontrol oleh backend.

---

# FR-020 — ORDER DATA

Order minimal menyimpan:

```text
Order ID
Customer
Order Date
Deadline
Status
Subtotal
Discount
Shipping Cost
Grand Total
Paid Amount
Remaining Amount
Profit
Notes
Internal Notes
```

---

# FR-021 — ORDER ITEMS

Order item menyimpan:

```text
Product
Product Snapshot
Quantity
Unit Price
Subtotal
Variant
Size
Notes
Design
```

---

# FR-022 — MULTI PRODUCT ORDER

Satu invoice/order dapat memiliki lebih dari satu product.

---

# FR-023 — ORDER NOTES

Terdapat:

### Customer Notes

Informasi yang relevan untuk customer/order.

### Internal Notes

Informasi internal admin.

Internal notes tidak boleh muncul pada invoice customer jika memang ditandai sebagai internal.

---

# FR-024 — DESIGN FILE

Order dapat memiliki file desain.

Jenis:

```text
AI
PSD
PDF
PNG
JPG
SVG
ZIP
```

format final mengikuti kebijakan upload.

---

# FR-025 — DESIGN REVISION

Design dapat memiliki revision.

Contoh:

```text
Design v1
Design v2
Design v3
```

Setiap revision dapat menyimpan:

* file,
* timestamp,
* note,
* status.

---

# FR-026 — DESIGN STATUS

Design dapat memiliki status:

```text
Draft
Review
Approved
Rejected
```

Status final dapat dikembangkan sesuai workflow produksi.

---

# FR-027 — PAYMENT MANAGEMENT

Sistem mencatat pembayaran.

Pembayaran dilakukan di luar sistem melalui WhatsApp.

FRNDLY hanya mencatat transaksi pembayaran.

---

# FR-028 — PAYMENT TYPE

MVP:

```text
DP
Pelunasan
```

---

# FR-029 — DP RULE

DP hanya satu kali.

Sistem harus mencegah:

```text
DP
+
DP kedua
```

jika tidak sesuai business rule.

---

# FR-030 — PAYMENT DATA

Payment minimal:

```text
Payment ID
Order ID
Amount
Type
Date
Reference
Notes
Attachment
```

---

# FR-031 — PAYMENT CALCULATION

Sistem harus menghitung:

```text
Grand Total
- Paid Amount
= Remaining Balance
```

---

# FR-032 — PAYMENT STATUS

Payment status:

```text
Belum Bayar
DP
Lunas
```

Status utama order mengikuti workflow order.

---

# FR-033 — INVOICE

Sistem harus dapat membuat invoice berdasarkan order.

Invoice harus menggunakan data:

```text
Company
Customer
Order
Order Items
Payment
Shipping
Discount
```

---

# FR-034 — INVOICE NUMBER

Format:

```text
INV-YYYYMMDD-000
```

Contoh:

```text
INV-20260804-001
```

Invoice number harus unique.

---

# FR-035 — INVOICE PDF

Invoice dapat di-download sebagai PDF.

Invoice menggunakan konsep nota profesional.

Tidak membutuhkan foto produk.

---

# FR-036 — INVOICE CONTENT

Invoice minimal:

```text
Company Logo
Company Name
Company Address
Contact
Invoice Number
Order ID
Invoice Date

Customer:
Name
Phone
Email
Address

Order:
Product
Variant
Size
Quantity
Unit Price
Subtotal

Discount
Shipping
Grand Total
DP
Remaining Balance

Payment Status
Deadline
Notes
```

---

# FR-037 — INVOICE TEMPLATE

Sistem mendukung beberapa template invoice.

Contoh:

```text
Classic
Modern
Minimal
Professional
```

Admin dapat memilih template.

---

# FR-038 — INVOICE BRANDING

Invoice harus menggunakan company branding.

Contoh:

* logo,
* company name,
* color,
* contact,
* address.

---

# FR-039 — PRODUCTION MANAGEMENT

Order custom harus dapat dipantau proses produksinya.

Contoh workflow:

```text
Order
↓
Design
↓
Design Approved
↓
Production
↓
Quality Check
↓
Ready
↓
Shipment
```

Status final dapat disesuaikan pada implementasi.

---

# FR-040 — PRODUCTION TIMELINE

Sistem mencatat timeline produksi.

Contoh:

```text
08 Aug
Design Approved

09 Aug
Production Started

11 Aug
Production Completed
```

---

# FR-041 — SHIPMENT MANAGEMENT

Sistem harus dapat mencatat pengiriman.

Data minimal:

```text
Shipment ID
Order ID
Shipping Date
Courier
Tracking Number
Shipping Cost
Address
Status
Notes
```

---

# FR-042 — SHIPMENT STATUS

Contoh:

```text
Belum Dikirim
Diproses
Dikirim
Selesai
```

---

# FR-043 — REVIEW

Customer dapat memberikan review setelah order lunas.

Pada MVP review dilakukan melalui mekanisme yang disediakan admin/sistem.

Customer portal belum tersedia.

---

# FR-044 — RATING

Rating menggunakan skala:

```text
1–10
```

---

# FR-045 — TESTIMONIAL

Customer dapat memberikan testimonial.

Testimonial dapat berupa:

```text
Text
Photo
```

Foto bersifat optional.

Konsep UI dapat menyerupai marketplace/olshop.

---

# FR-046 — REVIEW ELIGIBILITY

Review hanya dapat diberikan untuk order yang telah:

```text
Lunas
```

---

# FR-047 — REVIEW MODERATION

Admin dapat:

* melihat review,
* mengubah status publish,
* menyembunyikan review,
* menghapus review.

---

# FR-048 — REPORTING

Sistem menyediakan laporan bisnis.

---

# FR-049 — SALES REPORT

Laporan:

* total order,
* revenue,
* quantity,
* average order value,
* customer sales.

---

# FR-050 — PAYMENT REPORT

Laporan:

* DP,
* pelunasan,
* outstanding,
* unpaid order,
* payment history.

---

# FR-051 — PROFIT REPORT

Profit dihitung berdasarkan:

```text
Revenue
-
Production Cost
-
Shipping Cost
-
Other Applicable Cost
=
Profit
```

---

# FR-052 — PRODUCTION REPORT

Laporan:

* order production,
* status production,
* deadline,
* overdue order.

---

# FR-053 — CUSTOMER REPORT

Laporan:

* customer baru,
* repeat customer,
* jumlah order,
* customer value.

---

# FR-054 — PRODUCT REPORT

Laporan:

* produk paling sering dipesan,
* quantity,
* revenue,
* profit.

---

# FR-055 — EXPORT

Laporan/data dapat diekspor ke:

```text
PDF
CSV
Excel
```

---

# FR-056 — FILTERING

Sistem harus menyediakan filter lengkap.

Contoh:

```text
Date
Customer
Product
Order Status
Payment Status
Production Status
Shipment Status
```

---

# FR-057 — GLOBAL SEARCH

Sistem menyediakan global search.

Search dapat mencari:

```text
Customer
Order
Invoice
Product
```

---

# FR-058 — ACTIVITY CENTER

Activity Center menampilkan aktivitas penting.

Contoh:

```text
Order dibuat
Payment dicatat
Invoice dibuat
Design diupload
Order masuk produksi
Shipment dibuat
Review diterima
```

---

# FR-059 — AUDIT TRAIL

Audit trail mencatat perubahan penting.

Minimal:

```text
Actor
Action
Entity
Entity ID
Timestamp
Old Value
New Value
```

---

# FR-060 — ATTACHMENT

Sistem memiliki universal attachment.

Attachment dapat digunakan untuk:

```text
Design
Payment Proof
Invoice
Shipment
Review
Other Business Documents
```

---

# FR-061 — AUTO SAVE

Draft dapat disimpan otomatis.

Auto-save harus:

* menggunakan debounce,
* tidak mengganggu user,
* memiliki status saving,
* memiliki status saved,
* menangani failure.

---

# FR-062 — REMINDER

Sistem menyediakan reminder.

Contoh:

```text
Deadline order mendekat
Pembayaran belum lunas
Order belum dikirim
Review belum diberikan
```

Notifikasi otomatis eksternal belum diperlukan.

---

# FR-063 — SOFT DELETE

Data tertentu menggunakan soft delete.

Data berpindah ke:

```text
Archive
```

---

# FR-064 — RESTORE

Admin dapat restore data yang masih berada dalam archive.

---

# FR-065 — PERMANENT DELETE

Data archive dapat dihapus permanen.

Permanent delete:

* membutuhkan confirmation,
* membutuhkan authorization,
* harus aman terhadap relationship,
* harus mempertimbangkan audit requirements.

---

# FR-066 — BACKUP

Sistem harus menyediakan backup.

Backup mencakup minimal:

```text
Database
Important Application Data
```

---

# FR-067 — BACKUP MANAGEMENT

Admin dapat:

* membuat backup,
* melihat backup,
* download backup,
* menghapus backup lama.

Automated backup dapat dikembangkan menggunakan scheduler.

---

# FR-068 — SETTINGS

Admin dapat mengatur:

### Application

* application name,
* timezone,
* currency.

### Branding

* logo,
* company name,
* company address,
* company contact,
* color theme.

### Status

* status color,
* status label jika diperbolehkan.

### Invoice

* template,
* invoice prefix,
* display configuration.

---

# FR-069 — COMPANY PROFILE

Company profile minimal:

```text
Company Name
Logo
Address
City
Province
Phone
Email
Website
Tax/Business Information jika diperlukan
```

---

# FR-070 — UI CUSTOMIZATION

Admin dapat mengubah:

* primary color,
* secondary color,
* application tone,
* status colors,
* theme settings.

---

# FR-071 — ADMIN PROFILE

Admin dapat mengatur:

```text
Name
Username
Email
Password
Profile Photo
```

---

# FR-072 — SECURITY SETTINGS

Admin dapat:

* change password,
* logout sessions,
* manage authentication settings sesuai kemampuan sistem.

---

# 10. ORDER WORKFLOW

Workflow utama:

```text
DRAFT
   ↓
MENUNGGU DP
   ↓
DP MASUK
   ↓
PROSES
   ↓
LUNAS
```

Status tambahan production/shipment dapat berjalan sebagai workflow pendukung.

---

# 11. ORDER LIFECYCLE

```text
Customer
   ↓
Create Customer
   ↓
Create Order
   ↓
Add Products
   ↓
Set Quantity
   ↓
Set Price
   ↓
Set Discount
   ↓
Set Deadline
   ↓
Generate Order ID
   ↓
Menunggu DP
   ↓
Record DP
   ↓
DP Masuk
   ↓
Production
   ↓
Shipment
   ↓
Record Final Payment
   ↓
Lunas
   ↓
Review
```

---

# 12. ORDER CALCULATION

Formula utama:

```text
Item Subtotal
=
Quantity × Unit Price
```

```text
Order Subtotal
=
Σ Item Subtotal
```

```text
Grand Total
=
Order Subtotal
-
Discount
+
Shipping
+
Other Applicable Cost
```

```text
Remaining Balance
=
Grand Total
-
Total Paid
```

---

# 13. PROFIT CALCULATION

Profit:

```text
Profit
=
Revenue
-
Production Cost
-
Shipping Cost
-
Other Applicable Cost
```

Cost dapat berasal dari rentang modal yang ditentukan admin.

---

# 14. PRICING MODEL

Pricing menggunakan:

```text
Unit Price
+
Quantity
+
Variant
+
Discount
```

Admin dapat menentukan harga.

Harga lama tidak berubah setelah order dibuat.

---

# 15. DATA MODEL OVERVIEW

Entity utama:

```text
Admin
Company
Customer
Product
Product Category
Product Variant
Product Price History
Order
Order Item
Order Item Variant
Payment
Invoice
Invoice Item
Design
Design Revision
Production
Production Event
Shipment
Review
Attachment
Activity
Audit Log
Reminder
Setting
Backup
```

---

# 16. ENTITY RELATIONSHIP OVERVIEW

Secara konseptual:

```text
Customer
   │
   └──< Orders
           │
           ├──< Order Items
           │       │
           │       └── Product
           │
           ├──< Payments
           │
           ├──< Invoices
           │
           ├──< Designs
           │
           ├──< Production
           │
           ├──< Shipments
           │
           └──< Reviews
```

Attachment dapat berhubungan dengan beberapa domain sesuai desain polymorphic relationship.

---

# 17. DATA INTEGRITY

Sistem harus memastikan:

* customer tidak hilang karena perubahan order,
* order lama tidak berubah akibat perubahan product,
* invoice number unique,
* order ID unique,
* payment valid,
* DP tidak double,
* grand total konsisten,
* remaining balance konsisten,
* soft delete tidak merusak histori.

---

# 18. SECURITY REQUIREMENTS

## SR-001 Authentication

Admin wajib login.

## SR-002 Authorization

Endpoint admin harus dilindungi.

## SR-003 Validation

Semua input divalidasi backend.

## SR-004 SQL Injection

Gunakan parameterized query/Eloquent.

## SR-005 XSS

User-generated content harus disanitasi/escaped.

## SR-006 File Security

Upload harus divalidasi.

## SR-007 Secret Security

Secret tidak boleh masuk repository.

## SR-008 Session Security

Session harus mengikuti best practice Laravel.

---

# 19. NON-FUNCTIONAL REQUIREMENTS

## NFR-001 Performance

Halaman utama harus terasa cepat pada dataset normal.

---

## NFR-002 Scalability

Database harus dapat berkembang tanpa redesign besar.

---

## NFR-003 Responsive

Sistem harus mendukung:

```text
Desktop
Tablet
Mobile
```

---

## NFR-004 Maintainability

Kode harus mengikuti:

* `master-rules.md`
* `coding-rules.md`

---

## NFR-005 Reliability

Operasi transaksi penting harus atomic.

---

## NFR-006 Availability

Deployment VPS/Cloud harus dapat menjalankan aplikasi secara stabil.

---

## NFR-007 Backup

Data penting harus dapat dipulihkan dari backup.

---

## NFR-008 Security

Tidak ada data sensitif yang boleh terekspos tanpa authorization.

---

# 20. UI/UX REQUIREMENTS

## Prinsip desain

FRNDLY harus:

* profesional,
* clean,
* modern,
* estetik,
* mudah digunakan,
* responsive,
* tidak penuh pop-up.

---

# 21. NAVIGATION

Struktur awal:

```text
Dashboard

Customers
Products
Orders
Payments
Production
Shipments
Invoices
Reviews

Reports

Activity
Archive
Backup

Settings
```

Navigation dapat disederhanakan berdasarkan hasil UX testing.

---

# 22. STATUS COLOR SYSTEM

Status menggunakan warna yang konsisten.

Contoh:

```text
Draft       → Neutral
Waiting DP  → Warning
DP Received → Info
Process     → Primary
Paid        → Success
Cancelled   → Danger
```

Warna dapat dikustomisasi.

---

# 23. ERROR HANDLING

Error harus user-friendly.

Contoh:

```text
Gagal menyimpan customer.
Silakan coba lagi.
```

Developer mendapatkan detail melalui log.

---

# 24. EMPTY STATE

Setiap halaman list harus memiliki empty state.

Contoh:

```text
Belum ada pesanan.

[Buat Pesanan]
```

---

# 25. LOADING STATE

Setiap operasi asynchronous memiliki loading indicator.

---

# 26. CONFIRMATION

Confirmation diperlukan untuk tindakan destructive.

Contoh:

```text
Hapus customer?
Data akan dipindahkan ke arsip.
```

Permanent delete:

```text
Data akan dihapus permanen dan tidak dapat dipulihkan.
```

---

# 27. SEARCH AND FILTER

Search dan filter harus tersedia pada halaman dengan dataset besar.

Minimal:

```text
Customer
Order
Product
Invoice
Payment
Reports
```

---

# 28. MOBILE REQUIREMENT

Pada mobile:

* sidebar dapat menjadi drawer,
* table dapat scroll horizontal,
* action utama tetap mudah dijangkau,
* form tidak terlalu padat,
* invoice tetap dapat di-download.

---

# 29. FILE STORAGE REQUIREMENT

Storage harus mendukung:

```text
Invoice
Design
Payment Proof
Review Photo
Backup
Attachments
```

Storage structure harus terorganisir berdasarkan domain.

---

# 30. AUDITABILITY

Perubahan penting harus dapat ditelusuri.

Contoh:

```text
Who
What
When
Before
After
```

---

# 31. REPORTING REQUIREMENTS

Laporan harus dapat menggunakan filter:

```text
Date Range
Customer
Product
Status
Payment
Production
Shipment
```

Output:

```text
On-screen
PDF
CSV
Excel
```

---

# 32. BACKUP REQUIREMENTS

Backup harus mempertimbangkan:

```text
Database
Files
Configuration
```

Secret/environment credentials tidak boleh dimasukkan ke backup yang dapat diakses sembarang user.

---

# 33. LOGGING REQUIREMENTS

System log minimal mencatat:

* authentication failures,
* application errors,
* failed jobs,
* backup failures,
* critical operations.

---

# 34. TESTING REQUIREMENTS

Testing minimal mencakup:

## Unit Test

* calculation,
* formatting,
* business logic.

## Feature Test

* customer CRUD,
* order creation,
* payment,
* invoice,
* product,
* review.

## Integration Test

* order → payment,
* order → invoice,
* order → production,
* order → shipment.

---

# 35. CRITICAL BUSINESS TESTS

Minimal test:

```text
Create customer
Create multi-product order
Calculate subtotal
Calculate discount
Calculate shipping
Calculate grand total
Record DP
Reject second DP
Record final payment
Mark paid
Generate invoice
Generate PDF
Upload design
Create production event
Create shipment
Create review after paid
Archive
Restore
Permanent delete
Backup
```

---

# 36. ACCEPTANCE CRITERIA

Feature dianggap selesai jika:

```text
☐ Functional requirement terpenuhi
☐ Validation tersedia
☐ Error handling tersedia
☐ Loading state tersedia
☐ Empty state tersedia
☐ Responsive
☐ Security diperiksa
☐ Test relevan tersedia
☐ Tidak merusak fitur existing
☐ Dokumentasi diperbarui
```

---

# 37. DATA OWNERSHIP

Setiap domain memiliki source of truth.

```text
Customer Data
→ Customers

Product Master
→ Products

Order
→ Orders

Payment
→ Payments

Invoice
→ Invoices

Production
→ Production

Shipment
→ Shipments

Review
→ Reviews

Company Branding
→ Settings / Company
```

---

# 38. SOURCE OF TRUTH RULE

Jangan membuat data duplikat sebagai sumber utama.

Contoh:

Invoice tidak boleh menjadi sumber utama payment.

Sumber utama:

```text
Payment
```

Invoice hanya merepresentasikan keadaan transaksi pada saat invoice dibuat.

---

# 39. HISTORICAL DATA

Data transaksi harus mempertahankan historical state.

Contoh:

Jika harga kaos berubah:

```text
Product Master
Rp50.000 → Rp55.000
```

order lama tetap:

```text
Unit Price
Rp50.000
```

---

# 40. ORDER SNAPSHOT

Order item harus menyimpan snapshot informasi penting.

Minimal:

```text
Product Name
Unit Price
Quantity
Variant
```

---

# 41. INVOICE SNAPSHOT

Invoice harus dapat merepresentasikan kondisi transaksi tanpa bergantung pada perubahan master data di masa depan.

---

# 42. CUSTOMIZATION

Admin dapat mengatur:

```text
Application Theme
Brand Color
Status Color
Invoice Template
Company Profile
Business Settings
```

---

# 43. FUTURE EXTENSIBILITY

Architecture harus memungkinkan pengembangan:

```text
Customer Portal
Customer Login
Payment Gateway
WhatsApp API
Email Automation
Multi-admin
Role Permission
Multi-company
Native Mobile App
Landing Page
Marketing
```

tanpa mengharuskan rewrite total sistem.

---

# 44. MVP PRIORITY

Prioritas implementasi:

## P0 — Core

```text
Authentication
Customer
Product
Order
Payment
Invoice
Dashboard
```

## P1 — Operations

```text
Production
Shipment
Design
Review
Activity
Audit
```

## P2 — Management

```text
Reports
Export
Backup
Archive
Settings
Customization
Reminder
```

## P3 — Future

```text
Customer Portal
Payment Gateway
WhatsApp API
Email
Multi-admin
Multi-tenant
Mobile App
Landing Page
```

---

# 45. IMPLEMENTATION ROADMAP

## Phase 1 — Foundation

```text
Laravel setup
React setup
Database
Authentication
Base layout
Design system
API structure
```

---

## Phase 2 — Master Data

```text
Customer
Product
Category
Variant
Price History
Company
Settings
```

---

## Phase 3 — Transaction

```text
Order
Order Items
Pricing
Discount
Payment
Order Status
```

---

## Phase 4 — Invoice

```text
Invoice
Invoice Number
Invoice Template
PDF
Download
Branding
```

---

## Phase 5 — Operations

```text
Design
Production
Timeline
Shipment
```

---

## Phase 6 — Customer Experience

```text
Review
Rating
Testimonial
Photo
```

---

## Phase 7 — Management

```text
Dashboard
Reports
Export
Activity
Audit
```

---

## Phase 8 — Reliability

```text
Backup
Archive
Restore
Permanent Delete
Cleanup
Error Handling
```

---

## Phase 9 — Polish

```text
Responsive
Performance
UX
Accessibility
Security
Testing
```

---

# 46. DEFINITION OF DONE

FRNDLY MVP dianggap selesai jika:

```text
Admin dapat login
        ↓
Customer dapat dibuat
        ↓
Product dapat dibuat
        ↓
Order dapat dibuat
        ↓
Multiple product dapat dimasukkan
        ↓
Harga dihitung
        ↓
Discount dihitung
        ↓
Shipping dihitung
        ↓
DP dicatat
        ↓
Order diproses
        ↓
Invoice dibuat
        ↓
Invoice PDF di-download
        ↓
Production ditrack
        ↓
Shipment ditrack
        ↓
Pelunasan dicatat
        ↓
Order menjadi Lunas
        ↓
Review dibuat
        ↓
Data masuk laporan
        ↓
Data dapat dibackup
```

---

# 47. TRACEABILITY

Setiap implementation task harus dapat dikaitkan dengan requirement.

Format:

```text
FR-001
FR-002
FR-003
...
```

Contoh commit:

```text
feat: implement customer management [FR-004]
```

---

# 48. CHANGE MANAGEMENT

Jika ada permintaan fitur baru:

```text
Request
↓
Impact Analysis
↓
Requirement ID
↓
SRS Update
↓
Database Impact
↓
API Impact
↓
UI Impact
↓
Implementation
↓
Testing
```

Jangan langsung coding sebelum memahami impact jika perubahan cukup besar.

---

# 49. AI DEVELOPMENT RULE

AI yang mengembangkan FRNDLY harus:

1. Membaca SRS.
2. Membaca PRD.
3. Membaca `master-rules.md`.
4. Membaca `coding-rules.md`.
5. Memeriksa struktur project.
6. Memeriksa implementasi existing.
7. Mengidentifikasi requirement terkait.
8. Membuat implementation plan.
9. Mengimplementasikan perubahan.
10. Melakukan testing.
11. Melaporkan perubahan.

---

# 50. CONFLICT RESOLUTION

Jika terdapat konflik:

```text
Current User Requirement
        ↓
SRS
        ↓
PRD
        ↓
Master Rules
        ↓
Coding Rules
```

Requirement terbaru yang telah dikonfirmasi user dapat menjadi dasar perubahan SRS.

Namun perubahan harus didokumentasikan.

---

# 51. GOLDEN RULE

> **FRNDLY harus dibangun sebagai satu sistem bisnis yang konsisten, bukan kumpulan halaman yang berdiri sendiri.**

Customer → Order → Payment → Invoice → Production → Shipment → Review → Report harus menggunakan data yang saling terhubung.

---

# 52. FINAL REQUIREMENT PRINCIPLES

FRNDLY harus:

```text
Simple
Professional
Responsive
Secure
Maintainable
Scalable
Data-driven
Customizable
Auditable
Reliable
```

Dan yang paling penting:

> **Satu sumber data untuk setiap informasi.**

---

# 53. DOCUMENT STATUS

Dokumen ini merupakan baseline SRS FRNDLY versi:

**1.0.0**

Perubahan requirement berikutnya harus memiliki:

```text
Requirement ID
Change Description
Reason
Impact
Approval
Implementation Status
```

---

# END OF SRS

**FRNDLY — Business Management System**

> Manage the business.
> Track every order.
> Know every customer.
> Control every transaction.
