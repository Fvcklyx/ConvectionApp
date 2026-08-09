# FRNDLY — MASTER PROJECT CONTEXT

> **Dokumen ini adalah sumber utama pemahaman proyek FRNDLY.**
>
> Seluruh AI, developer, dan sistem yang mengembangkan FRNDLY harus memahami dokumen ini sebelum melakukan perubahan terhadap sistem.
>
> Jika terdapat konflik antara implementasi dan dokumen ini, jangan mengubah konsep FRNDLY secara sepihak. Identifikasi konflik, jelaskan dampaknya, dan minta keputusan dari Project Owner.

---

# 1. IDENTITAS PROYEK

## Nama

**FRNDLY**

## Jenis

Web-based Business Management System untuk bisnis konveksi custom.

## Fokus

FRNDLY adalah aplikasi internal untuk membantu pemilik bisnis mengelola:

* Customer
* Produk
* Pesanan
* Harga
* Diskon
* Pembayaran
* Produksi
* Invoice
* Pengiriman
* File desain
* Review
* Rating
* Testimoni
* Laporan
* Backup
* Aktivitas
* Pengaturan perusahaan

FRNDLY bukan marketplace dan bukan platform e-commerce publik.

---

# 2. LATAR BELAKANG

Bisnis FRNDLY bergerak di bidang **konveksi dan custom production**.

Produk yang dapat dipesan antara lain:

* Kaos
* Jaket
* Lanyard
* ID Card
* Atribut event
* Pakaian custom
* Produk dan atribut konveksi lainnya

Karakteristik bisnis:

**PO + Custom Design + Custom Production**

Artinya produk dibuat berdasarkan pesanan customer.

Karena itu FRNDLY tidak berfokus pada inventory/stok konvensional.

---

# 3. MASALAH YANG INGIN DISELESAIKAN

Sebelum FRNDLY, data bisnis berpotensi tersebar pada:

* WhatsApp
* Spreadsheet
* catatan manual
* file desain
* dokumen invoice
* catatan pembayaran
* catatan produksi

Hal tersebut menyebabkan:

* sulit mengetahui histori customer,
* sulit mengetahui order yang belum selesai,
* sulit mengetahui status pembayaran,
* sulit mengetahui total pendapatan,
* sulit menghitung laba,
* sulit melacak produksi,
* sulit mencari invoice,
* sulit melacak file desain,
* sulit melihat repeat customer,
* sulit membuat laporan.

FRNDLY menyatukan informasi tersebut dalam satu sistem.

---

# 4. VISI FRNDLY

Visi utama:

> **Menjadi pusat kendali operasional bisnis konveksi custom dalam satu aplikasi yang sederhana, profesional, dan mudah digunakan.**

FRNDLY harus membuat admin dapat melihat kondisi bisnis tanpa harus membuka banyak aplikasi.

---

# 5. PRINSIP UTAMA

## 5.1 Single Source of Truth

Setiap informasi memiliki sumber utama.

Contoh:

Customer:

```text
customers
```

Order:

```text
orders
```

Produk:

```text
products
```

Pembayaran:

```text
payments
```

Invoice:

```text
invoices
```

Jangan menyimpan data yang sama di banyak tempat tanpa alasan.

---

# 6. DATA TRANSACTIONAL VS MASTER DATA

FRNDLY membedakan:

## Master Data

Data yang menjadi referensi:

* Customer
* Product
* Company
* Settings
* Pricing Rules
* Discount Rules

## Transaction Data

Data yang merepresentasikan kejadian bisnis:

* Order
* Payment
* Invoice
* Production
* Shipment
* Review

Perubahan master data tidak boleh merusak histori transaksi.

---

# 7. PRINSIP HISTORICAL DATA

Data transaksi harus mempertahankan kondisi ketika transaksi terjadi.

Contoh:

Customer membeli:

```text
Kaos
Quantity: 100
Harga: Rp70.000
```

Beberapa bulan kemudian harga produk berubah menjadi:

```text
Rp75.000
```

Order lama tetap menggunakan:

```text
Rp70.000
```

Karena harga transaksi merupakan historical snapshot.

---

# 8. TARGET USER

Untuk MVP:

**Admin / Owner**

Hanya terdapat satu jenis pengguna.

Tidak ada:

* customer login,
* customer portal,
* multi-admin,
* role management.

Fitur tersebut dapat dikembangkan kemudian.

---

# 9. PLATFORM

FRNDLY merupakan:

**Responsive Web Application**

Harus nyaman digunakan melalui:

* Desktop
* Laptop
* Tablet
* Smartphone

