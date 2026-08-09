# FRNDLY — PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Product Name:** FRNDLY
**Product Type:** Custom Convection Business Management System
**Document Type:** Product Requirements Document (PRD)
**Version:** 1.0.0
**Status:** Approved for Development
**Primary Platform:** Responsive Web Application
**Development Stack:** Laravel + React.js
**Development Environment:** Laragon
**Target Deployment:** VPS / Cloud
**Primary User:** Admin / Business Owner

---

# 1. PRODUCT OVERVIEW

## 1.1 Product Name

**FRNDLY**

FRNDLY adalah aplikasi web untuk membantu bisnis konveksi custom mengelola seluruh aktivitas operasional bisnis dalam satu sistem terintegrasi.

FRNDLY dirancang untuk bisnis yang menerima pesanan:

* Kaos custom
* Jaket custom
* Lanyard
* ID Card
* Atribut event
* Pakaian custom
* Produk konveksi lainnya

Model bisnis utama:

> **PO + Custom Design + Custom Production**

FRNDLY bukan marketplace dan bukan sistem e-commerce publik.

---

# 2. PRODUCT VISION

> **Menjadikan FRNDLY sebagai pusat kendali operasional bisnis konveksi custom yang sederhana, profesional, terintegrasi, dan mudah digunakan.**

FRNDLY harus memungkinkan admin mengetahui kondisi bisnis secara cepat tanpa harus mencari data dari banyak tempat.

---

# 3. PRODUCT MISSION

FRNDLY dibangun untuk:

1. Menyatukan data customer.
2. Menyatukan data produk.
3. Mengelola pesanan custom.
4. Mengelola harga dan diskon.
5. Mencatat DP dan pelunasan.
6. Mengelola proses produksi.
7. Mengelola file desain.
8. Menghasilkan invoice otomatis.
9. Mengelola pengiriman.
10. Mengumpulkan review dan testimonial.
11. Menyediakan laporan bisnis.
12. Menyediakan histori aktivitas.
13. Menyediakan backup data.
14. Mengurangi pekerjaan administratif manual.

---

# 4. PROBLEM STATEMENT

## 4.1 Masalah Utama

Bisnis konveksi custom memiliki data yang tersebar pada berbagai media.

Contoh:

```text
WhatsApp
Spreadsheet
Catatan manual
File desain
Dokumen invoice
Catatan pembayaran
Catatan produksi
```

Akibatnya:

* data sulit dicari,
* histori customer tidak terstruktur,
* status order sulit dipantau,
* pembayaran mudah terlewat,
* invoice harus dibuat manual,
* file desain sulit dilacak,
* laporan membutuhkan pekerjaan tambahan,
* repeat customer sulit diidentifikasi,
* laba sulit dihitung,
* aktivitas bisnis tidak memiliki histori yang jelas.

---

# 5. PRODUCT SOLUTION

FRNDLY menyatukan seluruh proses menjadi satu workflow.

```text
Customer
   ↓
Order
   ↓
Product
   ↓
Pricing
   ↓
Discount
   ↓
DP
   ↓
Production
   ↓
QC
   ↓
Packing
   ↓
Shipping
   ↓
Payment Completion
   ↓
Invoice
   ↓
Review / Rating / Testimonial
```

Seluruh data saling terhubung.

---

# 6. TARGET USER

## 6.1 Primary User

### Admin / Owner

Admin adalah pengguna utama FRNDLY.

Admin bertanggung jawab terhadap:

* customer,
* produk,
* order,
* pembayaran,
* produksi,
* invoice,
* pengiriman,
* laporan,
* pengaturan aplikasi.

---

## 6.2 Future User

Fitur berikut bukan bagian dari MVP:

* Customer account
* Customer portal
* Multiple admin
* Role management
* Employee account
* Sales account
* Production account

---

# 7. USER PERSONA

## Persona 1 — Business Owner

**Tujuan:**

Mengetahui kondisi bisnis dengan cepat.

Membutuhkan:

* total order,
* pendapatan,
* laba,
* pembayaran,
* deadline,
* customer,
* repeat order.

Pain point:

* terlalu banyak pencatatan manual,
* sulit mengetahui kondisi bisnis secara real-time,
* sulit membuat laporan.

