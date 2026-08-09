# FRNDLY — MASTER RULES

**Project:** FRNDLY
**Document:** Master Rules
**Version:** 1.0.0
**Status:** Active
**Authority:** Project Owner
**Primary Stack:** Laravel + React.js
**Database:** MySQL / MariaDB
**Development Environment:** Laragon
**Deployment Target:** VPS / Cloud

---

# 1. PURPOSE

Dokumen ini merupakan **aturan utama pengembangan FRNDLY**.

Master Rules menentukan bagaimana seluruh kode, database, API, frontend, security, testing, dokumentasi, dan workflow development harus dibuat.

Dokumen ini bukan Product Requirements Document.

PRD menjelaskan:

> Apa produk FRNDLY dan mengapa produk tersebut dibuat.

SRS menjelaskan:

> Apa saja kebutuhan sistem FRNDLY.

Project Context menjelaskan:

> Apa identitas dan konsep FRNDLY.

Master Rules menjelaskan:

> **Bagaimana FRNDLY harus dikembangkan.**

---

# 2. RULE HIERARCHY

Jika terdapat konflik antara berbagai dokumen, gunakan prioritas:

```text
1. Keputusan terbaru Project Owner
2. PRD
3. SRS
4. Project Context
5. Architecture Documentation
6. Master Rules
7. Coding Convention
8. AI Suggestion
```

AI tidak boleh mengubah keputusan Project Owner secara sepihak.

---

# 3. GOLDEN RULE

## Rule #1

> **Jangan mengubah business rule tanpa persetujuan Project Owner.**

Jika AI menemukan pendekatan yang lebih baik:

1. Jelaskan masalah.
2. Jelaskan alternatif.
3. Jelaskan dampak.
4. Berikan rekomendasi.
5. Tunggu persetujuan.
6. Baru implementasikan.

---

# 4. NO ASSUMPTION RULE

AI tidak boleh mengarang:

* harga,
* diskon,
* DP,
* ongkir,
* modal,
* aturan produksi,
* aturan pembayaran,
* business policy.

Jika belum ditentukan:

gunakan:

* configuration,
* placeholder,
* nullable field,
* TODO,
* atau tanyakan kepada Project Owner.

---

# 5. SINGLE SOURCE OF TRUTH

Setiap data harus memiliki satu sumber utama.

Contoh:

```text
Customer
→ customers

Product
→ products

Order
→ orders

Payment
→ payments

Invoice
→ invoices
```

Jangan menyimpan data yang sama pada banyak tabel jika tidak diperlukan.

---

# 6. HISTORICAL DATA RULE

Data transaksi harus mempertahankan kondisi ketika transaksi dibuat.

Contoh:

```text
Product price today
Rp75.000
```

Tidak boleh menyebabkan:

```text
Old Order
Rp70.000
```

berubah menjadi:

```text
Rp75.000
```

Harga transaksi harus menggunakan snapshot.

---

# 7. DATABASE RULES

## 7.1 Normalization

Database harus normalized secara wajar.

Hindari:

```text
customer_name_1
customer_name_2
customer_name_3
```

Gunakan relationship.

---

## 7.2 Foreign Key

Gunakan foreign key untuk relationship penting.

Contoh:

```text
orders.customer_id
→ customers.id
```

---

## 7.3 Index

Tambahkan index pada kolom yang sering:

* dicari,
* difilter,
* di-sort,
* digunakan sebagai foreign key.

Namun jangan membuat index berlebihan.

---

## 7.4 Naming

Gunakan:

```text
snake_case
```

Contoh:

```text
customer_id
order_date
payment_status
```

---

## 7.5 Table Name

Gunakan plural.

```text
customers
orders
products
payments
invoices
```

---

## 7.6 Primary Key

Gunakan internal ID untuk primary key.

Business identifier menggunakan field terpisah.

Contoh:

```text
id
customer_code
```

---

# 8. DATABASE MIGRATION RULE

Semua perubahan database harus melalui migration.

Jangan mengubah database production secara manual jika perubahan dapat dibuat melalui migration.

Migration harus:

* descriptive,
* reversible jika memungkinkan,
* small,
* focused.

Jangan membuat satu migration raksasa untuk seluruh sistem.

---

# 9. DESTRUCTIVE DATABASE RULE

Command seperti:

```bash
php artisan migrate:fresh
```

hanya digunakan ketika benar-benar diperlukan pada development environment.

Sebelum command destructive:

1. Berikan warning.
2. Jelaskan dampak.
3. Pastikan environment.

Jangan menjadikannya solusi default.

---

# 10. MODEL RULE

Laravel Model harus:

* memiliki relationship yang jelas,
* menggunakan casts jika diperlukan,
* menjaga business logic tetap terorganisasi.

Jangan membuat Model menjadi tempat seluruh business logic.

---

# 11. CONTROLLER RULE

Controller harus tipis.

Controller bertugas:

```text
Receive Request
↓
Validate
↓
Call Service
↓
Return Response
```

Jangan menaruh business logic panjang di Controller.

---

# 12. FORM REQUEST RULE

Validation kompleks harus berada di:

```text
Form Request
```

Contoh:

