# FRNDLY — SYSTEM ARCHITECTURE

**Project:** FRNDLY
**Document:** System Architecture
**Version:** 1.0.0
**Status:** Approved Baseline
**Last Updated:** 2026-08-08
**Backend:** Laravel
**Frontend:** React.js
**Database:** MySQL / MariaDB
**Development Environment:** Laragon
**Deployment:** VPS / Cloud
**Architecture Style:** Modular Monolith
**API Style:** RESTful API

---

# 1. PURPOSE

Dokumen ini mendefinisikan arsitektur teknis FRNDLY.

Architecture document menjadi acuan untuk:

* struktur aplikasi,
* backend,
* frontend,
* database,
* API,
* authentication,
* file storage,
* business logic,
* security,
* testing,
* deployment,
* scalability,
* integration.

Dokumen ini menjawab:

> **"Bagaimana FRNDLY dibangun?"**

Sedangkan:

* `docs/01-PRD.md` → mengapa dan apa produk dibangun.
* `docs/02-SRS.md` → requirement sistem.
* `ai/master-rules.md` → aturan global AI/development.
* `ai/coding-rules.md` → aturan penulisan kode.
* `docs/03-Architecture.md` → bagaimana seluruh sistem disusun.

---

# 2. ARCHITECTURE PRINCIPLE

FRNDLY menggunakan:

> **Modular Monolith Architecture**

Bukan microservices.

Alasannya:

* FRNDLY masih single-business,
* hanya memiliki satu admin pada MVP,
* deployment lebih sederhana,
* database dapat terintegrasi,
* debugging lebih mudah,
* development lebih cepat,
* biaya VPS lebih rendah,
* tidak membutuhkan infrastructure kompleks.

Namun struktur kode harus dibuat modular agar nantinya dapat dipisahkan jika sistem berkembang.

---

# 3. HIGH-LEVEL ARCHITECTURE

Arsitektur utama:

```text
                         ┌─────────────────────┐
                         │       ADMIN         │
                         │ Desktop / Tablet    │
                         │ Mobile Browser      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      React.js       │
                         │    Frontend UI      │
                         └──────────┬──────────┘
                                    │
                              HTTP / JSON
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Laravel        │
                         │     Backend API     │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │   MySQL /   │      │ File Storage│      │    Queue    │
       │   MariaDB   │      │             │      │ / Scheduler │
       └─────────────┘      └─────────────┘      └─────────────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  Backup System  │
                            └─────────────────┘
```

---

# 4. TECHNOLOGY STACK

## 4.1 Backend

Primary:

```text
Laravel
PHP
```

Laravel bertanggung jawab atas:

* business logic,
* API,
* authentication,
* validation,
* authorization,
* database access,
* file handling,
* PDF generation,
* queue,
* scheduler,
* logging.

---

# 5. FRONTEND

Primary:

```text
React.js
```

React bertanggung jawab atas:

* UI,
* navigation,
* forms,
* tables,
* dashboard,
* filtering,
* search,
* state management,
* client-side interaction.

Frontend tidak boleh menjadi sumber business rule utama.

---

# 6. DATABASE

Primary:

```text
MySQL / MariaDB
```

Database menyimpan:

* master data,
* customer,
* order,
* payment,
* invoice,
* production,
* shipment,
* review,
* audit,
* settings.

---

# 7. DATABASE RESPONSIBILITY

Database menjadi:

> **Source of Truth**

Data transaksi tidak boleh hanya berada pada frontend state.

Contoh:

```text
React State
    ↓
Laravel API
    ↓
Database
```

Bukan:

```text
React State
    ↓
Database
```

---

# 8. STORAGE ARCHITECTURE

File tidak disimpan langsung sebagai binary di database kecuali kebutuhan khusus.

Database menyimpan metadata.

Contoh:

```text
Attachment
├── id
├── file_name
├── file_path
├── mime_type
├── size
├── uploaded_by
└── created_at
```

File:

```text
storage/
    app/
        private/
            attachments/
```