---

## Persona 2 — Admin Operasional

**Tujuan:**

Memproses order dengan cepat dan akurat.

Membutuhkan:

* customer database,
* product database,
* order management,
* payment tracking,
* production tracking,
* invoice,
* attachment.

Pain point:

* data tersebar,
* sering harus membuka WhatsApp,
* kesalahan pencatatan,
* lupa status pembayaran,
* file desain sulit dilacak.

---

# 8. PRODUCT GOALS

## Goal 1 — Centralized Data

Semua data bisnis berada dalam satu sistem.

Success Indicator:

> Admin dapat menemukan data customer, order, produk, pembayaran, dan invoice tanpa membuka aplikasi lain.

---

## Goal 2 — Faster Order Management

Mempercepat proses pembuatan order.

Success Indicator:

> Admin dapat membuat order baru dengan cepat melalui satu workflow terintegrasi.

---

## Goal 3 — Payment Visibility

Admin dapat mengetahui:

* belum DP,
* DP sudah masuk,
* belum lunas,
* sudah lunas.

---

## Goal 4 — Automated Invoice

Invoice dapat dibuat secara otomatis berdasarkan order.

Success Indicator:

> Admin tidak perlu membuat invoice secara manual.

---

## Goal 5 — Production Visibility

Admin dapat mengetahui tahap produksi setiap order.

---

## Goal 6 — Business Insight

Dashboard memberikan informasi bisnis secara ringkas.

---

## Goal 7 — Historical Data

Semua perubahan penting memiliki histori.

---

# 9. NON-GOALS

FRNDLY MVP tidak bertujuan menjadi:

* Marketplace
* Online store publik
* Payment platform
* Inventory management system
* Accounting software penuh
* CRM enterprise
* ERP enterprise
* Customer portal
* Mobile application native

---

# 10. PRODUCT SCOPE

## In Scope

### Core

* Authentication
* Customer
* Product
* Pricing
* Order
* Payment
* Invoice
* Production
* Shipping
* Dashboard

### Supporting

* Review
* Rating
* Testimonial
* Attachment
* Activity Log
* Backup
* Reports
* Settings
* Company Branding

---

## Out of Scope

* Payment Gateway
* WhatsApp API
* Email Automation
* Customer Login
* Customer Portal
* Multi-admin
* Multi-role
* Multi-tenant
* Native Mobile App
* Public Landing Page

---

# 11. CORE USER JOURNEY

## 11.1 New Customer

```text
Admin Login
↓
Customer
↓
Add Customer
↓
Customer Created
```

---

# 12. ORDER CREATION JOURNEY

```text
Customer
↓
Create Order
↓
Select Product
↓
Select Variant
↓
Enter Quantity
↓
Calculate Price
↓
Apply Discount
↓
Set Deadline
↓
Upload Design
↓
Review Order
↓
Save Draft
```

Status:

```text
Draft
```

---

# 13. PAYMENT JOURNEY

```text
Order
↓
Menunggu DP
↓
Customer transfers DP
↓
Admin receives proof via WhatsApp
↓
Admin records DP
↓
DP Masuk
↓
Production
↓
Customer pays remaining balance
↓
Lunas
```

Payment gateway tidak digunakan.

---

# 14. PRODUCTION JOURNEY

```text
Order
↓
Design
↓
Approval
↓
Production
↓
Quality Control
↓
Packing
↓
Shipping
```

---

# 15. SHIPPING JOURNEY

```text
Packing
↓
Shipping
↓
Courier
↓
Tracking Number
↓
Delivered
```

---

# 16. REVIEW JOURNEY

Setelah order selesai/lunas:

```text
Order Completed
↓
Customer Review
↓
Rating 1-10
↓
Optional Testimonial
↓
Optional Photo
```

---

# 17. CUSTOMER REQUIREMENTS

Customer harus memiliki:

```text
Customer Code
Name
Phone
Email
Address
City
Province
Notes
```

Sistem harus menyimpan histori order.

---

# 18. CUSTOMER INSIGHT

Pada halaman customer, admin dapat melihat:

* total order,
* total quantity,
* total spending,
* repeat order,
* order aktif,
* order selesai,
* histori pembayaran,
* histori invoice.

