# FRNDLY — Business Rules

**Project:** FRNDLY
**Document:** Business Rules
**File:** `docs/11-Business-Rules.md`
**Version:** 1.0.0
**Status:** Baseline
**Last Updated:** 2026-08-09

---

## 1. Purpose

Dokumen ini mendefinisikan seluruh aturan bisnis yang harus dipatuhi oleh aplikasi FRNDLY.

Business Rules menjadi acuan utama untuk:

- Backend Laravel
- Frontend React.js
- Database
- REST API
- Invoice
- Dashboard
- Reporting
- Authentication
- File Management
- Payment
- Production
- Shipping
- Review
- Settings
- Backup
- Audit Trail
- AI Coding Assistant

Business Rules menjawab pertanyaan:

> Apa yang boleh dilakukan, apa yang tidak boleh dilakukan, dan bagaimana sistem harus berperilaku dalam konteks bisnis FRNDLY?

Dokumen ini bukan sekadar daftar fitur. Dokumen ini mendefinisikan **aturan perilaku sistem** yang wajib dipatuhi oleh implementasi.

---

# 2. Business Principles

FRNDLY harus mengikuti prinsip berikut:

1. Satu sumber data untuk setiap informasi.
2. Data transaksi harus dapat ditelusuri.
3. Histori transaksi tidak boleh berubah secara tidak sengaja.
4. Perhitungan finansial harus konsisten.
5. Workflow order harus mengikuti status yang telah ditentukan.
6. Harga transaksi harus memiliki histori/snapshot yang aman.
7. Customer harus terhubung dengan seluruh histori order-nya.
8. Pembayaran harus dapat ditelusuri.
9. Perubahan penting harus tercatat.
10. Data yang dapat dihitung otomatis sebaiknya tidak disimpan sebagai input manual.
11. Admin memiliki kontrol terhadap konfigurasi bisnis.
12. Sistem tidak boleh membuat keputusan bisnis yang belum ditentukan.
13. AI coding assistant tidak boleh mengubah business rule tanpa persetujuan.
14. Data yang diarsipkan dapat dipulihkan selama belum dihapus permanen.
15. Permanent deletion bersifat destruktif.
16. Security harus diterapkan pada backend, bukan hanya frontend.
17. Data historis harus diprioritaskan untuk tetap konsisten.
18. Perubahan master data tidak boleh merusak transaksi lama.

---

# 3. Business Scope

FRNDLY adalah aplikasi manajemen bisnis konveksi dan custom apparel/atribut.

Produk yang dapat dikelola antara lain:

- Kaos
- Jaket
- Lanyard
- ID Card
- Pakaian custom
- Atribut event
- Produk custom lainnya

Model bisnis utama:

```text
Custom / Pre-Order
        ↓
Customer
        ↓
Order
        ↓
DP
        ↓
Production
        ↓
Shipping / Pickup
        ↓
Pelunasan
        ↓
Review
        ↓
Reporting
```

FRNDLY bukan marketplace dan bukan platform e-commerce publik. Fokus awal aplikasi adalah administrator internal.

---

# 4. Order Business Rules

## BR-001 — Order Identifier

Setiap order memiliki public identifier yang unik:

```text
ORD-YYYYMMDD-000
```

Internal primary key tetap `id`; identifier bisnis tidak sama dengan primary key.

## BR-002 — Order Status Workflow

Order mengikuti alur status berikut:

```text
draft
  ↓
waiting_dp
  ↓
dp_received
  ↓
processing
  ↓
paid
```

Aturan:

- Status hanya dapat berpindah sesuai alur di atas (valid transition).
- Perubahan status harus melalui business logic backend.
- Status tidak boleh berpindah sembarangan atau dilompati tanpa data pendukung.

Label tampilan (UI) menggunakan Bahasa Indonesia:

```text
Draft         → Draft
waiting_dp    → Menunggu DP
dp_received   → DP Masuk
processing    → Proses
paid          → Lunas
```

## BR-003 — Order Data

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
Production Cost
Profit
Notes
Internal Notes
```

`Production Cost` dihitung dari akumulasi `cost_price` pada seluruh order item.

## BR-004 — Order Calculation

Formula utama:

```text
Item Subtotal = Quantity × Unit Price
Order Subtotal = Σ Item Subtotal
Grand Total = Order Subtotal - Discount + Shipping
Remaining Balance = Grand Total - Total Paid
```

Perhitungan dilakukan di backend, tidak boleh bergantung pada input manual.

## BR-005 — Order Snapshot

Order item menyimpan snapshot produk (nama, harga, variasi) pada saat order dibuat. Perubahan master product di kemudian hari tidak boleh mengubah order lama.

## BR-006 — Order Deadline

Order dapat memiliki deadline. Sistem harus membantu admin memantau deadline yang mendekat.

## BR-007 — Multi-Product Order

Satu order dapat memiliki lebih dari satu produk. Setiap produk dicatat sebagai order item terpisah.

---

# 5. Payment Business Rules

## BR-010 — Payment Types

Payment type menggunakan nilai enum:

```text
dp
final
```

Label tampilan:

```text
dp    → DP
final → Pelunasan
```

## BR-011 — Single DP Rule

**DP hanya satu kali per order.**

Sistem harus mencegah pencatatan DP kedua.

## BR-012 — Final Payment

Final payment hanya dapat dicatat setelah DP masuk, dan hanya untuk sisa yang belum dibayar.

```text
1 order
    ↓
maximum 1 DP
    ↓
1 final payment
```

## BR-013 — Payment Limits

Total payment tidak boleh melebihi grand total order.

```text
DP tidak boleh negatif.
DP tidak boleh melebihi total.
Pelunasan tidak boleh melebihi sisa.
```

## BR-014 — Payment Calculation

Setiap pembayaran otomatis memperbarui:

```text
paid_amount
remaining_amount
status order
```

```text
paid_amount     = akumulasi seluruh pembayaran
remaining_amount = grand_total - paid_amount
```

## BR-015 — Payment Channel

Pembayaran dilakukan di luar aplikasi dan dikomunikasikan melalui WhatsApp. FRNDLY hanya mencatat transaksi pembayaran. Tidak ada payment gateway pada versi ini.

## BR-016 — Payment Traceability

Setiap pembayaran dapat ditelusuri: nominal, tanggal, tipe, referensi, bukti (attachment), dan pencatat.

---

# 6. Invoice Business Rules

## BR-020 — Invoice Generation

Invoice dibuat berdasarkan data order. Invoice menggunakan data:

```text
Company
Customer
Order
Order Items
Payment
Shipping
Discount
```

## BR-021 — Invoice Number

Format nomor invoice:

```text
INV-YYYYMMDD-000
```

Keterangan:

```text
INV       → prefix tetap
YYYYMMDD  → tanggal terbit invoice
000       → nomor urut, di-reset setiap hari
```

Contoh:

```text
INV-20260809-001
INV-20260809-002
```

Aturan:

- Nomor invoice harus unik.
- Nomor urut di-reset setiap hari.
- Nomor dihasilkan backend, bukan dikirim client.
- Dua invoice di hari yang sama tidak boleh bertabrakan (concurrent-safe).

## BR-022 — Invoice Status

Invoice mengikuti status:

```text
draft
  ↓
issued
  ↓