```text
StoreCustomerRequest
UpdateCustomerRequest
StoreOrderRequest
UpdateOrderRequest
```

---

# 13. SERVICE RULE

Business logic utama berada di Service.

Contoh:

```text
CustomerService
ProductService
OrderService
PaymentService
InvoiceService
ProductionService
ShipmentService
```

Service harus memiliki tanggung jawab yang jelas.

Jangan membuat:

```text
MegaService
UniversalService
EverythingService
```

---

# 14. REPOSITORY RULE

Repository digunakan ketika memberikan manfaat nyata.

Gunakan untuk:

* query kompleks,
* query reusable,
* data access abstraction,
* module yang memang membutuhkan abstraction.

Jangan membuat repository hanya karena "semua project enterprise harus menggunakan repository".

---

# 15. TRANSACTION RULE

Operasi bisnis yang mengubah beberapa tabel secara bersamaan harus menggunakan database transaction jika diperlukan.

Contoh:

```text
Create Order
↓
Create Order Items
↓
Create Payment
↓
Update Status
```

Jika salah satu gagal, sistem harus dapat rollback.

---

# 16. MONEY RULE

Nilai uang tidak boleh menggunakan floating-point untuk perhitungan finansial.

Gunakan pendekatan yang aman seperti:

```text
integer dalam satuan terkecil
```

atau decimal yang sesuai dengan kebutuhan database.

Contoh:

```text
unit_price
subtotal
discount_amount
shipping_cost
paid_amount
remaining_amount
profit
```

Harus konsisten.

---

# 17. MONEY CALCULATION RULE

Jangan melakukan perhitungan total hanya di frontend.

Frontend boleh menghitung preview.

Backend harus menghitung ulang nilai final.

Contoh:

```text
Frontend:
Rp70.000 × 100

Backend:
menghitung ulang
```

Backend adalah sumber kebenaran.

---

# 18. ORDER TOTAL RULE

Order total harus dapat ditelusuri.

Konsep:

```text
Item Subtotal
↓
Discount
↓
Shipping
↓
Grand Total
↓
DP
↓
Remaining Balance
```

Jangan menyimpan nilai total yang tidak dapat dijelaskan sumber perhitungannya.

---

# 19. PAYMENT RULE

Payment harus memiliki histori.

Jangan hanya menyimpan:

```text
order.is_paid = true
```

Gunakan transaction/payment record.

Sistem harus dapat mengetahui:

* amount,
* date,
* type,
* reference,
* status.

---

# 20. DP RULE

DP hanya dilakukan satu kali.

Sistem harus mencegah:

```text
DP 1
DP 2
DP 3
```

jika business rule tetap satu kali DP.

Final payment adalah pembayaran pelunasan.

---

# 21. STATUS RULE

Status harus menggunakan enum/value yang konsisten.

Order:

```text
draft
waiting_dp
dp_received
processing
paid
```

Jangan menggunakan berbagai variasi:

```text
DP
dp
dp_received
DP_RECEIVED
```

secara acak.

---

# 22. STATUS SEPARATION RULE

Jangan mencampur:

```text
Order Status
Payment Status
Production Status
Shipment Status
```

Contoh:

Order:

```text
processing
```

Payment:

```text
partial
```

Production:

```text
quality_control
```

Shipment:

```text
not_shipped
```

Masing-masing memiliki domain sendiri.

---

# 23. BUSINESS IDENTIFIER RULE

Gunakan business identifier:

```text
CUS-YYYYMMDD-000
ORD-YYYYMMDD-000
INV-YYYYMMDD-000
PRD-YYYYMMDD-000
```

Internal database ID tetap terpisah.

---

# 24. INVOICE NUMBER RULE

Format:

```text
INV-YYYYMMDD-000
```

Contoh:

```text
INV-20260804-001
INV-20260804-002
```

Nomor urut `000` di-reset setiap hari.

Nomor invoice harus unique.

Jangan generate invoice number hanya berdasarkan frontend.

Backend bertanggung jawab.

---

# 25. ORDER NUMBER RULE

Format:

```text
ORD-YYYYMMDD-000
```

Harus unique.

---

# 26. INVOICE IMMUTABILITY

Invoice yang sudah final tidak boleh berubah secara sembarangan karena master data berubah.

Jika terjadi perubahan penting:

gunakan mekanisme:

* void,
* revision,
* replacement invoice,

sesuai business rule yang disetujui.

---

# 27. PRODUCT RULE

Product master menyimpan kondisi produk saat ini.

Order menyimpan snapshot informasi yang diperlukan pada saat transaksi.

Jangan membuat histori order bergantung pada current product master.

---

# 28. PRODUCT VARIANT RULE

Variant dapat berupa:

* size,
* color,
* material,
* model,
* custom attribute.

Namun jangan memaksakan semua produk menggunakan field variant yang sama.

Gunakan struktur yang fleksibel.

---

# 29. QUANTITY RULE

Quantity harus mendukung:

```text
per product
```

dan:

```text
per variant
```

Contoh:

```text
Kaos

S = 20
M = 50
L = 70
XL = 30
```

Total harus dapat dihitung dengan konsisten.

---