---

# 9. STORAGE DOMAINS

Storage dipisahkan berdasarkan domain:

```text
storage/
└── app/
    └── private/
        ├── attachments/
        ├── designs/
        ├── payment-proofs/
        ├── invoices/
        ├── reviews/
        └── backups/
```

File sensitif tidak boleh langsung diekspos sebagai public asset.

---

# 10. APPLICATION MODULES

FRNDLY dibagi menjadi beberapa domain.

```text
Authentication
Customer
Product
Order
Payment
Invoice
Design
Production
Shipment
Review
Reporting
Activity
Audit
Attachment
Reminder
Backup
Settings
```

---

# 11. DOMAIN DEPENDENCY

Dependency utama:

```text
Customer
   │
   ▼
Order
   │
   ├────────► Payment
   │
   ├────────► Invoice
   │
   ├────────► Design
   │
   ├────────► Production
   │
   └────────► Shipment
                 │
                 ▼
              Review
```

Reporting membaca data dari domain-domain tersebut.

---

# 12. DOMAIN RESPONSIBILITY

## Customer

Bertanggung jawab terhadap:

* customer profile,
* customer history,
* repeat order information.

---

## Product

Bertanggung jawab terhadap:

* product master,
* category,
* variants,
* pricing,
* price history.

---

## Order

Bertanggung jawab terhadap:

* order,
* order items,
* quantity,
* pricing snapshot,
* deadline,
* order status.

---

## Payment

Bertanggung jawab terhadap:

* DP,
* payment,
* payment history,
* outstanding balance.

---

## Invoice

Bertanggung jawab terhadap:

* invoice,
* invoice number,
* invoice template,
* PDF generation.

---

## Production

Bertanggung jawab terhadap:

* production status,
* production timeline,
* production events.

---

## Shipment

Bertanggung jawab terhadap:

* shipment,
* courier,
* tracking,
* shipping status.

---

## Review

Bertanggung jawab terhadap:

* rating,
* review,
* testimonial,
* testimonial photo.

---

# 13. BACKEND ARCHITECTURE

Backend menggunakan layered architecture.

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Request Validation
   ↓
Service
   ↓
Domain Logic
   ↓
Repository / Eloquent
   ↓
Model
   ↓
Database
```

---

# 14. CONTROLLER RESPONSIBILITY

Controller harus tipis.

Controller bertugas:

* menerima request,
* memanggil validation,
* memanggil service,
* mengembalikan response.

Controller tidak boleh memiliki business logic kompleks.

Contoh konsep:

```text
OrderController
    ↓
OrderService
    ↓
OrderRepository / Model
```

---

# 15. SERVICE LAYER

Service menangani business logic.

Contoh:

```text
OrderService
PaymentService
InvoiceService
ProductionService
ShipmentService
CustomerService
ProductService
```

---

# 16. BUSINESS LOGIC

Business logic harus berada pada backend.

Contoh:

```text
Quantity × Unit Price
Discount
Shipping
Grand Total
DP
Remaining Balance
Profit
```

Frontend hanya menampilkan hasil atau melakukan kalkulasi sementara untuk UX.

Final calculation harus dilakukan server.

---

# 17. DATABASE ACCESS

Laravel Eloquent menjadi primary ORM.

Query kompleks dapat menggunakan Query Builder.

Raw SQL hanya digunakan jika memang diperlukan.

---

# 18. TRANSACTION MANAGEMENT

Operasi yang memengaruhi banyak tabel harus menggunakan database transaction.

Contoh:

```text
Create Order
    ↓
Create Order Items
    ↓
Calculate Total
    ↓
Create Activity
```

Jika salah satu proses gagal:

```text
ROLLBACK
```

---

# 19. ORDER TRANSACTION

Pembuatan order harus atomic.

Konsep:

```text
BEGIN TRANSACTION

Create Order
Create Order Items
Create Snapshot
Calculate Total
Generate Order ID
Create Activity