paid
```

## BR-023 — Invoice Snapshot

Invoice menyimpan snapshot customer dan company agar tampilan invoice tidak berubah walau master data berubah.

## BR-024 — Invoice PDF

Invoice dapat diunduh sebagai PDF. File PDF mengikuti nomor invoice.

## BR-025 — Invoice Template

Admin dapat memilih template invoice (default, modern, minimal, formal).

---

# 7. Customer Business Rules

## BR-030 — Customer Data

Customer minimal menyimpan:

```text
Nama
Nomor HP
Email
Alamat
Kota
Provinsi
Catatan
Histori pesanan
```

## BR-031 — Customer Identifier

Setiap customer memiliki code unik:

```text
CUS-YYYYMMDD-000
```

`customer_code` bersifat UNIQUE. Nomor HP **tidak** wajib unik dan boleh kosong.

## BR-032 — Customer History

Customer terhubung dengan seluruh histori order-nya. Hapus customer tidak boleh menghilangkan order lama (soft delete + histori tetap tersimpan).

## BR-033 — Repeat Customer

Ambang repeat customer:

```text
Repeat Customer = customer dengan minimal 2 order.
```

Informasi ini dapat digunakan untuk analisis customer dan pricing.

## BR-034 — Soft Delete & Restore

Customer menggunakan soft delete. Data yang diarsipkan dapat direstore. Permanent delete hanya setelah konfirmasi dan mempertimbangkan relationship.

---

# 8. Product & Pricing Business Rules

## BR-040 — Product Data

Product dapat memiliki:

```text
Nama
Kategori
Deskripsi
Harga dasar
Unit
Material
Model
Warna
Ukuran
SKU
Status
```

## BR-041 — Product Price

Harga produk ditentukan admin. Harga lama tidak berubah setelah order dibuat (snapshot pada order item).

## BR-042 — Cost / Modal

Setiap order item dapat menyimpan `cost_price` (modal produksi). Profit dihitung dari selisih harga jual terhadap modal.

---

# 9. Production Business Rules

## BR-050 — Production Tracking

Order custom harus dapat dipantau proses produksinya.

Workflow produksi standar:

```text
Order
  ↓
Design
  ↓
Approval
  ↓
Production
  ↓
Quality Check
  ↓
Packing
  ↓