---

# 19. PRODUCT REQUIREMENTS

Produk dapat berupa:

* Kaos
* Jaket
* Lanyard
* ID Card
* Event Attributes
* Custom Apparel
* Custom Accessories

Produk mendukung:

* category,
* variant,
* size,
* color,
* material,
* pricing,
* notes.

---

# 20. PRODUCT VARIATION

Contoh:

```text
Kaos

S
M
L
XL
XXL
```

Order dapat memiliki:

```text
S = 20
M = 50
L = 70
XL = 30
```

---

# 21. ORDER REQUIREMENTS

Satu order dapat memiliki banyak produk.

Contoh:

```text
Order #001

Kaos       100 pcs
Lanyard    100 pcs
ID Card    100 pcs
```

Order item memiliki:

* product,
* variant,
* quantity,
* unit price,
* discount,
* subtotal,
* notes.

---

# 22. ORDER STATUS

Status utama:

```text
Draft
Menunggu DP
DP Masuk
Proses
Lunas
```

Status warna dapat dikustomisasi melalui Settings.

---

# 23. PRICING REQUIREMENTS

Harga menggunakan:

**Unit Price**

Harga dapat memiliki aturan berdasarkan quantity.

Contoh:

```text
1-10
11-50
51-100
101+
```

Nominal ditentukan admin.

---

# 24. DISCOUNT REQUIREMENTS

Jenis diskon:

* quantity discount,
* customer discount,
* custom discount.

Nominal dan kondisi:

**Ditentukan oleh admin.**

Tidak ada hardcoded business discount.

---

# 25. PAYMENT REQUIREMENTS

Sistem harus mencatat:

* DP,
* outstanding,
* final payment,
* payment date,
* amount.

DP hanya dilakukan sekali.

---

# 26. INVOICE REQUIREMENTS

Invoice dibuat otomatis berdasarkan order.

Format:

```text
INV-YYYYMMDD-000
```

Contoh:

```text
INV-20260804-001
```

Order ID:

```text
ORD-20260804-001
```

Invoice harus dapat:

* preview,
* download PDF,
* menggunakan company branding,
* menggunakan template.

---

# 27. INVOICE CONTENT

Invoice minimal memiliki:

```text
Company Information

Invoice Number

Order ID

Customer Information

Order Date

Product

Variant

Quantity

Unit Price

Discount

Subtotal

Shipping

Total

DP

Remaining Balance

Payment Status

Notes

Footer
```

---

# 28. INVOICE TEMPLATE

Minimal menyediakan:

```text
Classic
Modern
Minimal
Professional
```

Template dapat dikembangkan.

---

# 29. DESIGN FILE REQUIREMENTS

Admin dapat menyimpan file desain.

Supported conceptual formats:

```text
JPG
PNG
PDF
SVG
AI
PSD
ZIP
```

Sistem harus memiliki:

* file validation,
* size limit,
* secure filename,
* versioning,
* metadata.

---

# 30. DESIGN REVISION

Design version:

```text
v1
v2
v3
Approved
```

Versi sebelumnya tetap memiliki histori.

---

# 31. PRODUCTION REQUIREMENTS

Production tracking harus memungkinkan admin mengetahui:

```text
Design
Approval
Production
QC
Packing
Shipping
Completed
```

Setiap perubahan penting memiliki timestamp.

---

# 32. SHIPPING REQUIREMENTS

Data pengiriman:

```text
Recipient
Address
City
Province
Courier
Tracking Number
Shipping Cost
Status
Shipped Date
Delivered Date
```

---

# 33. REVIEW REQUIREMENTS

Review hanya tersedia setelah order memenuhi kondisi selesai.

Rating:

```text
1-10
```

Review dapat memiliki:

* rating,
* comment,
* photo.

---

# 34. TESTIMONIAL REQUIREMENTS

Customer dapat memilih apakah testimonial mereka ingin diberikan.

Foto testimonial:

**optional.**

---

# 35. DASHBOARD REQUIREMENTS

Dashboard menampilkan:

### Main Metrics

* Total Orders
* Active Orders
* Waiting DP
* DP Received
* Paid Orders
* Revenue
* Profit
* Customers