# 30. PRICING RULE

Pricing rule dapat berdasarkan:

```text
quantity range
product
variant
customer
```

Namun nominal tetap berasal dari konfigurasi admin.

---

# 31. DISCOUNT RULE

Discount tidak boleh hardcoded tanpa keputusan bisnis.

Gunakan konfigurasi.

Contoh:

```text
discount_rules
```

AI tidak boleh menentukan:

```text
10%
15%
20%
```

tanpa instruksi.

---

# 32. PROFIT RULE

Profit harus dihitung berdasarkan data aktual.

Minimal:

```text
Revenue
-
Cost
-
Discount
-
Applicable Business Costs
=
Profit
```

Jangan menampilkan profit jika cost belum tersedia secara valid.

Jangan mengarang cost.

---

# 33. CUSTOMER RULE

Customer tidak boleh diduplikasi secara sembarangan.

Jika nomor HP/email sudah terdaftar, sistem sebaiknya membantu mendeteksi kemungkinan duplicate.

Namun jangan melakukan merge otomatis tanpa konfirmasi.

---

# 34. CUSTOMER HISTORY RULE

Customer profile harus dapat mengakses:

* order history,
* payment history,
* invoice,
* review,
* attachment,
* activity yang relevan.

---

# 35. REPEAT ORDER RULE

Repeat order harus berasal dari histori order.

Jangan menyimpan angka:

```text
repeat_order_count
```

secara manual jika dapat dihitung dengan aman.

Jika nantinya diperlukan denormalization untuk performance, dokumentasikan alasannya.

---

# 36. FILE UPLOAD RULE

Semua file upload harus:

* divalidasi,
* memiliki size limit,
* memiliki MIME validation,
* memiliki secure filename,
* tidak dieksekusi sebagai server-side code,
* disimpan pada storage yang sesuai.

Jangan percaya extension file saja.

---

# 37. ATTACHMENT RULE

Gunakan universal attachment.

Attachment dapat terkait dengan:

```text
customer
product
order
review
company
```

Gunakan polymorphic relationship jika sesuai.

---

# 38. DESIGN VERSION RULE

Design revision tidak boleh menghapus histori sebelumnya secara default.

Contoh:

```text
v1
v2
v3
Approved
```

Version aktif harus jelas.

---

# 39. SOFT DELETE RULE

Gunakan soft delete pada entity yang membutuhkan histori.

Deleted data masuk:

```text
Archive
```

---

# 40. PERMANENT DELETE RULE

Permanent deletion:

* harus eksplisit,
* harus memiliki confirmation,
* harus memiliki authorization,
* harus mempertimbangkan audit trail,
* harus mempertimbangkan relationship.

Jangan menggunakan cascade delete secara sembarangan.

---

# 41. AUDIT RULE

Aktivitas penting harus dicatat.

Minimal:

```text
who
what
when
where
before
after
```

---

# 42. AUDIT IMMUTABILITY

Audit trail tidak boleh dapat diedit oleh user biasa.

Audit record hanya dapat dibuat oleh sistem.

---

# 43. AUTO SAVE RULE

Autosave:

* tidak setiap keystroke,
* menggunakan debounce,
* hanya menyimpan data draft,
* harus memiliki timestamp,
* harus dapat dilanjutkan.

---

# 44. API RULE

Gunakan:

```text
/api/v1/
```

API harus konsisten.

Contoh:

```text
GET    /api/v1/customers
POST   /api/v1/customers
GET    /api/v1/customers/{id}
PUT    /api/v1/customers/{id}
DELETE /api/v1/customers/{id}
```

---

# 45. HTTP METHOD RULE

Gunakan HTTP method sesuai fungsi.

```text
GET
POST
PUT/PATCH
DELETE
```

Jangan menggunakan:

```text
POST /deleteCustomer
```

jika RESTful endpoint dapat digunakan.

---

# 46. API RESPONSE RULE

Response sukses:

```json
{
    "success": true,
    "message": "Customer berhasil dibuat",
    "data": {}
}
```

Error:

```json
{
    "success": false,
    "message": "Data tidak valid",
    "errors": {}
}
```

Format harus konsisten.

---

# 47. API VALIDATION RULE

Frontend validation:

**UX assistance**

Backend validation:

**Security + Data Integrity**

Frontend tidak pernah menggantikan backend validation.

---

# 48. PAGINATION RULE

Data besar harus menggunakan pagination.

Jangan mengambil seluruh:

```text
customers
orders
invoices
```

ke browser sekaligus.

---

# 49. SEARCH RULE

Search harus dilakukan secara efisien.

Jangan melakukan filtering dataset besar di browser jika database dapat melakukannya lebih baik.

---

# 50. QUERY RULE

Hindari:

```text
N+1 Query
```

Gunakan eager loading secara tepat.

Contoh:

```php
Order::with([
    'customer',
    'items.product'
])
```

Namun jangan eager-load relationship yang tidak diperlukan.

---

# 51. FRONTEND ARCHITECTURE

Frontend minimal memiliki:

```text
components/
pages/
layouts/
routes/
hooks/
services/
stores/
utils/
types/
```

Gunakan separation of concerns.

---