COMMIT
```

---

# 20. PAYMENT TRANSACTION

Payment juga harus atomic.

```text
BEGIN TRANSACTION

Validate Order
Validate Payment
Create Payment
Update Payment State
Update Order State
Create Activity

COMMIT
```

---

# 21. INVOICE ARCHITECTURE

Invoice dibuat berdasarkan order.

```text
Order
   ↓
InvoiceService
   ↓
Invoice Number
   ↓
Invoice Snapshot
   ↓
PDF Renderer
   ↓
PDF File
```

---

# 22. INVOICE SNAPSHOT

Invoice harus menyimpan snapshot transaksi.

Tujuan:

Jika customer berubah:

```text
Customer Name:
A → B
```

invoice lama tidak ikut berubah.

Jika harga berubah:

```text
Rp50.000 → Rp55.000
```

invoice lama tetap menggunakan harga saat transaksi.

---

# 23. ORDER SNAPSHOT

Order item menyimpan:

```text
product_name_snapshot
unit_price_snapshot
variant_snapshot
```

agar histori transaksi tetap valid.

---

# 24. ID GENERATION

FRNDLY menggunakan human-readable ID.

Order:

```text
ORD-YYYYMMDD-000
```

Invoice:

```text
INV-YYYYMMDD-000
```

Database tetap menggunakan internal primary key.

Contoh:

```text
id = 104
order_number = ORD-20260804-001
```

---

# 25. INTERNAL PRIMARY KEY

Database menggunakan primary key internal.

Recommended:

```text
BIGINT UNSIGNED
```

Human-readable identifier bukan primary database identity utama kecuali ada alasan teknis.

---

# 26. API ARCHITECTURE

API menggunakan REST.

Base:

```text
/api
```

Contoh:

```text
/api/customers
/api/products
/api/orders
/api/payments
/api/invoices
/api/production
/api/shipments
/api/reviews
/api/reports
```

---

# 27. API RESPONSE

Response harus konsisten.

Success:

```json
{
  "success": true,
  "message": "Data berhasil disimpan.",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Data gagal disimpan.",
  "errors": {}
}
```

Format dapat disesuaikan dengan standar Laravel yang digunakan, tetapi konsistensi harus dipertahankan.

---

# 28. HTTP STATUS

Gunakan HTTP status secara benar.

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

---

# 29. FRONTEND ARCHITECTURE

Struktur konseptual:

```text
React
│
├── Pages
├── Components
├── Layouts
├── Features
├── Hooks
├── Services
├── State
├── Utils
└── Types
```

---

# 30. FEATURE-BASED FRONTEND

Komponen sebaiknya dikelompokkan berdasarkan domain.

Contoh:

```text
features/
├── customers/
├── products/
├── orders/
├── payments/
├── invoices/
├── production/
├── shipments/
├── reviews/
└── reports/
```

---

# 31. SHARED COMPONENTS

Komponen reusable:

```text
Button
Input
Select
Modal
Drawer
Table
Badge
Card
DatePicker
FileUploader
Pagination
SearchInput
FilterPanel
EmptyState
LoadingState
ConfirmDialog
```

---

# 32. DESIGN SYSTEM

FRNDLY menggunakan design system terpusat.

Design system mengatur:

* colors,
* typography,
* spacing,
* radius,
* shadows,
* buttons,
* forms,
* cards,
* tables,
* status badges.

Jangan membuat style berbeda-beda secara manual pada setiap halaman.

---

# 33. RESPONSIVE ARCHITECTURE

Breakpoint harus konsisten.

Konsep:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Layout harus adaptive.

---

# 34. STATE MANAGEMENT

State dibagi menjadi:

### Local State

Untuk:

* modal,
* input,
* temporary UI.

### Server State

Untuk:

* customers,
* orders,
* products,
* payments.

Server state harus dikelola dengan mekanisme caching/query yang konsisten.

---

# 35. FORM ARCHITECTURE

Form harus memiliki:

```text
Initial State
Validation
Submitting
Success
Error
Reset
```

Validasi frontend membantu UX.

Validasi backend tetap mandatory.

---

# 36. SEARCH ARCHITECTURE

Search dilakukan melalui backend untuk dataset besar.

Contoh:

```text
React
 ↓