### Operational Insight

* Upcoming Deadline
* Production Status
* Outstanding Payment
* Recent Orders
* Recent Activity

### Customer Insight

* New Customer
* Repeat Customer
* Top Customer

---

# 36. REPORT REQUIREMENTS

Reports:

## Sales Report

* revenue,
* order count,
* quantity.

## Customer Report

* customer count,
* repeat order,
* customer value.

## Product Report

* product sales,
* quantity,
* revenue.

## Payment Report

* DP,
* outstanding,
* paid.

## Profit Report

* revenue,
* cost,
* profit.

## Production Report

* active production,
* completed production,
* delayed production.

## Shipping Report

* shipment count,
* shipping cost,
* delivery status.

---

# 37. SEARCH REQUIREMENTS

Global Search:

```text
Ctrl + K
```

Search:

* Customer
* Product
* Order
* Invoice

Search harus cepat dan relevan.

---

# 38. FILTER REQUIREMENTS

Filter harus tersedia pada:

* Customer
* Product
* Order
* Payment
* Invoice
* Production
* Shipment
* Reports

Filter dapat berdasarkan:

* date,
* status,
* customer,
* product,
* payment,
* deadline.

---

# 39. EXPORT REQUIREMENTS

Export:

```text
PDF
CSV
Excel
```

Export harus mengikuti filter aktif.

---

# 40. ATTACHMENT REQUIREMENTS

Universal Attachment digunakan oleh:

* Customer
* Product
* Order
* Review
* Company

Attachment memiliki:

* filename,
* MIME type,
* size,
* path,
* uploader,
* created date.

---

# 41. ACTIVITY CENTER

Activity Center menampilkan aktivitas terbaru.

Contoh:

```text
Customer created

Order created

Payment received

Invoice generated

Order status changed

Product price changed
```

---

# 42. AUDIT TRAIL

Audit trail mencatat perubahan penting.

Data:

```text
User
Action
Entity
Old Value
New Value
IP
User Agent
Timestamp
```

---

# 43. AUTO SAVE

Draft order mendukung autosave.

Tujuan:

Mencegah kehilangan data ketika admin meninggalkan halaman.

Autosave menggunakan debounce/throttle.

---

# 44. ARCHIVE

Data yang dihapus secara normal menggunakan:

**Soft Delete**

Archive dapat:

* Restore
* Permanent Delete

Permanent delete membutuhkan konfirmasi.

---

# 45. BACKUP

Backup mencakup:

```text
Database
Uploaded Files
```

Admin dapat:

* create backup,
* view backup,
* download backup,
* delete backup.

---

# 46. SETTINGS

Settings memungkinkan admin mengubah:

### Application

* application name,
* logo,
* theme,
* tone color.

### Status

* status colors.

### Invoice

* invoice template,
* invoice footer,
* company information.

---

# 47. BRANDING

Company branding harus digunakan secara konsisten.

Brand identity digunakan pada:

* application UI,
* invoice,
* report,
* document.

---

# 48. UI/UX REQUIREMENTS

FRNDLY harus:

* modern,
* professional,
* clean,
* responsive,
* user friendly,
* data oriented.

---

# 49. UX PRINCIPLES

## Principle 1

Minimize unnecessary clicks.

## Principle 2

Minimize unnecessary popup.

## Principle 3

Make important information visible.

## Principle 4

Use consistent terminology.

## Principle 5

Use clear status indicators.

## Principle 6

Provide confirmation for destructive actions.

## Principle 7

Provide useful error messages.

---

# 50. RESPONSIVE REQUIREMENTS

FRNDLY harus mendukung:

```text
Desktop
Laptop
Tablet
Mobile
```

Namun informasi dashboard harus tetap terbaca dengan baik pada layar kecil.

---

# 51. SECURITY REQUIREMENTS

FRNDLY harus menerapkan:

* secure authentication,
* password hashing,
* authorization,
* request validation,
* CSRF protection,
* XSS protection,
* SQL injection prevention,
* secure file upload,
* secure session management,
* secure API.

---

# 52. PERFORMANCE REQUIREMENTS

Aplikasi harus menghindari:

* N+1 queries,
* unnecessary API calls,
* unnecessary rendering,
* oversized assets,
* inefficient database queries.

Pagination harus digunakan untuk data besar.

---

# 53. DATA INTEGRITY

Data penting harus konsisten.

Contoh:

Jika payment dicatat:

```text
Payment
↓
Order balance
↓
Payment status
↓
Dashboard
↓
Report
```

harus tetap sinkron.

---

# 54. ERROR HANDLING

Error harus:

* jelas,
* tidak teknis bagi user,
* actionable.

Contoh buruk:

```text
SQLSTATE[23000]...
```

Contoh baik:

```text
"Pembayaran tidak dapat disimpan karena jumlah pembayaran melebihi sisa tagihan."
```

Detail teknis tetap masuk log developer.

---

# 55. EMPTY STATE

Setiap halaman harus memiliki empty state.

Contoh:

```text
Belum ada customer.

+ Tambah Customer
```

Jangan menampilkan halaman kosong tanpa penjelasan.

---

# 56. LOADING STATE

Data asynchronous harus memiliki:

* skeleton,
* loading indicator,
* disabled state.

---

# 57. CONFIRMATION

Operasi destructive harus meminta konfirmasi:

* Delete
* Permanent Delete
* Restore
* Cancel Order
* Remove Attachment

Namun jangan membuat popup berlebihan untuk aktivitas normal.

---

# 58. ACCESSIBILITY

Gunakan:

* semantic HTML,
* keyboard navigation,
* readable contrast,
* accessible form labels,
* focus state.

---

# 59. SUCCESS METRICS

FRNDLY dianggap berhasil jika:

### Metric 1

Admin dapat membuat customer baru tanpa pencatatan manual tambahan.

### Metric 2

Admin dapat membuat order multi-product.

### Metric 3

Status pembayaran dapat dipantau.

### Metric 4

Invoice dapat dibuat dan di-download.

### Metric 5

Produksi dapat dipantau.

### Metric 6

Customer history dapat ditemukan dengan cepat.

### Metric 7

Dashboard dapat memberikan gambaran kondisi bisnis.

### Metric 8

Laporan dapat diekspor.

### Metric 9

Data dapat dibackup.

### Metric 10

Data historis tetap akurat ketika master data berubah.

---

# 60. MVP DEFINITION

MVP FRNDLY dianggap selesai apabila fitur berikut berjalan:

```text
Authentication
        ↓
Customer
        ↓
Product
        ↓
Pricing
        ↓
Order
        ↓
Payment
        ↓
Invoice
        ↓
Production
        ↓
Shipping
        ↓
Dashboard
        ↓
Report
```

---

# 61. MVP PRIORITY

## P0 — Critical

* Authentication
* Database
* Customer
* Product
* Order
* Payment
* Invoice

## P1 — Core

* Production
* Shipping
* Dashboard
* Reports

## P2 — Enhancement

* Review
* Rating
* Testimonial
* Activity Center
* Advanced Backup
* Advanced Analytics

## P3 — Future

* Customer Portal
* Customer Login
* Payment Gateway
* WhatsApp API
* Email Automation
* Multi Admin
* Roles
* Multi Tenant
* Mobile App
* Landing Page

---

# 62. PRODUCT ROADMAP

```text
Phase 0
Environment
        ↓
Phase 1
Project Foundation
        ↓
Phase 2
Database Foundation
        ↓
Phase 3
Authentication
        ↓
Phase 4
Master Data
        ↓
Phase 5
Core Transaction
        ↓
Phase 6
Production & Shipping
        ↓
Phase 7
Review & Testimonial
        ↓
Phase 8
Dashboard & Reports
        ↓
Phase 9
Backup & Optimization
        ↓
Phase 10
Production Deployment
```

---

# 63. FUTURE DEVELOPMENT

Setelah MVP stabil, FRNDLY dapat dikembangkan menjadi:

* Customer Portal
* Customer Login
* WhatsApp integration
* Email automation
* Payment gateway
* Multi-admin
* Role & permission
* Mobile application
* Public landing page
* Marketing integration
* Advanced analytics

Fitur tersebut tidak boleh mengganggu stabilitas MVP.

---