Namun fokus utama UI tetap pada penggunaan administrasi bisnis.

---

# 10. DEVELOPMENT STACK

## Backend

Laravel

PHP

REST API

Laravel Sanctum

Service Layer

Repository Pattern jika memang diperlukan

Modular Architecture

---

## Frontend

React.js

Vite

Tailwind CSS

shadcn/ui

---

## Database

MySQL / MariaDB

Development environment:

**Laragon**

Database dapat dikelola melalui:

* phpMyAdmin
* HeidiSQL
* MySQL CLI

---

## Production

VPS / Cloud

Target environment:

Linux server

---

# 11. ARSITEKTUR

Arsitektur utama:

```text
User
 │
 ▼
React.js
 │
 ▼
REST API
 │
 ▼
Laravel
 │
 ├── Controller
 │
 ├── Form Request
 │
 ├── Service
 │
 ├── Repository
 │
 ├── Model
 │
 ▼
MySQL / MariaDB
```

Frontend tidak boleh mengakses database secara langsung.

---

# 12. MODUL UTAMA

FRNDLY terdiri dari modul:

```text
Dashboard
Customer
Product
Order
Payment
Production
Invoice
Shipment
Review
Report
Company
Setting
Attachment
Activity
Backup
```

---

# 13. DASHBOARD

Dashboard adalah pusat informasi FRNDLY.

Dashboard harus memberikan overview singkat mengenai kondisi bisnis.

Informasi utama:

* Total orders
* Active orders
* Orders belum selesai
* Orders menunggu pembayaran
* Orders DP
* Orders lunas
* Revenue
* Profit
* Customer
* Repeat customer
* Deadline
* Production status
* Recent activity

Dashboard juga memiliki quick action.

Namun:

> **Data tetap menjadi fokus utama, bukan dekorasi.**

---

# 14. CUSTOMER MODULE

Customer menyimpan:

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

Customer dapat memiliki banyak order.

Sistem harus dapat menunjukkan:

* total order,
* total quantity,
* total transaksi,
* repeat order,
* order terakhir,
* order aktif,
* histori pembayaran.

---

# 15. REPEAT CUSTOMER

FRNDLY harus dapat mengetahui berapa kali customer melakukan order.

Contoh:

```text
Customer A

Order #001
Order #002
Order #003
Order #004
```

Maka:

```text
Repeat Order Count = 4
```

Informasi tersebut nantinya dapat digunakan untuk:

* analisis customer,
* segmentasi,
* diskon,
* dashboard.

---

# 16. PRODUCT MODULE

Produk FRNDLY adalah produk custom.

Contoh:

```text
Kaos
Jaket
Lanyard
ID Card
Atribut Event
```

Produk dapat memiliki variasi.

Contoh:

```text
Kaos

S
M
L
XL
XXL
```

---

# 17. QUANTITY PER VARIANT

Quantity harus dapat dicatat berdasarkan variasi.

Contoh:

```text
S   = 20
M   = 50
L   = 70
XL  = 30
```

Total:

```text
170 pcs
```

Database harus mampu merepresentasikan struktur tersebut.

---

# 18. PRICING

Harga menggunakan:

**Unit Price**

Contoh:

```text
Quantity = 100
Unit Price = Rp70.000
Subtotal = Rp7.000.000
```

Harga dapat dipengaruhi quantity.

Contoh struktur:

```text
1–10
11–50
51–100
101+
```

Namun:

> Nominal aktual ditentukan oleh admin.

AI tidak boleh mengarang nominal harga.

---

# 19. DISCOUNT

FRNDLY mendukung:

* quantity discount,
* customer discount,
* custom discount.

Jenis diskon dapat ditentukan sistem.

Tetapi:

> Nominal dan kondisi diskon ditentukan oleh admin.

Jangan membuat angka bisnis secara otomatis.

---

# 20. ORDER

Order dapat memiliki lebih dari satu produk.

Contoh:

```text
Order #001

Kaos
100 pcs

Lanyard
100 pcs

ID Card
100 pcs
```

Satu invoice dapat berisi banyak produk.

---

# 21. ORDER STATUS

Status utama:

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

Status harus sederhana bagi pengguna.

Namun proses produksi dapat memiliki status internal yang lebih detail.

---

# 22. PAYMENT

FRNDLY tidak menggunakan payment gateway pada MVP.

Pembayaran dilakukan melalui:

**WhatsApp**

Customer mengirim bukti pembayaran kepada admin.

Admin kemudian mencatat pembayaran di FRNDLY.

---

# 23. DP

DP hanya dilakukan:

**satu kali.**

Flow:

```text
Order
↓
Menunggu DP
↓
DP Masuk
↓
Proses
↓
Lunas
```

Nominal DP tidak boleh diasumsikan oleh AI.

---

# 24. INVOICE

FRNDLY dapat membuat invoice otomatis dari data order.

Invoice berisi:

* informasi perusahaan,
* customer,
* nomor invoice,
* order ID,
* tanggal,
* produk,
* quantity,
* variasi,
* unit price,
* subtotal,
* discount,
* shipping,
* DP,
* outstanding,
* total,
* catatan,
* informasi pembayaran.

Invoice berupa:

**PDF**

Format invoice:

**Text-based professional nota**

Tidak membutuhkan foto produk.

---

# 25. INVOICE NUMBER

Format:

```text
INV-YYYYMMDD-000
```

Contoh:

```text
INV-20260804-001
```

Order memiliki ID terpisah:

```text
ORD-20260804-001
```

Invoice dan Order ID tidak boleh disamakan.

---

# 26. INVOICE TEMPLATE

FRNDLY mendukung beberapa template invoice.

Contoh:

```text
Classic
Modern
Minimal
Professional
```

Template harus tetap mempertahankan informasi bisnis yang diwajibkan.

---

# 27. COMPANY BRANDING

Branding perusahaan merupakan bagian penting FRNDLY.

Informasi:

```text
Company Name
Logo
Phone
Email
Address
City
Province
Social Media
```

Branding dapat digunakan pada:

* invoice,
* dashboard,
* aplikasi,
* dokumen.

---

# 28. PRODUCTION MANAGEMENT

Order custom membutuhkan proses produksi.

FRNDLY menyediakan production timeline.

Contoh:

```text
Order Created
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
↓
Completed
```

---

# 29. DESIGN FILE

FRNDLY mendukung attachment file desain.

File dapat dikaitkan dengan:

* Order
* Product
* Customer
* Review
* Company

Attachment menggunakan sistem universal.

---

# 30. DESIGN REVISION

File desain memiliki histori revisi.

Contoh:

```text
Design v1
↓
Revision
↓
Design v2
↓
Revision
↓
Design v3
↓
Approved
```

Versi lama tidak boleh hilang tanpa proses penghapusan yang disengaja.

---

# 31. SHIPPING

FRNDLY memiliki pengelolaan pengiriman.

Informasi:

```text
Shipping Address
City
Province
Courier
Tracking Number
Shipping Cost
Shipping Status
```

Ongkir dipisahkan dari harga produk.

---

# 32. REVIEW

Review diberikan setelah order memenuhi kondisi selesai/lunas sesuai aturan sistem.

Rating menggunakan skala:

```text
1–10
```

Review dapat berupa:

```text
Rating
Comment
```

---

# 33. TESTIMONIAL

Customer dapat memberikan testimonial.

Customer juga dapat mengunggah foto secara opsional.

Konsep dibuat seperti pengalaman review pada online shop.

---

# 34. REPORT

FRNDLY menyediakan laporan:

* sales,
* order,
* payment,
* profit,
* customer,
* product,
* production,
* shipping,
* review.

Export:

```text
PDF
CSV
Excel
```

Filter harus ikut diterapkan pada export.

---

# 35. PROFIT

Profit dihitung berdasarkan data transaksi dan modal.

Secara konseptual:

```text
Revenue
-
Production Cost
-
Discount
-
Business Costs yang relevan
=
Profit
```

Modal produk dapat menggunakan rentang quantity.

Nominal ditentukan admin.

---

# 36. PRICE HISTORY

Perubahan harga harus memiliki histori.

Contoh:

```text
2026-01
Rp65.000

2026-05
Rp70.000

2026-08
Rp75.000
```

Order lama tidak boleh berubah karena perubahan harga baru.

---

# 37. SOFT DELETE

Data tertentu menggunakan soft delete.

Data masuk ke:

**Archive**

Admin dapat:

```text
Restore
Permanent Delete
```

Permanent delete harus lebih ketat.

Data audit tidak boleh dihapus secara sembarangan.

---

# 38. AUDIT TRAIL

Sistem mencatat aktivitas penting.

Contoh:

```text
Customer created

Order created

Order updated

Payment recorded

Invoice generated

Product price changed

Order deleted
```

Audit minimal:

```text
User
Action
Subject
Old Values
New Values
IP
User Agent
Timestamp
```

---

# 39. AUTO SAVE

Draft order harus mendukung autosave.

Tujuannya:

Jika admin keluar dari halaman sebelum menyelesaikan order:

data tidak langsung hilang.

Autosave menggunakan mekanisme yang efisien dan tidak melakukan request pada setiap keystroke.