# 52. REACT COMPONENT RULE

Component harus memiliki satu tanggung jawab utama.

Jika component menjadi terlalu besar:

pecah menjadi reusable components.

Hindari:

```text
SuperOrderPage.jsx
```

yang memiliki ribuan baris.

---

# 53. STATE MANAGEMENT RULE

Gunakan state lokal untuk state lokal.

Gunakan global store hanya untuk state yang memang global.

Jangan memasukkan semua data aplikasi ke Zustand.

---

# 54. API SERVICE RULE

API call harus memiliki abstraction.

Contoh:

```text
customerService
orderService
productService
paymentService
invoiceService
```

Jangan menulis fetch/axios logic yang sama berulang kali pada banyak component.

---

# 55. FORM RULE

Gunakan React Hook Form untuk form kompleks.

Gunakan Zod untuk client-side schema validation jika sesuai.

Backend tetap melakukan validation final.

---

# 56. UI COMPONENT RULE

Gunakan reusable UI components.

Contoh:

```text
Button
Input
Select
Modal
Drawer
Table
Badge
Card
Dropdown
Toast
```

Jangan membuat ulang component yang sama berkali-kali.

---

# 57. POPUP RULE

FRNDLY tidak boleh menggunakan popup secara berlebihan.

Gunakan:

### Modal

Untuk:

* destructive confirmation,
* complex short action.

### Drawer

Untuk:

* quick detail,
* contextual editing.

### Toast

Untuk:

* success,
* non-critical feedback.

---

# 58. LOADING RULE

Setiap async operation harus memiliki feedback.

Contoh:

```text
Loading
Saving
Generating PDF
Uploading
Deleting
```

Button harus disabled ketika operasi penting sedang berjalan untuk mencegah duplicate request.

---

# 59. ERROR UX RULE

Error harus menjelaskan:

1. Apa yang terjadi.
2. Mengapa jika diketahui.
3. Apa yang dapat dilakukan user.

---

# 60. EMPTY STATE RULE

Tidak boleh ada halaman kosong tanpa konteks.

Contoh:

```text
Belum ada pesanan.

[+ Buat Pesanan]
```

---

# 61. RESPONSIVE RULE

Desktop:

Prioritas produktivitas.

Mobile:

Prioritas readability dan essential action.

Jangan hanya mengecilkan desktop layout untuk mobile.

---

# 62. ACCESSIBILITY RULE

Minimal:

* semantic HTML,
* keyboard navigation,
* visible focus,
* labels,
* readable contrast,
* accessible buttons.

---

# 63. SECURITY RULE

Security bukan fitur tambahan.

Security adalah default.

---

# 64. AUTHENTICATION RULE

Password:

* hashed,
* never stored plaintext,
* never logged.

Session harus aman.

---

# 65. AUTHORIZATION RULE

Walaupun MVP hanya admin:

authorization boundary harus tetap jelas.

Jangan membuat seluruh API:

```text
public
```

tanpa perlindungan.

---

# 66. MASS ASSIGNMENT RULE

Laravel `$fillable` atau `$guarded` harus digunakan dengan benar.

Jangan menerima field sensitif dari request tanpa validasi.

---

# 67. SQL INJECTION RULE

Jangan membangun query menggunakan raw user input tanpa parameter binding.

Hindari:

```php
DB::raw("... {$request->input('search')} ...")
```

tanpa sanitization/parameterization yang benar.

---

# 68. XSS RULE

Jangan render HTML dari user tanpa sanitization.

Review/testimonial customer dianggap untrusted input.

---

# 69. CSRF RULE

Gunakan mekanisme CSRF protection yang sesuai arsitektur Laravel.

---

# 70. FILE SECURITY RULE

Jangan menyimpan file upload dengan nama yang berasal langsung dari user.

Jangan mengizinkan executable files secara default.

---

# 71. SECRET RULE

Jangan commit:

```text
.env
API keys
password
secret
private credentials
production credentials
```

ke repository.

---

# 72. ENVIRONMENT RULE

Gunakan environment variables untuk:

* database credentials,
* application secrets,
* API keys,
* environment-specific configuration.

---

# 73. LARAGON RULE

Karena development menggunakan Laragon:

Sebelum instalasi:

```bash
php -v
composer -V
node -v
npm -v
```

Jika sudah tersedia:

**Jangan install ulang.**

---

# 74. LOCAL DEVELOPMENT RULE

Development environment harus dapat direproduksi.

Dokumentasikan:

* PHP version,
* Laravel version,
* Node version,
* database version,
* package versions.

---

# 75. GIT RULE

Semua perubahan penting menggunakan Git.

Commit format:

```text
feat:
fix:
refactor:
test:
docs:
chore:
```

Contoh:

```text
feat: add customer management
fix: correct order total calculation
test: add invoice generation tests
docs: update database documentation
```

---

# 76. COMMIT RULE

Satu commit sebaiknya memiliki satu tujuan.

Jangan mencampurkan:

```text
new feature
+
database redesign
+
unrelated bug fix
+
UI redesign
```

dalam satu commit tanpa alasan.

---

# 77. BRANCH RULE

Gunakan branch jika project mulai berkembang.