Shipping
```

Nilai status produksi:

```text
design
approval
production
quality_control
packing
shipping
```

## BR-051 — Production Flexibility

Tidak semua produk harus melewati semua tahap. Admin dapat menyesuaikan tahap sesuai kebutuhan order.

## BR-052 — Production Timeline

Sistem mencatat timeline produksi (event + timestamp) agar histori produksi dapat ditelusuri.

---

# 10. Shipping Business Rules

## BR-060 — Shipping Cost

Ongkir dipisahkan dari harga produk dan dicatat sebagai `shipping_cost` pada order.

## BR-061 — Shipment Status

Status shipment:

```text
pending
packed
shipped
in_transit
delivered
cancelled
```

## BR-062 — Tracking

Tracking number harus mudah ditemukan pada order dan shipment.

---

# 11. Review & Testimonial Business Rules

## BR-070 — Review Eligibility

Review hanya dapat diberikan untuk order yang telah lunas.

Pada MVP, review dilakukan melalui mekanisme yang disediakan admin/sistem. Customer portal belum tersedia.

## BR-071 — Rating Scale

Rating menggunakan skala:

```text
1–10
```

## BR-072 — Testimonial

Testimonial dapat berupa text dan/atau foto (foto optional).

## BR-073 — Review Moderation

Admin dapat:

```text
menyembunyikan review
menghapus review
```

---

# 12. Data Integrity & Archiving Rules

## BR-080 — Data Integrity

Sistem harus memastikan:

```text
customer tidak hilang karena perubahan order
order lama tidak berubah akibat perubahan product
invoice number unique
order ID unique
payment valid
DP tidak double
grand total konsisten
remaining balance konsisten
soft delete tidak merusak histori
```

## BR-081 — Archive

Data tertentu menggunakan soft delete dan berpindah ke Archive. Admin dapat restore data di archive.

## BR-082 — Permanent Delete

Data archive dapat dihapus permanen hanya jika:

```text
dikonfirmasi
authorized
aman terhadap relationship
audit requirements terpenuhi
```

## BR-083 — Audit Trail

Perubahan penting harus tercatat:

```text
Entity ID
Timestamp
Old Value
New Value
Actor
```

## BR-084 — Historical Data

Master data yang berubah tidak boleh merusak transaksi lama (snapshot). Histori transaksi diprioritaskan untuk tetap konsisten.

---

# 13. Reporting & Dashboard Rules

## BR-090 — Data Source

Semua laporan bersumber dari data transaksi aktual (order, payment, production, shipment), bukan input manual terpisah.

## BR-091 — Profit Reporting

Profit dihitung dari:

```text
Revenue
- Production Cost
- Discount Impact
- Shipping / Operational Cost
```

## BR-092 — Report Filters

Setiap laporan mendukung filter, sorting, pagination, dan rentang periode.

---

# 14. Authentication & Access Rules

## BR-100 — Login

Login menggunakan **email + password**. Tidak ada kolom username.

## BR-101 — Token Auth

Autentikasi menggunakan token (Laravel Sanctum). Seluruh endpoint resource wajib membawa token kecuali login dan health check.

## BR-102 — Access Control

Fokus awal aplikasi adalah administrator internal. Multi-admin, role, dan permission dikembangkan sebagai fitur future.

## BR-103 — Password

Password harus disimpan dengan hashing yang aman. Tidak boleh disimpan plaintext.

---

# 15. File & Attachment Rules

## BR-110 — Attachment Usage

Attachment dapat digunakan untuk:

```text
Design
Payment Proof
Invoice
Shipment
Review
Business Documents lain
```

## BR-111 — File Access

Akses file privat harus dibatasi hanya untuk user terautentikasi dan terotorisasi. Validasi dilakukan di backend.

---

# 16. Settings & Backup Rules

## BR-120 — Settings

Admin dapat mengatur:

```text
Application settings
Company profile
Theme (warna, status colors)
Invoice default template
Dashboard default period
```

## BR-121 — Backup

Sistem harus menyediakan backup database dan data aplikasi penting. Admin dapat membuat, melihat, mengunduh, dan menghapus backup lama.

---

# 17. Notification & Reminder Rules

## BR-130 — Reminder

Sistem menyediakan reminder untuk:

```text
Deadline order mendekat
Pembayaran belum lunas
Order belum dikirim
Review belum diberikan
```

Notifikasi otomatis eksternal belum diperlukan pada MVP.

---

# 18. Technology & Environment Rules

## BR-140 — Database

Standar database adalah **MySQL/MariaDB** (via Laragon). SQLite hanya untuk development cepat/pengujian.

## BR-141 — Enum Consistency

Status dan tipe harus menggunakan nilai enum yang konsisten, tidak boleh bervariasi antar modul.

```text
Order status    : draft, waiting_dp, dp_received, processing, paid
Payment type    : dp, final
Invoice status  : draft, issued, paid
```

## BR-142 — Source of Truth

Dokumen final ERD/Database (`docs/04-ERD.md`, `docs/05-Database.md`) adalah sumber kebenaran nama tabel. Daftar entity konseptual di dokumen lain harus mengacu ke sana.

---

# 19. Rule Authority & Change Management

## BR-150 — Rule Authority

Business rules ditetapkan oleh Product Owner (PO). AI coding assistant tidak boleh mengubah business rule tanpa persetujuan.

## BR-151 — Rule Change

Perubahan business rule harus melalui proses:

```text
Alasan perubahan
Deskripsi
Dampak
Persetujuan PO
Pembaruan dokumen terkait
Pembaruan testing
Pembaruan changelog
```

---

# 20. Document Status

Dokumen ini merupakan baseline Business Rules FRNDLY versi **1.0.0**.

Business rules final ditentukan oleh Product Owner (PO) dan menjadi acuan implementasi backend, frontend, database, dan API.