---

# 40. ACTIVITY CENTER

Activity Center menunjukkan aktivitas terbaru.

Contoh:

```text
Order #001 mendapatkan DP.

Invoice INV-20260804-001 dibuat.

Customer baru ditambahkan.

Harga Kaos diperbarui.
```

---

# 41. GLOBAL SEARCH

Global search harus dapat mencari:

```text
Customer
Order
Invoice
Product
```

Shortcut yang direncanakan:

```text
Ctrl + K
```

---

# 42. FILTER

FRNDLY menggunakan filter yang lengkap.

Customer:

```text
Status
Tanggal
Jumlah Order
```

Order:

```text
Status
Customer
Tanggal
Deadline
Payment Status
```

Product:

```text
Category
Variant
Price
```

Report:

```text
Date Range
Customer
Product
Status
```

---

# 43. DEADLINE

Order memiliki deadline.

Deadline digunakan untuk:

* dashboard,
* filter,
* production planning,
* reminder internal.

---

# 44. REMINDER

FRNDLY dapat memberikan reminder internal.

Contoh:

```text
Order mendekati deadline.

Order belum menerima DP.

Order belum dilunasi.

Produksi belum selesai.
```

Notifikasi eksternal belum digunakan.

---

# 45. NOTIFICATION

Untuk MVP:

Tidak menggunakan:

* WhatsApp API
* Email automation
* Push notification eksternal.

Reminder cukup berada di dalam aplikasi.

---

# 46. BACKUP

Backup wajib tersedia.

Minimal:

```text
Database
Uploaded Files
```

Backup harus dapat:

```text
Create
View
Download
Delete
```

---

# 47. SETTINGS

Admin dapat mengubah:

```text
Application Name
Logo
Theme
Primary Color
Secondary Color
Status Color
Invoice Template
Company Information
Invoice Footer
Preferences
```

---

# 48. STATUS COLOR

Status dapat memiliki warna yang dapat dikustomisasi.

Contoh:

```text
Draft
Waiting DP
DP Received
Process
Paid
```

Warna tidak boleh hardcoded secara permanen jika admin memang diperbolehkan mengubahnya.

---

# 49. UI/UX PHILOSOPHY

FRNDLY harus terasa:

**Professional + Friendly + Clean + Efficient**

Prinsip:

* sederhana,
* modern,
* tidak ramai,
* mudah dipahami,
* data-centric,
* responsive.

Hindari:

* popup berlebihan,
* animasi berlebihan,
* dekorasi yang tidak berguna,
* dashboard yang terlalu penuh.

---

# 50. NAVIGATION

Struktur navigasi konseptual:

```text
Dashboard

Customers

Products

Orders

Production

Payments

Invoices

Shipments

Reviews

Reports

Activity

Settings

Backup
```

Struktur final dapat disesuaikan saat implementasi UI selama tidak mengubah fungsi bisnis.

---

# 51. MVP

Prioritas MVP:

```text
1. Authentication
2. Company
3. Customer
4. Product
5. Pricing
6. Order
7. Payment
8. Invoice
9. Production
10. Shipping
11. Dashboard
12. Report
```

Setelah stabil:

```text
Review
Testimonial
Advanced Analytics
Backup Enhancement
Advanced Activity
```

---

# 52. FITUR YANG DITUNDA

Jangan implementasikan tanpa persetujuan:

```text
Customer Portal
Customer Login
Payment Gateway
WhatsApp API
Email Automation
Multi Admin
Role & Permission System
Multi Tenant
Native Mobile App
Public Landing Page
Marketing Website
```

Fitur tersebut bukan bagian dari MVP.

---

# 53. INVENTORY

FRNDLY **tidak menggunakan inventory management konvensional sebagai core feature.**

Alasan:

Bisnis menggunakan:

**PO + Custom Production**

Bukan:

**Stock-based retail.**

Jangan membuat sistem:

```text
Stock In
Stock Out
Warehouse
Inventory Ledger
```

sebagai fitur inti tanpa requirement baru.

---

# 54. DATA RELATIONSHIP KONSEPTUAL

Relationship utama:

```text
Customer
   │
   └── Orders
          │
          ├── Order Items
          │       │
          │       └── Products
          │
          ├── Payments
          │
          ├── Invoice
          │
          ├── Production
          │
          ├── Shipment
          │
          ├── Attachments
          │
          └── Review
```

---

# 55. CORE DATABASE ENTITIES

Entity utama:

```text
users
companies
settings

customers

products
product_variants
pricing_rules
discount_rules
price_histories

orders
order_items
order_item_variants

production_stages
production_histories

payments
invoices

shipments

reviews

attachments

activity_logs
backups
```