Contoh:

```text
main
develop
feature/customer-module
feature/order-module
fix/invoice-total
```

Untuk MVP sederhana, workflow dapat disederhanakan.

---

# 78. TESTING RULE

Fitur penting harus memiliki test.

Minimal:

```text
Feature Test
Unit Test
```

---

# 79. BUSINESS TEST RULE

Testing tidak hanya memeriksa:

```text
HTTP 200
```

Tetapi juga business rule.

Contoh:

```text
DP hanya satu kali.

Invoice number unique.

Order total benar.

Discount tidak melebihi subtotal.

Payment tidak melebihi outstanding.

Old order price tidak berubah.
```

---

# 80. INVOICE TEST RULE

Test:

```text
Invoice number

Customer data

Order items

Quantity

Price

Discount

Shipping

DP

Remaining balance

Total
```

---

# 81. PAYMENT TEST RULE

Test:

```text
DP

Final payment

Overpayment

Duplicate DP

Remaining balance

Paid status
```

---

# 82. ORDER TEST RULE

Test:

```text
Create

Update

Draft

Waiting DP

DP Received

Processing

Paid

Multi-product

Multi-variant
```

---

# 83. TEST DATA RULE

Gunakan factories/seeders untuk test data.

Jangan bergantung pada data production.

---

# 84. DOCUMENTATION RULE

Setiap perubahan arsitektur harus terdokumentasi.

Dokumentasi:

```text
docs/
```

---

# 85. CHANGELOG RULE

Perubahan requirement atau architecture penting dicatat dalam:

```text
docs/10-Changelog.md
```

Format:

```text
Date
Change
Reason
Impact
```

---

# 86. SRS CONSISTENCY RULE

Jika implementation berbeda dengan SRS:

jangan diam.

Identifikasi:

```text
SRS
vs
Implementation
```

Kemudian tentukan apakah:

* implementation salah,
* SRS perlu diperbarui,
* requirement berubah.

---

# 87. PRD CONSISTENCY RULE

Jika fitur tidak ada dalam PRD:

AI tidak boleh otomatis memasukkannya sebagai core feature.

Fitur dapat diusulkan sebagai:

**Future Feature**

---

# 88. NO FEATURE CREEP RULE

Jangan menambahkan:

* CRM kompleks,
* accounting kompleks,
* inventory kompleks,
* AI forecasting,
* payroll,
* employee management,

hanya karena "mungkin berguna".

Tetap fokus pada bisnis inti FRNDLY.

---

# 89. PERFORMANCE RULE

Performance diperhatikan sejak awal.

Prioritas:

```text
Database Query
API Response
Frontend Rendering
Asset Size
File Upload
PDF Generation
```

---

# 90. CACHING RULE

Caching digunakan jika memang diperlukan.

Jangan menambahkan Redis atau caching kompleks hanya untuk mengikuti trend.

Tambahkan ketika:

* ada bottleneck,
* query mahal,
* data cocok dicache,
* requirement membutuhkan.

---

# 91. QUEUE RULE

Queue digunakan untuk proses berat seperti:

* generate PDF dalam jumlah besar,
* backup,
* file processing,
* export besar.

Namun jangan menggunakan queue untuk operasi kecil tanpa alasan.

---

# 92. PDF RULE

Invoice PDF harus:

* konsisten,
* printable,
* memiliki branding,
* memiliki nomor invoice,
* memiliki informasi transaksi lengkap.

---

# 93. STORAGE RULE

File storage harus dipisahkan berdasarkan kategori.

Contoh:

```text
storage/
├── attachments/
├── invoices/
├── backups/
└── company/
```

Jangan menyimpan seluruh file dalam satu folder tanpa struktur.

---

# 94. BACKUP RULE

Backup database dan file harus diperlakukan sebagai dua bagian yang berbeda.

Backup database:

```text
database dump
```

Backup file:

```text
uploaded assets
```

Production backup harus mengikuti strategi VPS/cloud.

---

# 95. LOGGING RULE

Application log tidak boleh mengandung:

* password,
* token,
* secret,
* sensitive payment credential.

---

# 96. OBSERVABILITY RULE

Jika diperlukan, sistem harus dapat membantu mengetahui:

* error,
* slow query,
* failed job,
* failed request.

Logging harus membantu debugging tanpa membocorkan data sensitif.

---

# 97. API VERSIONING RULE

Gunakan:

```text
/api/v1/
```

Jika breaking change besar terjadi:

```text
/api/v2/
```

Jangan merusak API lama tanpa alasan.

---

# 98. BACKWARD COMPATIBILITY

Perubahan API/database harus mempertimbangkan data lama.

Jangan langsung menghapus field yang masih digunakan tanpa migration strategy.

---

# 99. REFACTOR RULE

Refactor dilakukan untuk:

* mengurangi duplication,
* memperbaiki architecture,
* meningkatkan readability,
* meningkatkan performance,
* meningkatkan maintainability.

Jangan refactor hanya karena AI menyukai style lain.

---

# 100. NO UNNECESSARY REWRITE

Jangan mengganti:

```text
Laravel → framework lain

React → framework lain

MySQL → database lain
```