# 64. PRODUCT CONSTRAINTS

FRNDLY memiliki batasan:

1. Hanya admin pada MVP.
2. Tidak ada payment gateway.
3. Tidak ada WhatsApp API.
4. Tidak ada email automation.
5. Tidak ada customer login.
6. Tidak ada inventory konvensional.
7. Bisnis menggunakan PO + Custom Production.
8. Harga dan diskon ditentukan admin.
9. DP hanya satu kali.
10. Satu order dapat memiliki banyak produk.

---

# 65. PRODUCT PRINCIPLES

### Single Source of Truth

Satu data memiliki satu sumber utama.

### Historical Integrity

Transaksi lama tidak berubah karena master data berubah.

### Business First

Teknologi mengikuti kebutuhan bisnis.

### Simple by Default

Jangan membuat fitur rumit tanpa kebutuhan.

### Scalable by Design

Arsitektur harus memungkinkan pengembangan.

### Secure by Default

Keamanan harus dipikirkan sejak awal.

### Data First

Dashboard harus menonjolkan informasi.

### User Friendly

Sistem harus mudah dipahami admin.

---

# 66. PRODUCT LANGUAGE

Terminologi utama:

| Istilah     | Arti                 |
| ----------- | -------------------- |
| Customer    | Pelanggan            |
| Product     | Produk               |
| Order       | Pesanan              |
| Order Item  | Produk dalam pesanan |
| Payment     | Pembayaran           |
| DP          | Down Payment         |
| Invoice     | Bukti transaksi      |
| Production  | Proses produksi      |
| Shipment    | Pengiriman           |
| Review      | Ulasan               |
| Rating      | Nilai 1–10           |
| Testimonial | Testimoni            |
| Attachment  | File lampiran        |
| Activity    | Aktivitas            |
| Archive     | Data soft-deleted    |

Terminologi harus konsisten di:

* database,
* API,
* backend,
* frontend,
* dokumentasi,
* UI.

---

# 67. DECISION OWNERSHIP

Business decision:

**Project Owner**

Technical implementation:

**Developer / AI**

AI tidak boleh menentukan:

* harga,
* nominal diskon,
* nominal DP,
* aturan bisnis,
* kebijakan pengiriman,
* kebijakan refund,

tanpa keputusan Project Owner.

---

# 68. REQUIREMENT CHANGE MANAGEMENT

Setiap perubahan requirement harus dicatat.

Minimal:

```text
Date
Requirement
Old Behavior
New Behavior
Reason
Impact
Decision
```

Perubahan besar harus memperbarui:

* PRD,
* SRS,
* Architecture,
* Database,
* API,
* UI documentation jika relevan.

---

# 69. DEFINITION OF DONE

Sebuah fitur dianggap selesai jika:

```text
☐ Requirement jelas
☐ Database selesai
☐ Backend selesai
☐ API selesai
☐ Frontend selesai
☐ Validation selesai
☐ Error handling selesai
☐ Loading state selesai
☐ Empty state selesai
☐ Responsive selesai
☐ Security diperiksa
☐ Test selesai
☐ Dokumentasi diperbarui
☐ Tidak merusak fitur sebelumnya
```

---

# 70. FINAL PRODUCT STATEMENT

> **FRNDLY adalah sistem manajemen bisnis konveksi custom yang menyatukan customer, produk, order, pricing, pembayaran, produksi, invoice, pengiriman, review, laporan, dan histori bisnis dalam satu platform. FRNDLY dirancang sebagai aplikasi internal yang profesional, sederhana, aman, responsive, dan scalable dengan prinsip Single Source of Truth serta Historical Data Integrity.**

---

# 71. ONE-SENTENCE PRODUCT DEFINITION

> **FRNDLY adalah pusat kendali digital untuk bisnis konveksi custom dari customer masuk sampai order selesai dan tercatat sebagai histori bisnis.**

---

# 72. DOCUMENT STATUS

**Version:** 1.0.0

**Status:** Approved

**Owner:** Project Owner

**Development Model:** AI-Assisted / Vibe Coding

**Primary Stack:** Laravel + React.js

**Environment:** Laragon

**Deployment:** VPS / Cloud

**Last Updated:** 2026-08-08
