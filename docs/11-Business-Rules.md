# FRNDLY — Business Rules

**Project:** FRNDLY  
**Document:** Business Rules  
**File:** `11-Business-Rules.md`  
**Version:** 1.0.0  
**Status:** Baseline  
**Last Updated:** 2026-08-08

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