hanya karena ada teknologi baru.

---

# 101. DEPENDENCY RULE

Sebelum menambahkan package:

jelaskan:

1. Masalah yang diselesaikan.
2. Mengapa native solution tidak cukup.
3. Maintenance impact.
4. Security impact.
5. Bundle/dependency impact.

Jangan menambah dependency hanya demi kenyamanan kecil.

---

# 102. VERSION RULE

Gunakan versi dependency yang kompatibel.

Jangan melakukan major upgrade tanpa alasan.

---

# 103. CODE QUALITY RULE

Kode harus:

* readable,
* predictable,
* maintainable,
* consistent.

Prioritaskan:

```text
Clarity > Cleverness
```

---

# 104. DRY RULE

Gunakan DRY:

**Don't Repeat Yourself**

Namun jangan melakukan abstraction berlebihan.

Gunakan prinsip:

> Duplication is sometimes cheaper than the wrong abstraction.

---

# 105. KISS RULE

Gunakan:

**Keep It Simple**

Jika masalah dapat diselesaikan dengan solusi sederhana:

gunakan solusi sederhana.

---

# 106. YAGNI RULE

Gunakan:

**You Aren't Gonna Need It**

Jangan membuat fitur:

```text
future_feature
```

sebelum benar-benar dibutuhkan.

---

# 107. FRONTEND BUSINESS LOGIC RULE

Business logic penting tidak boleh hanya berada di React.

Contoh:

```text
discount calculation
payment validation
profit calculation
invoice total
```

harus diverifikasi oleh backend.

---

# 108. SOURCE OF TRUTH RULE

Untuk business calculation:

**Backend adalah final source of truth.**

Frontend hanya membantu UX.

---

# 109. FORM SUBMISSION RULE

Untuk submit:

```text
User Input
↓
Client Validation
↓
API
↓
Server Validation
↓
Business Logic
↓
Database
```

---

# 110. ERROR RESPONSE RULE

Jangan menampilkan internal exception kepada user.

User melihat:

```text
Pesanan gagal disimpan.
Silakan periksa data yang dimasukkan.
```

Developer log menyimpan detail teknis.

---

# 111. USER EXPERIENCE RULE

User harus selalu mengetahui:

```text
What happened?
What is happening?
What should I do next?
```

---

# 112. DEADLINE RULE

Deadline order harus digunakan untuk:

* sorting,
* filtering,
* dashboard,
* reminder.

Deadline tidak boleh hanya menjadi informasi pasif.

---

# 113. REMINDER RULE

Reminder internal digunakan untuk:

* upcoming deadline,
* unpaid,
* waiting DP,
* production delay.

Tidak ada external notification pada MVP.

---

# 114. STATUS COLOR RULE

Status color berasal dari Settings jika customization tersedia.

UI component tidak boleh memiliki warna status yang tersebar di puluhan file.

Gunakan centralized configuration.

---

# 115. THEME RULE

Theme:

* primary color,
* secondary color,
* status color,

harus dikelola secara terpusat.

---

# 116. BRANDING RULE

Company branding harus berasal dari company/settings data.

Jangan hardcode:

```text
Company Name
Phone
Address
Logo
```

ke banyak component.

---

# 117. GLOBAL SEARCH RULE

Global search harus menggunakan backend query ketika dataset besar.

Frontend hanya menampilkan hasil.

---

# 118. EXPORT RULE

Export harus menggunakan filter aktif.

Contoh:

Jika user memilih:

```text
August 2026
Status = Paid
```

Export harus mengikuti filter tersebut.

---

# 119. REPORT RULE

Report tidak boleh memiliki perhitungan berbeda dengan dashboard tanpa alasan.

Jika:

```text
Revenue Dashboard = X
```

dan:

```text
Revenue Report = Y
```

maka harus ada definisi business metric yang jelas.

---

# 120. METRIC DEFINITION RULE

Setiap metric penting harus memiliki definisi.

Contoh:

**Revenue**

Apakah:

```text
total order value
```

atau:

```text
actual received payment
```

Tidak boleh ambigu.

Jika belum ditentukan:

tandai sebagai:

**Business Decision Required.**

---

# 121. DATA DISPLAY RULE

Jangan menampilkan angka yang terlihat pasti jika sumber datanya tidak valid.

Contoh:

Jika cost belum tersedia:

jangan menampilkan:

```text
Profit: Rp10.000.000
```

hanya berdasarkan asumsi.

---

# 122. MOBILE RULE

Mobile UI harus memprioritaskan:

1. View
2. Search
3. Status
4. Quick action
5. Essential editing

---

# 123. DESKTOP RULE

Desktop dapat menampilkan:

* sidebar,
* data table,
* dashboard cards,
* filters,
* multi-column layout.

---

# 124. TABLE RULE

Table harus memiliki:

* pagination,
* search,
* filter,
* sorting jika diperlukan,
* empty state,
* loading state.

---

# 125. DESTRUCTIVE ACTION RULE

Untuk:

* permanent delete,
* delete,
* cancel,
* reset,

gunakan confirmation.

Untuk operasi biasa:

jangan gunakan confirmation berlebihan.

---