GET /api/orders?search=INV-202608
 ↓
Laravel
 ↓
Database
```

---

# 37. FILTER ARCHITECTURE

Filter menggunakan query parameter.

Contoh:

```text
/api/orders?
status=processing
&customer_id=10
&date_from=2026-08-01
&date_to=2026-08-31
```

---

# 38. PAGINATION

List besar harus menggunakan pagination.

Contoh:

```text
GET /api/orders?page=1&per_page=20
```

Default `per_page` harus memiliki batas maksimum.

---

# 39. SORTING

Sorting dilakukan server-side untuk dataset besar.

Contoh:

```text
sort_by=created_at
sort_direction=desc
```

Field sorting harus di-whitelist.

---

# 40. GLOBAL SEARCH

Global search dapat memiliki aggregator:

```text
Search
├── Customer
├── Order
├── Invoice
└── Product
```

Search tidak boleh melakukan query seluruh tabel secara sembarangan tanpa batas.

---

# 41. AUTHENTICATION ARCHITECTURE

MVP hanya:

```text
Admin
```

Authentication harus melindungi:

```text
Dashboard
Customers
Products
Orders
Payments
Invoices
Reports
Settings
Backup
```

---

# 42. AUTHORIZATION

Meskipun MVP hanya satu admin, authorization boundary tetap harus dibuat.

Tujuan:

Memudahkan implementasi role di masa depan.

---

# 43. FILE UPLOAD ARCHITECTURE

Upload harus melalui:

```text
Frontend
 ↓
Laravel Validation
 ↓
File Storage
 ↓
Attachment Record
```

Validasi:

* extension,
* MIME type,
* file size,
* filename,
* storage location.

---

# 44. FILE ACCESS

File private tidak boleh diakses menggunakan direct public path.

Gunakan controlled access.

Contoh:

```text
GET /api/attachments/{id}/download
```

Backend:

```text
Authenticate
↓
Authorize
↓
Locate File
↓
Download
```

---

# 45. PDF ARCHITECTURE

PDF invoice dibuat server-side.

Flow:

```text
User Click Download
        ↓
GET Invoice
        ↓
Authorization
        ↓
InvoiceService
        ↓
Invoice Template
        ↓
PDF Generator
        ↓
Response / Stored File
```

---

# 46. QUEUE ARCHITECTURE

Queue dapat digunakan untuk pekerjaan berat.

Contoh:

```text
Generate Large Report
Generate Large PDF
Backup
File Processing
Future Notifications
```

MVP tidak harus menggunakan queue untuk semua operasi.

---

# 47. SCHEDULER

Laravel Scheduler digunakan untuk:

```text
Backup
Cleanup
Reminder
Temporary File Cleanup
Log Maintenance
```

---

# 48. ACTIVITY ARCHITECTURE

Activity dibuat ketika terjadi business event.

Contoh:

```text
OrderCreated
PaymentRecorded
InvoiceGenerated
DesignUploaded
ProductionStarted
ShipmentCreated
ReviewSubmitted
```

Activity bukan source of truth transaksi.

Activity hanya histori aktivitas.

---

# 49. AUDIT ARCHITECTURE

Audit log berbeda dari activity.

### Activity

Untuk user-facing timeline.

### Audit

Untuk system traceability.

Contoh:

```text
Activity:
"Payment dicatat."

Audit:
Admin #1 changed payment.amount
500000 → 750000
```

---

# 50. EVENT-DRIVEN INTERNAL DESIGN

FRNDLY dapat menggunakan Laravel Events/Listeners untuk aktivitas yang tidak perlu menghambat transaksi utama.

Contoh:

```text
OrderCreated
    ↓
Activity Listener
```

atau:

```text
PaymentRecorded
    ↓