Entity baru tidak boleh ditambahkan hanya karena AI merasa "seharusnya ada".

Harus ada alasan bisnis/teknis.

---

# 56. IDENTIFIER

Database menggunakan:

```text
id
```

sebagai internal primary key.

Public identifier menggunakan kode bisnis.

Customer:

```text
CUS-YYYYMMDD-000
```

Order:

```text
ORD-YYYYMMDD-000
```

Invoice:

```text
INV-YYYYMMDD-000
```

Product:

```text
PRD-YYYYMMDD-000
```

Internal database ID tidak ditampilkan sebagai identitas bisnis utama.

---

# 57. BUSINESS DATA OWNERSHIP

| Data         | Source of Truth      |
| ------------ | -------------------- |
| Customer     | customers            |
| Product      | products             |
| Pricing      | pricing_rules        |
| Order        | orders               |
| Order Detail | order_items          |
| Payment      | payments             |
| Invoice      | invoices             |
| Production   | production_histories |
| Shipment     | shipments            |
| Review       | reviews              |
| Attachment   | attachments          |
| Company      | companies            |
| Setting      | settings             |
| Activity     | activity_logs        |

---

# 58. CONSISTENCY RULE

AI harus mempertahankan istilah yang sama.

Gunakan:

```text
Customer
Product
Order
Payment
Invoice
Production
Shipment
Review
Testimonial
Attachment
```

Jangan mengganti istilah secara acak menjadi:

```text
Client
Buyer
Transaction
Bill
Delivery
```

kecuali ada keputusan eksplisit.

---

# 59. PROJECT OWNER

Pemilik keputusan bisnis adalah:

**Project Owner / User**

AI adalah:

**Technical Advisor + Developer**

AI tidak memiliki kewenangan untuk mengubah business rule secara sepihak.

---

# 60. PERUBAHAN REQUIREMENT

Jika Project Owner mengatakan:

> "Saya ingin mengubah sistem DP."

Maka AI harus:

1. Mengidentifikasi requirement lama.
2. Menjelaskan dampak perubahan.
3. Mengidentifikasi database impact.
4. Mengidentifikasi backend impact.
5. Mengidentifikasi frontend impact.
6. Mengidentifikasi testing impact.
7. Memperbarui dokumentasi.
8. Baru mengimplementasikan.

---

# 61. DEVELOPMENT PHILOSOPHY

FRNDLY dikembangkan secara:

**AI-Assisted / Vibe Coding**

Tetapi tetap mengikuti:

```text
Specification
↓
Architecture
↓
Implementation
↓
Testing
↓
Review
```

AI tidak boleh menjadi sumber business decision.

---

# 62. SUMBER KEBENARAN

Prioritas sumber informasi:

```text
1. Keputusan terbaru Project Owner
2. FRNDLY Master Project Context
3. SRS
4. Architecture Documentation
5. Database Documentation
6. Coding Rules
7. AI Suggestions
```

Jika AI suggestion bertentangan dengan requirement:

**Requirement menang.**

---

# 63. TUJUAN AKHIR

FRNDLY harus menjadi aplikasi yang:

* profesional,
* aman,
* cepat,
* responsive,
* mudah digunakan,
* mudah dikembangkan,
* mudah dipelihara,
* memiliki histori data yang baik,
* memiliki dokumentasi yang jelas,
* memiliki arsitektur yang konsisten.

FRNDLY harus mampu berkembang dari aplikasi internal sederhana menjadi sistem manajemen bisnis konveksi yang lebih lengkap tanpa harus membangun ulang seluruh sistem.

---

# 64. IDENTITAS SINGKAT

Jika AI hanya memiliki waktu untuk memahami satu paragraf tentang FRNDLY, gunakan definisi berikut:

> **FRNDLY adalah aplikasi web manajemen bisnis konveksi custom berbasis Laravel dan React.js yang digunakan oleh admin untuk mengelola customer, produk, custom order multi-produk, pricing, diskon, pembayaran DP dan pelunasan, proses produksi, file desain, invoice PDF, pengiriman, review, rating, testimonial, laporan, backup, dan histori aktivitas. FRNDLY menggunakan model bisnis PO + Custom Production, bukan inventory retail. Sistem harus responsive, profesional, aman, scalable, dan menggunakan prinsip Single Source of Truth. Pengembangan dilakukan secara AI-assisted/vibe coding, tetapi seluruh business rule tetap dikendalikan oleh Project Owner dan tidak boleh diubah AI secara sepihak.**