# 126. SUCCESS FEEDBACK RULE

Setelah operasi berhasil:

gunakan:

* toast,
* inline success,
* status update.

Tidak selalu membutuhkan modal.

---

# 127. FILE NAME RULE

Frontend:

```text
PascalCase.jsx
```

Backend:

```text
PascalCase.php
```

Database:

```text
snake_case
```

---

# 128. CLASS NAMING

Gunakan:

```text
CustomerService
OrderService
InvoiceService
```

---

# 129. FUNCTION NAMING

Gunakan descriptive verb.

Contoh:

```text
createCustomer()
updateCustomer()
generateInvoice()
recordPayment()
calculateOrderTotal()
```

---

# 130. VARIABLE NAMING

Gunakan:

```text
camelCase
```

Contoh:

```text
customerId
orderTotal
paymentStatus
```

---

# 131. CONSTANT RULE

Business constants yang memang fixed dapat menggunakan constant/enum.

Contoh:

```text
OrderStatus
PaymentStatus
```

Jangan hardcode string status di seluruh project.

---

# 132. ENUM RULE

Gunakan enum untuk domain status yang stabil.

Contoh:

```php
OrderStatus::DRAFT
OrderStatus::WAITING_DP
OrderStatus::DP_RECEIVED
OrderStatus::PROCESSING
OrderStatus::PAID
```

---

# 133. API RESOURCE RULE

Laravel API Resources digunakan untuk mengontrol response.

Jangan return Model mentah secara sembarangan.

---

# 134. NESTED DATA RULE

API response nested harus disesuaikan kebutuhan frontend.

Jangan mengirim seluruh relationship hanya karena tersedia.

---

# 135. SECURITY + UX BALANCE

Security harus kuat tetapi tidak membuat workflow admin menjadi sulit.

Contoh:

* confirmation hanya untuk destructive action,
* authentication tetap aman,
* session timeout wajar,
* validation jelas.

---

# 136. DATA DELETION RULE

Delete tidak sama dengan permanent delete.

```text
Delete
↓
Archive

Permanent Delete
↓
Actual Removal
```

---

# 137. ARCHIVE RULE

Archive harus memungkinkan:

```text
Search
Filter
Restore
Permanent Delete
```

jika sesuai entity.

---

# 138. RESTORE RULE

Restore harus memeriksa:

* relationship,
* duplicate,
* constraint,
* current state.

---

# 139. CONCURRENCY RULE

Operasi sensitif seperti:

* payment,
* invoice number,
* order total,

harus mempertimbangkan concurrent requests.

---

# 140. DUPLICATE SUBMISSION RULE

Button submit harus mencegah double submission.

Contoh:

```text
Create Order
```

Jika user double-click:

jangan membuat dua order.

---

# 141. INTEGRITY RULE

Sistem harus menjaga:

```text
Order
Order Items
Payment
Invoice
Production
Shipment
```

tetap konsisten.

---

# 142. BUSINESS EVENT RULE

Jika suatu aksi memiliki banyak dampak:

contoh:

```text
Payment Recorded
```

maka sistem dapat memperbarui:

```text
Payment
Order Balance
Payment Status
Order Status
Activity
Dashboard metrics
```

Perubahan harus dilakukan secara konsisten.

---

# 143. SIDE EFFECT RULE

Side effect harus jelas.

Contoh:

```text
Create Invoice
```

dapat menghasilkan:

```text
Invoice record
PDF
Activity log
```

Jangan menyembunyikan side effect penting.

---

# 144. CODE REVIEW RULE

Sebelum fitur dianggap selesai, review:

```text
Correctness
Security
Performance
Readability
Maintainability
Testing
UX
```

---

# 145. AI CODING RULE

AI harus:

1. Memahami requirement.
2. Memeriksa existing code.
3. Membuat plan.
4. Menjelaskan perubahan.
5. Implementasi.
6. Test.
7. Review.
8. Dokumentasi.

---

# 146. AI MUST NOT

AI tidak boleh:

* mengarang business rules,
* mengganti framework,
* menghapus data,
* melakukan destructive migration tanpa warning,
* membuat fitur di luar scope,
* menghapus fitur lama tanpa alasan,
* mengubah API contract sembarangan,
* mengabaikan security.

---

# 147. BEFORE CODING RULE

Sebelum coding fitur besar:

berikan:

```text
Goal

Files to Create

Files to Modify

Database Impact

API Impact

Frontend Impact

Testing Impact
```

---

# 148. AFTER CODING RULE

Setelah coding:

```text
Files Created

Files Modified

Commands

Test Result

Expected Result

Potential Issues

Next Step
```

---

# 149. ERROR HANDLING WORKFLOW

Jika terjadi error:

```text
Error
↓
Identify
↓
Reproduce
↓
Root Cause
↓
Minimal Fix
↓
Test
↓
Verify
```

Jangan langsung:

```text
Reinstall Everything
```

---

# 150. ENVIRONMENT DEBUGGING

Jika error environment:

cek:

```bash
php -v
composer -V
node -v
npm -v
php artisan --version
```

dan database connectivity.

---

# 151. NO BLIND COMMAND