Activity
    ↓
Reminder update
```

Business transaction utama tetap berada pada Service.

---

# 51. DOMAIN EVENTS

Event yang dapat digunakan:

```text
OrderCreated
OrderStatusChanged
PaymentRecorded
OrderPaid
InvoiceCreated
ProductionStarted
ProductionCompleted
ShipmentCreated
ShipmentDelivered
ReviewCreated
```

---

# 52. REPORTING ARCHITECTURE

Reporting tidak boleh mengubah data transaksi.

```text
Database
   ↓
Report Query
   ↓
Report Service
   ↓
Formatter
   ↓
PDF / Excel / CSV
```

---

# 53. PROFIT REPORTING

Profit harus menggunakan cost data yang valid.

Jangan menghitung profit hanya:

```text
Revenue - Product Master Price
```

karena harga master dapat berubah.

Gunakan historical cost/snapshot transaksi.

---

# 54. BACKUP ARCHITECTURE

Backup:

```text
Application
    ↓
Backup Service
    ↓
Database Dump
    +
File Backup
    ↓
Compressed Backup
    ↓
Storage
```

Backup tidak boleh menyimpan:

```text
.env
Production secrets
Passwords
Private keys
```

kecuali mekanisme backup terenkripsi dan memang diperlukan.

---

# 55. ARCHIVE ARCHITECTURE

Soft delete menggunakan:

```text
deleted_at
```

Data:

```text
Active
   ↓
Soft Deleted
   ↓
Archive
   ↓
Restore
   ↓
Permanent Delete
```

Permanent delete harus sangat dibatasi.

---

# 56. DATABASE RELATIONSHIP RULE

Relationship utama:

```text
Customer 1 ─── N Orders

Order 1 ─── N OrderItems

Product 1 ─── N OrderItems

Order 1 ─── N Payments

Order 1 ─── N Invoices

Order 1 ─── N Designs

Order 1 ─── 1 Production

Order 1 ─── N Shipments

Order 1 ─── N Reviews
```

Relationship final mengikuti ERD dan migration aktual.

---

# 57. DATABASE NORMALIZATION

Database mengikuti prinsip relational normalization.

Namun snapshot transaksi diperbolehkan untuk menjaga historical integrity.

Dengan demikian:

```text
Master Data
+
Transaction Snapshot
```

bukan duplikasi yang tidak terkendali.

---

# 58. CONCURRENCY

Sistem harus mempertimbangkan dua request bersamaan.

Contoh:

```text
Admin A membuat invoice
Admin B membuat invoice
```

Invoice number tidak boleh sama.

Gunakan:

* database unique constraint,
* transaction,
* locking bila diperlukan.

---

# 59. BUSINESS INVARIANTS

Beberapa kondisi harus selalu benar:

```text
Grand Total >= 0

Paid Amount >= 0

Remaining Balance >= 0

Paid Amount <= Grand Total

Invoice Number UNIQUE

Order ID UNIQUE

DP maksimal satu kali

Order Item Quantity > 0
```

Aturan final mengikuti business requirement.

---

# 60. ERROR ARCHITECTURE

Error dibagi menjadi:

### Validation Error

```text
422
```

### Authentication Error

```text
401
```

### Authorization Error

```text
403
```

### Not Found

```text
404
```

### Server Error

```text
500
```

User mendapatkan pesan sederhana.

Developer mendapatkan log detail.

---

# 61. LOGGING

Gunakan Laravel logging.

Log harus:

* structured,
* searchable,
* tidak mengandung password,
* tidak mengandung sensitive secret.

---

# 62. SECURITY LAYERS

FRNDLY memiliki beberapa lapisan:

```text
Browser
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Business Rules
 ↓
Database Constraints
 ↓