AI tidak boleh memberikan command berbahaya tanpa penjelasan.

Contoh:

```bash
rm -rf
php artisan migrate:fresh
DROP DATABASE
```

harus memiliki warning yang jelas.

---

# 152. PRODUCTION RULE

Development dan production harus dibedakan.

Jangan memberikan command development sebagai production command.

---

# 153. PRODUCTION DEPLOYMENT

Production target:

**VPS / Cloud**

Minimal mempertimbangkan:

* HTTPS,
* firewall,
* environment variables,
* database backup,
* file backup,
* queue,
* scheduler,
* logging,
* monitoring.

---

# 154. BACKUP RULE

Backup bukan pengganti database design yang benar.

Backup tetap harus diuji.

Idealnya:

```text
Backup
↓
Restore Test
↓
Verify
```

---

# 155. DOCUMENTATION RULE

Dokumentasi harus hidup bersama code.

Jika code berubah secara signifikan:

dokumentasi juga diperbarui.

---

# 156. CHANGELOG RULE

Setiap perubahan penting dicatat.

Contoh:

```text
2026-08-08

Added:
Customer module

Changed:
Order status flow

Fixed:
Invoice total calculation
```

---

# 157. FEATURE DEVELOPMENT WORKFLOW

Gunakan:

```text
Requirement
↓
Design
↓
Database
↓
Backend
↓
API
↓
Frontend
↓
Testing
↓
Review
↓
Documentation
```

---

# 158. MODULE DEVELOPMENT WORKFLOW

Untuk setiap modul:

```text
1. Requirement
2. Entity
3. Migration
4. Model
5. Request
6. Service
7. Repository if needed
8. Controller
9. Resource
10. Route
11. API Test
12. React Service
13. React Page
14. Components
15. Validation
16. UX
17. Test
18. Documentation
```

---

# 159. DO NOT SKIP DATABASE DESIGN

Jangan membuat frontend terlebih dahulu kemudian memaksa database mengikuti UI.

Database harus mengikuti business domain.

---

# 160. DO NOT SKIP TESTING

Jangan menyatakan:

```text
Feature complete
```

hanya karena:

```text
UI terlihat bekerja.
```

Business logic harus diuji.

---

# 161. DO NOT SKIP SECURITY

Jangan menunda:

* validation,
* authentication,
* authorization,
* upload security.

Security harus dibangun bersama fitur.

---

# 162. DO NOT OVERENGINEER

FRNDLY adalah sistem bisnis internal.

Jangan membuat:

* microservices,
* event-driven architecture kompleks,
* Kubernetes,
* distributed system,

jika belum dibutuhkan.

Untuk MVP:

**Modular Monolith Laravel + React** adalah pendekatan utama.

---

# 163. ARCHITECTURE PRINCIPLE

Gunakan:

> **Modular Monolith First**

Karena:

* lebih sederhana,
* lebih mudah dikembangkan,
* lebih mudah dideploy,
* lebih mudah di-debug,
* cocok untuk skala awal FRNDLY.

---

# 164. SCALABILITY RULE

Scalable bukan berarti kompleks.

FRNDLY harus:

```text
Simple Now
↓
Scalable Later
```

Bukan:

```text
Complex Now
↓
Maybe Useful Later
```

---

# 165. FINAL MASTER RULE

> **Build only what FRNDLY needs, build it correctly, keep the architecture clean, preserve historical data, protect business information, and never change business decisions without Project Owner approval.**

---

# 166. FINAL CHECKLIST

Sebelum sebuah fitur dianggap selesai:

```text
☐ Requirement sesuai PRD
☐ Requirement sesuai SRS
☐ Business rule tidak berubah
☐ Database benar
☐ Migration tersedia
☐ Model benar
☐ Validation tersedia
☐ Service benar
☐ Controller tipis
☐ API konsisten
☐ Frontend terintegrasi
☐ Loading state
☐ Empty state
☐ Error handling
☐ Responsive
☐ Security diperiksa
☐ Business logic tested
☐ No duplicate submission
☐ Audit diperbarui jika diperlukan
☐ Documentation diperbarui
☐ Git commit jelas
```

---

# 167. PROJECT COMPLETION RULE

FRNDLY tidak dianggap selesai hanya karena semua halaman sudah dibuat.

FRNDLY dianggap selesai ketika:

```text
Business Requirement
        ↓
Implemented
        ↓
Validated
        ↓
Tested
        ↓
Secure
        ↓
Documented
        ↓
Deployable
```

---

# 168. END OF MASTER RULES

Dokumen ini merupakan aturan teknis utama FRNDLY.

Semua AI-assisted development harus mengikuti dokumen ini.

Jika terjadi ketidakjelasan:

**Jangan mengarang.**

Jika terdapat konflik:

**Jangan mengubah secara sepihak.**

Jika ada solusi yang lebih baik:

**Jelaskan dan minta persetujuan.**

Jika ada error:

**Diagnose → Fix → Test → Verify.**

Jika ada fitur baru:

**Requirement → Design → Implement → Test → Document.**

---

**FRNDLY**

> Build simple.
> Build correctly.
> Preserve the data.
> Protect the business.
> Keep the context.