Storage Security
```

---

# 63. DATABASE SECURITY

Gunakan:

* foreign key,
* unique index,
* index,
* constraints,
* transactions.

---

# 64. API SECURITY

API harus:

* authenticated,
* validated,
* authorized,
* rate-limited jika diperlukan.

---

# 65. PASSWORD SECURITY

Password:

* tidak disimpan plaintext,
* menggunakan hashing Laravel,
* tidak masuk log,
* tidak dikembalikan melalui API.

---

# 66. SECRET MANAGEMENT

Secret disimpan pada environment.

Contoh:

```text
.env
```

Tidak boleh di-commit ke Git.

---

# 67. ENVIRONMENT ARCHITECTURE

Minimal:

```text
Local
Staging
Production
```

MVP dapat dimulai dari:

```text
Local
Production
```

Tetapi konfigurasi harus memungkinkan staging.

---

# 68. LOCAL DEVELOPMENT

Local environment:

```text
Windows
Laragon
PHP
Composer
Node.js
npm
MySQL/MariaDB
Git
```

---

# 69. LARAGON ARCHITECTURE

Laragon bertanggung jawab sebagai local development environment.

Contoh:

```text
Laragon
├── Apache / Nginx
├── PHP
├── MySQL / MariaDB
└── Development Tools
```

Laravel project berada pada directory Laragon yang telah ditentukan.

---

# 70. VERSION CONTROL

Git digunakan untuk source control.

Branch dasar:

```text
main
develop
feature/*
fix/*
```

Untuk MVP sederhana:

```text
main
feature/*
```

juga diperbolehkan.

---

# 71. REPOSITORY STRUCTURE

Konsep repository:

```text
FRNDLY/
│
├── app/
├── bootstrap/
├── config/
├── database/
├── public/
├── resources/
├── routes/
├── storage/
├── tests/
│
├── docs/
│   ├── PRD.md
│   ├── SRS.md
│   ├── Architecture.md
│   ├── master-rules.md
│   └── coding-rules.md
│
├── .env
├── .env.example
├── artisan
├── composer.json
├── package.json
└── README.md
```

---

# 72. BACKEND DOMAIN STRUCTURE

Domain logic dapat diorganisasi:

```text
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
│
├── Models/
│
├── Services/
│
├── Actions/
│
├── Events/
│
├── Listeners/
│
├── Policies/
│
└── Support/
```

Jika project semakin besar, domain-based structure dapat digunakan:

```text
app/
└── Domains/
    ├── Customer/
    ├── Product/
    ├── Order/
    ├── Payment/
    ├── Invoice/
    ├── Production/
    ├── Shipment/
    └── Review/
```

Pemilihan final harus konsisten dan tidak mencampurkan dua pola tanpa alasan.

---

# 73. RECOMMENDED BACKEND PATTERN

Untuk FRNDLY:

```text
Controller
    ↓
Form Request
    ↓
Service
    ↓
Model / Query
    ↓
Database
```

Untuk proses kompleks:

```text
Controller
    ↓
Form Request
    ↓
Service
    ↓
Action
    ↓
Model
```

---

# 74. REACT STRUCTURE

Recommended:

```text
resources/js/
│
├── app/
├── components/
├── layouts/
├── pages/
├── features/
│   ├── customers/
│   ├── products/
│   ├── orders/
│   ├── payments/
│   ├── invoices/
│   ├── production/
│   ├── shipments/
│   └── reviews/
│
├── hooks/
├── services/
├── utils/
├── types/
└── styles/
```

---

# 75. API SERVICE STRUCTURE

Frontend tidak melakukan fetch API secara acak.

Gunakan centralized service.

Contoh:

```text
services/
├── apiClient.js
├── customerService.js
├── productService.js
├── orderService.js
├── paymentService.js
└── invoiceService.js
```

---

# 76. ROUTING

Frontend routing harus menggunakan struktur yang konsisten.

Contoh:

```text
/dashboard

/customers
/customers/:id

/products
/products/:id

/orders
/orders/:id

/invoices
/invoices/:id

/production
/shipments

/reviews

/reports

/settings
```

---

# 77. API ROUTING

Contoh:

```text
GET    /api/customers
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
DELETE /api/customers/{id}
```

Untuk order:

```text
GET    /api/orders
POST   /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}
DELETE /api/orders/{id}
```

---

# 78. DATABASE MIGRATION

Semua perubahan schema harus melalui migration.

Jangan mengubah production database secara manual tanpa migration.

---

# 79. DATABASE SEEDING

Seeder digunakan untuk:

* admin development,
* product sample,
* categories,
* settings,
* development data.

Production seeder harus digunakan dengan hati-hati.

---

# 80. DATABASE INDEXING

Index harus dibuat untuk field yang sering:

* searched,
* filtered,
* joined,
* sorted.

Contoh:

```text
customer_id
order_number
invoice_number
status
created_at
deadline
```

Jangan membuat index berlebihan.

---

# 81. CACHING

Caching dapat digunakan untuk:

* settings,
* product categories,
* application configuration,
* dashboard aggregate tertentu.

Data transaksi yang sering berubah tidak boleh di-cache sembarangan.

---

# 82. PERFORMANCE STRATEGY

Prinsip:

```text
Measure
↓
Identify Bottleneck
↓
Optimize
↓
Measure Again
```

Hindari premature optimization.

---

# 83. N+1 PREVENTION

Laravel relationship harus menggunakan eager loading bila diperlukan.

Contoh konsep:

```text
Order
 ├── Customer
 ├── Items
 └── Payments
```

Jangan melakukan query tambahan untuk setiap row jika dapat dihindari.

---

# 84. API PAGINATION

API list harus menggunakan pagination.

Frontend tidak boleh meminta seluruh database sekaligus.

---

# 85. LARGE REPORT

Report besar harus:

* menggunakan query teroptimasi,
* menggunakan queue jika diperlukan,
* tidak membuat request HTTP terlalu lama.

---

# 86. OBSERVABILITY

Production minimal memiliki:

```text
Application Log
Error Log
Audit Log
Activity Log
Backup Log
```

---

# 87. DEPLOYMENT ARCHITECTURE

Target:

```text
                    Internet
                       │
                       ▼
                ┌─────────────┐
                │    VPS      │
                │             │
                │ Web Server  │
                │     ↓       │
                │  Laravel    │
                │     ↓       │
                │ MySQL       │
                │     ↓       │
                │  Storage    │
                └─────────────┘
```

---

# 88. PRODUCTION SERVICES

Production minimal:

```text
Web Server
PHP
Laravel
Database
Storage
Queue Worker jika diperlukan
Scheduler
SSL
Backup
```

---

# 89. DOMAIN / HTTPS

Production harus menggunakan HTTPS.

---

# 90. DATABASE BACKUP

Backup database harus dilakukan secara berkala.

Backup harus disimpan pada lokasi yang berbeda dari database production jika memungkinkan.

---

# 91. DISASTER RECOVERY

Jika production gagal:

```text
Provision Server
↓
Install Dependencies
↓
Deploy Code
↓
Configure Environment
↓
Restore Database
↓
Restore Storage
↓
Run Migration
↓
Verify
```

---

# 92. SCALABILITY

Tahap awal:

```text
1 VPS
1 Laravel Application
1 Database
```

Jika berkembang:

```text
Load Balancer
      ↓
App Server 1
App Server 2
      ↓
Database
      ↓
Object Storage
      ↓
Redis
```

Tidak perlu diterapkan sejak MVP.

---

# 93. FUTURE MICROSERVICE POSSIBILITY

Jika FRNDLY berkembang besar, domain dapat dipisahkan:

```text
Order Service
Payment Service
Invoice Service
Notification Service
Reporting Service
```

Namun:

> **Tidak dilakukan pada MVP.**

---

# 94. ARCHITECTURAL CONSTRAINTS

FRNDLY tidak boleh:

* menggunakan microservices tanpa kebutuhan,
* menyimpan business logic utama di React,
* menyimpan password plaintext,
* menyimpan secret di Git,
* mengandalkan frontend untuk validasi keamanan,
* mengubah transaction history secara sembarangan,
* membuat duplicate source of truth.

---

# 95. ARCHITECTURAL GOLDEN RULES

## Rule 1

> Backend adalah penjaga business rule.

## Rule 2

> Database adalah source of truth.

## Rule 3

> React adalah presentation layer.

## Rule 4

> Transaction harus atomic.

## Rule 5

> Historical transaction harus immutable secara logis.

## Rule 6

> File sensitif harus private.

## Rule 7

> Semua perubahan schema melalui migration.

## Rule 8

> Semua fitur harus dapat ditest.

## Rule 9

> Jangan membuat abstraction sebelum diperlukan.

## Rule 10

> Jangan over-engineer MVP.

---

# 96. ARCHITECTURE DECISION RECORD

Keputusan penting harus dicatat.

Format:

```text
ADR-001
Title:
Decision:
Context:
Reason:
Alternatives:
Consequences:
Date:
```

---

# 97. INITIAL ARCHITECTURE DECISIONS

## ADR-001 — Modular Monolith

**Decision:** Menggunakan Modular Monolith.

**Reason:** Sesuai skala FRNDLY MVP.

---

## ADR-002 — Laravel Backend

**Decision:** Laravel sebagai backend.

**Reason:**

* mature,
* secure,
* ecosystem kuat,
* database support,
* authentication,
* queue,
* scheduler,
* storage.

---

## ADR-003 — React Frontend

**Decision:** React.js.

**Reason:**

* component-based,
* responsive UI,
* scalable frontend,
* ecosystem luas.

---

## ADR-004 — MySQL/MariaDB

**Decision:** MySQL/MariaDB.

**Reason:**

* cocok dengan Laravel,
* tersedia melalui Laragon,
* relational database cocok untuk FRNDLY.

---

## ADR-005 — No Payment Gateway

**Decision:** Payment gateway ditunda.

**Reason:** Pembayaran sementara dilakukan melalui WhatsApp dan hanya dicatat di FRNDLY.

---

## ADR-006 — No Stock Management

**Decision:** Stock inventory konvensional tidak digunakan.

**Reason:** FRNDLY menggunakan model PO/custom.

---

## ADR-007 — Human-readable Order ID

**Decision:**

```text
ORD-YYYYMMDD-000
```

**Reason:** mudah dibaca dan digunakan secara operasional.

---

## ADR-008 — Human-readable Invoice Number

**Decision:**

```text
INV-YYYYMMDD-000
```

---

# 98. ARCHITECTURE EVOLUTION

Architecture dapat berubah jika:

* jumlah user meningkat,
* transaksi meningkat,
* performance bottleneck ditemukan,
* requirement berubah,
* security requirement berubah.

Namun perubahan harus:

```text
Identify
↓
Evaluate
↓
Document
↓
Approve
↓
Implement
↓
Test
```

---

# 99. FINAL ARCHITECTURE

Arsitektur FRNDLY:

```text
                         ADMIN
                           │
                           ▼
                     React.js UI
                           │
                           ▼
                    Laravel API
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      Services         Events           Policies
          │                │
          ▼                ▼
       Eloquent        Activities
          │             / Audit
          ▼
     MySQL/MariaDB
          │
          ├───────────────┐
          ▼               ▼
     File Storage      Reports
          │
          ▼
       Backup
```

Domain:

```text
Customer
Product
Order
Payment
Invoice
Design
Production
Shipment
Review
Reporting
Activity
Audit
Attachment
Backup
Settings
```

---

# 100. FINAL PRINCIPLE

FRNDLY harus dibangun dengan prinsip:

> **Simple enough to build, structured enough to scale.**

Tidak dibuat terlalu kompleks pada tahap awal, tetapi setiap keputusan teknis harus memberikan ruang untuk perkembangan FRNDLY di masa depan.

---

# END OF ARCHITECTURE

**FRNDLY — Business Management System**

Architecture Baseline v1.0.0
