# FRNDLY — UI/UX DESIGN SPECIFICATION

**Project:** FRNDLY
**Document:** UI/UX Specification
**File:** `docs/07-UIUX.md`
**Version:** 1.0.0
**Status:** Approved Baseline
**Frontend:** React.js
**Backend:** Laravel
**Design Approach:** Modern Business Management Dashboard
**Responsive:** Desktop + Tablet + Mobile
**Language:** Bahasa Indonesia

---

# 1. TUJUAN UI/UX

FRNDLY dirancang sebagai aplikasi manajemen bisnis konveksi yang:

* profesional
* modern
* ringan
* mudah dipahami
* cepat digunakan
* responsive
* minim pop-up
* konsisten
* dapat dikustomisasi
* nyaman digunakan dalam pekerjaan sehari-hari

FRNDLY bukan sekadar dashboard administrasi.

Aplikasi harus terasa seperti:

> **"Business operating system untuk bisnis konveksi."**

---

# 2. DESIGN PHILOSOPHY

FRNDLY menggunakan prinsip:

```text
Clarity
Consistency
Efficiency
Hierarchy
Feedback
Customization
Performance
```

Urutan prioritas:

```text
Usability
    ↓
Clarity
    ↓
Consistency
    ↓
Aesthetics
```

Visual yang bagus tidak boleh mengorbankan kemudahan penggunaan.

---

# 3. CORE UX PRINCIPLE

## 3.1 One Source of Truth

Data hanya boleh memiliki satu sumber utama.

Contoh:

Customer:

```text
Customer Database
        ↓
Order
        ↓
Invoice
        ↓
Review
```

Jangan membuat data customer berbeda antara halaman customer dan invoice.

---

# 4. USER

MVP hanya memiliki:

```text
ADMIN
```

Admin memiliki akses ke seluruh modul.

Future:

```text
Owner
Manager
Staff
Production
Finance
```

tetapi role system ditunda.

---

# 5. APPLICATION STRUCTURE

Struktur utama:

```text
FRNDLY
│
├── Dashboard
│
├── Orders
│
├── Customers
│
├── Products
│
├── Production
│
├── Shipping
│
├── Reviews
│
├── Reports
│
├── Activity
│
├── Reminders
│
├── Files
│
├── Settings
│
└── Admin
```

---

# 6. PRIMARY NAVIGATION

Sidebar menjadi navigasi utama desktop.

Contoh:

```text
┌─────────────────────────────┐
│ FRNDLY                      │
│ Business Management         │
├─────────────────────────────┤
│                             │
│ 🏠 Dashboard                │
│                             │
│ 📦 Pesanan                  │
│ 👥 Customer                 │
│ 🛍 Produk                   │
│ 🏭 Produksi                 │
│ 🚚 Pengiriman               │
│ ⭐ Review                   │
│                             │
│ 📊 Laporan                  │
│ 🔔 Reminder                 │
│ 🕒 Aktivitas                │
│ 📁 File                     │
│                             │
├─────────────────────────────┤
│ ⚙ Settings                 │
│ 👤 Admin                    │
└─────────────────────────────┘
```

Icon tidak boleh menjadi satu-satunya indikator fungsi.

Setiap icon utama harus memiliki label.

---

# 7. MOBILE NAVIGATION

Pada mobile, sidebar berubah menjadi:

```text
Bottom Navigation
```

atau drawer.

Prioritas:

```text
Dashboard
Pesanan
Customer
Produk
More
```

Menu lainnya berada di:

```text
More
```

---

# 8. RESPONSIVE BREAKPOINT

Gunakan breakpoint konsisten.

Recommended:

```text
Mobile:
< 640px

Tablet:
640px – 1023px

Desktop:
1024px – 1279px

Large Desktop:
≥ 1280px
```

Jangan membuat breakpoint secara acak di setiap component.

---

# 9. DESKTOP LAYOUT

Struktur:

```text
┌────────────┬─────────────────────────────────┐
│            │ Header                          │
│            ├─────────────────────────────────┤
│ Sidebar    │                                 │
│            │ Main Content                    │
│            │                                 │
│            │                                 │
└────────────┴─────────────────────────────────┘
```

Sidebar:

```text
240px ±
```

Collapsed:

```text
72px ±
```

---

# 10. HEADER

Header berisi:

```text
Breadcrumb
Page title/context
Global Search
Activity
Reminder
Admin profile
```

Contoh:

```text
Dashboard                         🔍  🔔  👤
```

---

# 11. GLOBAL SEARCH

Global search harus mudah diakses.

Shortcut:

```text
Ctrl + K
```

Search:

```text
Customer
Order
Invoice
Product
```

Contoh:

```text
Search "Andi"

Customer
  Andi Pratama

Orders
  ORD-20260808-001

Invoice
  INV-20260808-001
```

Hasil search dikelompokkan berdasarkan tipe (Customer, Order, Invoice, Product) dengan maksimal 4 hasil per tipe.

Global search dapat dinavigasi penuh menggunakan keyboard:

```text
Ctrl + K / /
Fokus ke input search

ArrowDown / ArrowUp
Pindah antar hasil

Home / End
Ke hasil pertama / terakhir

Enter
Buka record hasil yang aktif

Esc
Tutup panel search
```

Panel search bersifat combobox (role `combobox` + `listbox`): hasil yang aktif ditandai dengan `aria-activedescendant` dan highlight visual agar konsisten antara keyboard dan mouse.

---

# 12. PAGE HEADER

Setiap halaman memiliki:

```text
Breadcrumb
Title
Description
Primary Action
Secondary Actions
```

Contoh:

```text
Pesanan
Kelola seluruh pesanan customer.

[ + Buat Pesanan ]
```

---

# 13. DASHBOARD

Dashboard merupakan halaman utama.

Prioritas:

```text
Data
    ↓
Insight
    ↓
Action
```

Bukan dekorasi.

---

# 14. DASHBOARD LAYOUT

Contoh:

```text
┌──────────────────────────────────────────┐
│ Selamat datang, Admin                    │
│ Ringkasan bisnis hari ini                │
└──────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│ Pesanan  │ │ Pending  │ │ DP       │
│ 120      │ │ 12       │ │ 8        │
└──────────┘ └──────────┘ └──────────┘

┌──────────┐ ┌──────────┐
│ Lunas    │ │ Profit   │
│ 100      │ │ Rp45 jt  │
└──────────┘ └──────────┘

┌───────────────────────┐
│ Revenue / Profit      │
│                       │
│      Chart            │
└───────────────────────┘

┌───────────────────────┐
│ Pesanan Terbaru       │
└───────────────────────┘
```

---

# 15. DASHBOARD CARDS

Card harus menampilkan:

```text
Label
Value
Trend / context
Optional icon
```

Contoh:

```text
Total Pesanan

120

+12 bulan ini
```

Jangan terlalu banyak informasi dalam satu card.

---

# 16. COLOR SYSTEM

FRNDLY menggunakan semantic color.

```text
Primary
Secondary
Accent
Success
Warning
Danger
Info
Neutral
```

Warna utama dapat dikustomisasi melalui Settings.

---

# 17. STATUS COLORS

Default semantic:

```text
Draft       → Neutral
Menunggu DP → Warning
DP Masuk    → Info
Proses      → Primary
Lunas       → Success
```

Namun warna dapat diubah admin.

---

# 18. STATUS BADGE

Gunakan badge untuk status.

Contoh:

```text
[ Draft ]
[ Menunggu DP ]
[ DP Masuk ]
[ Proses ]
[ Lunas ]
```

Badge tidak boleh menjadi terlalu besar.

---

# 19. TYPOGRAPHY

Gunakan font modern sans-serif.

Recommended:

```text
Inter
```

Fallback:

```text
system-ui
sans-serif
```

Hierarchy:

```text
H1
32px

H2
24px

H3
20px

Body
14–16px

Caption
12–13px
```

Ukuran final dapat disesuaikan berdasarkan implementasi.

---

# 20. FONT WEIGHT

```text
Regular:
400

Medium:
500

Semibold:
600

Bold:
700
```

Hindari penggunaan terlalu banyak font weight.

---

# 21. SPACING

Gunakan spacing scale.

```text
--space-0  →  0
--space-1  →  4
--space-2  →  8
--space-3  →  12
--space-4  →  16
--space-5  →  20
--space-6  →  24
--space-7  →  32
--space-8  →  40
--space-9  →  48
--space-10 →  64
```

Semua spacing harus berasal dari scale.

Jangan:

```text
margin: 13px;
margin: 27px;
```

tanpa alasan.

---

# 22. BORDER RADIUS

FRNDLY menggunakan rounded modern.

Recommended:

```text
Small:
6px

Medium:
8px

Large:
12px

Card:
12–16px

Modal:
16px
```

Jangan membuat semuanya terlalu bulat.

---

# 23. CARD DESIGN

Card digunakan untuk:

```text
Summary
Statistics
Sections
Forms
Information
```

Card tidak boleh berlebihan.

Gunakan card jika benar-benar membantu grouping informasi.

---

# 24. TABLE DESIGN

Data bisnis utama menggunakan table.

Contoh:

```text
┌────────────────────────────────────────────────────┐
│ Invoice       Customer    Total       Status       │
├────────────────────────────────────────────────────┤
│ INV-001       Andi        Rp5.000.000  Proses      │
│ INV-002       Budi        Rp2.000.000  Lunas       │
└────────────────────────────────────────────────────┘
```

---

# 25. TABLE RULE

Table harus:

```text
Readable
Sortable
Filterable
Searchable
Responsive
```

---

# 26. MOBILE TABLE

Jangan memaksa table desktop masuk mobile.

Gunakan:

```text
Card List
```

atau horizontal scrolling jika memang diperlukan.

Contoh:

```text
┌────────────────────────┐
│ INV-20260808-001       │
│ Andi Pratama           │
│ Rp5.000.000            │
│ [ Proses ]             │
│                        │
│ 08 Aug 2026            │
└────────────────────────┘
```

---

# 27. FORM DESIGN

Form harus:

```text
Simple
Grouped
Clearly labeled
Validated
```

Gunakan:

```text
Label
Input
Helper text
Validation message
```

---

# 28. FORM LABEL

Label wajib jelas.

Benar:

```text
Nama Customer
Nomor HP
Tanggal Deadline
```

Jangan:

```text
Name
Phone
Deadline
```

di UI Bahasa Indonesia.

Backend tetap English.

---

# 29. REQUIRED FIELD

Gunakan indicator:

```text
Nama Customer *
```

Tetapi jangan semua field dibuat required.

Hanya data yang benar-benar diperlukan.

---

# 30. VALIDATION

Validation muncul sedekat mungkin dengan field.

Contoh:

```text
Nomor HP *
[ 08123 ]

⚠ Nomor HP tidak valid.
```

Jangan hanya menampilkan:

```text
Terjadi error.
```

di bagian atas.

---

# 31. AUTOSAVE

Draft order menggunakan autosave.

Indicator:

```text
✓ Tersimpan
```

atau:

```text
Menyimpan...
```

atau:

```text
Gagal menyimpan
```

Autosave tidak boleh mengganggu pekerjaan admin.

---

# 32. ORDER CREATION UX

Flow:

```text
Buat Pesanan
      ↓
Pilih Customer
      ↓
Tambah Produk
      ↓
Atur Variasi
      ↓
Atur Ukuran
      ↓
Quantity
      ↓
Harga
      ↓
Diskon
      ↓
Ongkir
      ↓
Review Summary
      ↓
Simpan
```

---

# 33. ORDER SUMMARY

Bagian kanan desktop:

```text
Ringkasan Pesanan

Subtotal       Rp5.000.000
Diskon         -Rp500.000
Ongkir         Rp25.000
─────────────────────────
Grand Total    Rp4.525.000

DP             Rp1.000.000
Sisa           Rp3.525.000

[ Simpan Pesanan ]
```

Pada mobile, summary berada di bagian bawah atau sticky summary.

---

# 34. CUSTOMER SELECTOR

Saat memilih customer:

```text
Cari customer...
```

Hasil:

```text
Andi Pratama
08123456789
12 pesanan
```

Jika tidak ditemukan:

```text
+ Tambah Customer Baru
```

---

# 35. PRODUCT SELECTOR

Produk:

```text
Kaos
Lanyard
Jaket
ID Card
```

Setelah dipilih:

```text
Produk
Variant
Ukuran
Quantity
Harga
Notes
```

---

# 36. SIZE MANAGEMENT

Untuk produk yang memiliki ukuran:

```text
XS
S
M
L
XL
XXL
3XL
```

Admin dapat menentukan size yang tersedia.

Quantity per size:

```text
M   20
L   30
XL  10
```

Total:

```text
60 pcs
```

Sistem harus memastikan:

```text
SUM(size quantity) = total quantity
```

---

# 37. DISCOUNT UX

Diskon dapat berupa:

```text
Fixed
Percentage
```

Admin menentukan rules dan nominal.

UI:

```text
Diskon
○ Nominal
○ Persentase

Nilai
[ 500000 ]
```

---

# 38. SHIPPING UX

Ongkir dipisahkan dari harga produk.

Contoh:

```text
Subtotal
Diskon
Ongkir
Grand Total
```

Dengan demikian admin dapat melihat kontribusi ongkir secara jelas.

---

# 39. PAYMENT UX

Payment status harus terlihat jelas.

Contoh:

```text
Grand Total
Rp5.000.000

DP
Rp1.000.000

Sisa
Rp4.000.000
```

Status:

```text
[ DP Masuk ]
```

---

# 40. PAYMENT CONFIRMATION

Ketika admin mencatat payment:

```text
Catat Pembayaran

Jenis
[ DP ]

Nominal
[ Rp1.000.000 ]

Tanggal
[ 08/08/2026 ]

Bukti
[ Upload ]

Catatan
[ ... ]

[ Simpan ]
```

---

# 41. INVOICE UX

Invoice tidak menggunakan foto produk.

Format seperti nota profesional.

Struktur:

```text
FRNDLY
Company Information

INVOICE
INV-20260808-001

Customer Information

Order Information

Product
Quantity
Price
Subtotal

Subtotal
Discount
Shipping
Grand Total

Payment
DP
Remaining

Notes

Footer
```

---

# 42. INVOICE DOWNLOAD

Button:

```text
Download Invoice
```

Secondary:

```text
Preview
Print
```

---

# 43. ORDER DETAIL

Order detail menjadi halaman penting.

Struktur:

```text
Header
│
├── Order ID
├── Invoice
├── Status
├── Deadline
│
├── Customer
│
├── Products
│
├── Payment
│
├── Production
│
├── Shipping
│
├── Files
│
├── Timeline
│
└── Activity
```

---

# 44. ORDER TIMELINE

Timeline:

```text
● Order dibuat
│
● Menunggu DP
│
● DP diterima
│
● Masuk produksi
│
● Quality Check
│
● Dikirim
│
● Lunas
```

Timeline membantu admin memahami perjalanan order.

---

# 45. DEADLINE UX

Deadline harus terlihat jelas.

Normal:

```text
Deadline
20 Agustus 2026
```

Mendekati:

```text
⚠ 2 hari lagi
```

Terlambat:

```text
⚠ Terlambat 2 hari
```

---

# 46. PRODUCTION UX

Production page menggunakan workflow.

Contoh:

```text
Waiting
   ↓
Cutting
   ↓
Printing
   ↓
Sewing
   ↓
Finishing
   ↓
Quality Check
   ↓
Completed
```

Admin dapat melihat posisi setiap order.

---

# 47. SHIPMENT STATUS & TRACKING

Status:

```text
Pending
Packed
Shipped
In Transit
Delivered
```

Tracking number harus mudah ditemukan.

---

# 48. CUSTOMER DETAIL

Customer detail:

```text
Customer Profile

Nama
No HP
Email
Alamat

────────────────

Total Pesanan
12

Total Spending
Rp50.000.000

Repeat Customer
Ya

────────────────

Order History
```

---

# 49. REPEAT CUSTOMER

Tampilkan:

```text
12 Pesanan
```

dan:

```text
Customer sejak:
2025
```

Opsional:

```text
Last Order:
08 Aug 2026
```

---

# 50. CUSTOMER HISTORY

Customer dapat memiliki:

```text
Order history
Payment history
Review
Activity
Files
```

---

# 51. REVIEW UX

Review ditampilkan seperti e-commerce.

Contoh:

```text
Andi Pratama

★★★★★
10/10

"Hasil kaosnya bagus dan sesuai desain."

✓ Verified Order
```

---

# 52. RATING

Rating:

```text
1 ───────────── 10
```

UI dapat menggunakan:

```text
Number Rating
```

atau:

```text
Slider
```

Untuk admin, tampilkan:

```text
9.4 / 10
```

---

# 53. TESTIMONIAL

Testimonial dapat memiliki:

```text
Customer
Rating
Review
Photo
Order
Published status
```

Admin dapat:

```text
Publish
Unpublish
Edit
Archive
```

---

# 54. FILE MANAGEMENT

Universal attachment dapat digunakan untuk:

```text
Design
Revision
Payment proof
Invoice
Production
Shipment
Customer
Order
```

File harus memiliki:

```text
Name
Type
Size
Uploaded by
Date
Related entity
```

---

# 55. FILE PREVIEW

Preview tersedia untuk file yang mendukung.

Contoh:

```text
JPG
PNG
PDF
```

File lain:

```text
Download
```

---

# 56. ACTIVITY CENTER

Activity center menampilkan aktivitas terbaru.

Contoh:

```text
Today

10:30
Admin mencatat DP Rp500.000
ORD-20260808-001

09:45
Invoice dibuat
INV-20260808-001

09:20
Customer baru ditambahkan
Andi Pratama
```

---

# 57. AUDIT TRAIL UX

Audit lebih teknis.

Contoh:

```text
Order updated

Field:
status

Before:
DP Masuk

After:
Proses

Changed by:
Admin

Date:
08 Aug 2026 10:30
```

---

# 58. REMINDER UX

Reminder tidak boleh menggunakan pop-up terus menerus.

Gunakan:

```text
Reminder Center
```

Contoh:

```text
⚠ 3 order deadline minggu ini

• ORD-001 — 2 hari lagi
• ORD-002 — 3 hari lagi
• ORD-003 — 5 hari lagi
```

---

# 59. NOTIFICATION PHILOSOPHY

FRNDLY tidak menggunakan:

```text
Popup setiap ada event.
```

Prioritas:

```text
Inline feedback
Toast
Activity center
Reminder
```

---

# 60. TOAST

Toast digunakan untuk feedback singkat.

Success:

```text
✓ Pesanan berhasil dibuat.
```

Error:

```text
✕ Gagal menyimpan pesanan.
```

Toast:

```text
Auto dismiss
```

kecuali error penting.

---

# 61. MODAL

Modal hanya digunakan untuk:

```text
Confirmation
Short forms
Quick actions
Critical actions
```

Jangan gunakan modal untuk halaman kompleks.

---

# 62. DELETE CONFIRMATION

Untuk destructive action:

```text
Hapus Customer?

Data akan dipindahkan ke arsip.

[ Batal ] [ Arsipkan ]
```

Permanent delete:

```text
Hapus Permanen?

Data tidak dapat dikembalikan.

[ Batal ] [ Hapus Permanen ]
```

---

# 63. SOFT DELETE UX

Default:

```text
Delete
    ↓
Archive
```

Archive page:

```text
Archived Customers
Archived Orders
Archived Products
```

Permanent delete hanya tersedia dari archive.

---

# 64. EMPTY STATE

Jangan menampilkan halaman kosong.

Contoh:

```text
Belum ada pesanan

Mulai dengan membuat pesanan pertama.

[ + Buat Pesanan ]
```

---

# 65. LOADING STATE

Gunakan:

```text
Skeleton
Spinner
Progress indicator
```

Skeleton lebih disukai untuk content-heavy page.

---

# 66. SKELETON

Contoh:

```text
████████████
████████
████████████████
```

Jangan menampilkan halaman kosong selama loading.

---

# 67. ERROR STATE

Contoh:

```text
Tidak dapat memuat data.

Silakan coba lagi.

[ Coba Lagi ]
```

---

# 68. OFFLINE / CONNECTION ERROR

Jika koneksi terputus:

```text
Koneksi bermasalah.

Periksa koneksi internet Anda.
```

Autosave harus memberi warning jika gagal.

---

# 69. ACCESSIBILITY

FRNDLY harus memperhatikan:

```text
Keyboard navigation
Focus state
Color contrast
Readable text
ARIA labels
Screen reader compatibility
```

Jangan menggunakan warna sebagai satu-satunya indikator.

Contoh:

```text
❌ hanya merah

✓ [ Terlambat ]
```

---

# 70. KEYBOARD SHORTCUTS

Recommended:

```text
Ctrl + K
Global Search

N
New Order

/
Focus Search

Esc
Close Modal
```

Shortcut tidak boleh mengganggu input form.

Menu dropdown (menu aksi baris, menu profil) juga mendukung navigasi keyboard penuh:

```text
ArrowDown / ArrowUp
Pindah antar item menu

Home / End
Ke item pertama / terakhir

Enter
Aktifkan item yang disorot

Esc
Tutup menu dan kembalikan fokus ke tombol trigger
```

Menu dropdown menerapkan pola menu button WAI-ARIA:

```text
aria-haspopup="menu"
aria-expanded
aria-controls
role="menu" / role="menuitem"
```

Fokus visual menggunakan `:focus-visible` global (outline primary 2px).

---

# 71. CONFIRMATION UX

Tidak semua action membutuhkan confirmation.

Tidak perlu:

```text
Save
Update
Search
Filter
```

Perlu:

```text
Permanent Delete
Restore
Critical Settings
Logout jika ada perubahan belum tersimpan
```

---

# 72. DESIGN SYSTEM

FRNDLY harus memiliki reusable components.

Contoh:

```text
Button
Input
Select
Textarea
DatePicker
Badge
Card
Table
Modal
Drawer
Toast
Tabs
Dropdown
Tooltip
Pagination
Breadcrumb
Skeleton
EmptyState
ErrorState
```

---

# 73. COMPONENT RULE

Jangan membuat component duplicate.

Contoh buruk:

```text
CustomerButton
OrderButton
ProductButton
```

Jika behavior sama:

```text
Button
```

gunakan props.

---

# 74. BUTTON HIERARCHY

Primary:

```text
[ Buat Pesanan ]
```

Secondary:

```text
[ Export ]
```

Tertiary:

```text
[ Lihat Detail ]
```

Danger:

```text
[ Hapus Permanen ]
```

---

# 75. ICON RULE

Gunakan satu icon library.

Recommended:

```text
Lucide React
```

Jangan mencampur:

```text
Font Awesome
Material Icons
Lucide
Custom SVG
```

tanpa alasan.

---

# 76. ICON + TEXT

Untuk action penting:

```text
+ Buat Pesanan
```

lebih baik daripada:

```text
+
```

Icon-only hanya digunakan untuk action yang sudah familiar dan memiliki tooltip.

---

# 77. DATA DENSITY

FRNDLY adalah business application.

Karena itu data density:

```text
Medium → High
```

Tetapi tetap harus memiliki whitespace.

Jangan membuat dashboard seperti:

```text
Terlalu banyak card
Terlalu banyak chart
Terlalu banyak warna
```

---

# 78. CHARTS

Chart hanya digunakan jika membantu pengambilan keputusan.

Recommended:

```text
Revenue
Profit
Order trend
Product performance
Customer growth
```

Hindari chart dekoratif.

---

# 79. REPORT PAGE

Report harus memiliki:

```text
Filter
Summary
Chart
Table
Export
```

Contoh:

```text
Laporan Penjualan

[ Date Range ]
[ Customer ]
[ Product ]
[ Status ]

Revenue
Profit
Orders

Chart

Data Table

[ CSV ]
```

---

# 80. SETTINGS UX

Settings dibagi:

```text
General
Appearance
Company
Invoice
Order
Product
Status
Backup
```

---

# 81. APPEARANCE SETTINGS

Admin dapat mengubah:

```text
Primary Color
Secondary Color
Accent Color
Theme
Status Colors
```

Future:

```text
Light
Dark
System
```

---

# 82. COMPANY BRANDING

Company settings:

```text
Company Name
Logo
Address
Phone
Email
Website
Social Media
Invoice Footer
```

Branding digunakan secara global.

---

# 83. BRANDING SOURCE OF TRUTH

Company branding disimpan di:

```text
Company Settings
```

Digunakan oleh:

```text
Dashboard
Invoice
Reports
PDF
Future Customer Portal
```

---

# 84. INVOICE TEMPLATE UX

Admin dapat memilih:

```text
Default
Modern
Minimal
Formal
```

Preview:

```text
[ Template 1 ]
[ Template 2 ]
[ Template 3 ]
```

---

# 85. DANGER ZONE

Settings sensitif ditempatkan terpisah.

Contoh:

```text
Danger Zone

Delete archived data
Reset application
```

Harus memiliki confirmation kuat.

---

# 86. BACKUP UX

Backup page:

```text
Backup

Last Backup
08 Aug 2026 03:00

[ Backup Sekarang ]

History

08 Aug 2026
03:00
Successful

01 Aug 2026
03:00
Successful
```

---

# 87. ADMIN PROFILE

Admin page:

```text
Profile
Security
Password
Session
```

Security settings tidak dicampur dengan application appearance.

---

# 88. PASSWORD UX

Password field:

```text
Password
[ ••••••••• ] 👁
```

Requirements:

```text
Minimum length
Strength indicator
Confirmation
```

---

# 89. SECURITY UX

Action sensitif dapat membutuhkan password confirmation.

Contoh:

```text
Permanent Delete
Backup Restore
Security Change
```

---

# 90. MOBILE UX PRINCIPLES

Mobile bukan versi desktop yang diperkecil.

Mobile harus:

```text
Touch friendly
Simple
Readable
One-hand friendly
Minimal horizontal scrolling
```

Minimum touch target:

```text
≈44px
```

---

# 91. MOBILE ORDER CREATION

Gunakan step-based interface jika form terlalu panjang.

Contoh:

```text
1 Customer
2 Produk
3 Harga
4 Pembayaran
5 Review
```

Progress:

```text
●──●──○──○──○
```

---

# 92. MOBILE ORDER DETAIL

Prioritas:

```text
Status
Total
Customer
Deadline
Payment
```

Detail lainnya menggunakan collapsible sections.

---

# 93. RESPONSIVE SIDEBAR

Desktop:

```text
Expanded
```

Tablet:

```text
Collapsed
```

Mobile:

```text
Drawer / Bottom navigation
```

---

# 94. DESIGN CONSISTENCY

Semua halaman harus menggunakan:

```text
Same spacing
Same typography
Same buttons
Same form controls
Same status badges
Same table behavior
Same feedback pattern
```

---

# 95. NO RANDOM DESIGN

AI/developer tidak boleh membuat halaman baru dengan:

```text
font berbeda
button berbeda
radius berbeda
color berbeda
spacing berbeda
```

tanpa mengubah design system terlebih dahulu.

---

# 96. PERFORMANCE UX

UI harus:

```text
Lazy load heavy pages
Pagination
Image optimization
Code splitting
Debounced search
Skeleton loading
Avoid unnecessary rerender
Per-module data reload
```

Per-module data reload:

```text
Mutation pada satu modul
↓
Reload hanya data yang terdampak modul tersebut
+ koleksi pendukung (relasi)
+ dashboard metrics
```

Reload penuh seluruh koleksi hanya dilakukan saat halaman pertama kali dibuka.

Contoh pemetaan modul → data yang di-reload:

```text
Customers  → customers, dashboard
Products   → products, dashboard
Orders     → orders, customers, products, dashboard
Payments   → payments, orders, dashboard
Invoices   → invoices, orders, dashboard
Production → productions, orders, dashboard
Shipping   → shipments, orders, dashboard
Reviews    → reviews, orders, dashboard
Testimonials → testimonials, reviews, dashboard
```

---

# 97. SEARCH UX

Search harus menggunakan debounce.

Contoh:

```text
User mengetik:
Andi

↓
300ms

Request API
```

Jangan request API setiap karakter tanpa debounce.

---

# 98. FILTER UX

Filter dapat menggunakan:

```text
Status
Date
Customer
Product
Price
Payment
Deadline
```

Filter aktif ditampilkan:

```text
Filters

[ Proses × ]
[ Bulan ini × ]
```

Clear:

```text
Clear all
```

---

# 99. SORT UX

Kolom yang dapat diurutkan menampilkan:

```text
↑
↓
```

Contoh:

```text
Tanggal ↑
```

---

# 100. PAGINATION UX

Default:

```text
20 rows/page
```

Options:

```text
20
50
100
```

Navigasi:

```text
‹ 1 2 3 4 5 ›
```

---

# 101. BULK ACTION

Untuk data tertentu:

```text
☐ Customer A
☐ Customer B
☐ Customer C

3 selected

[ Archive ]
[ Export ]
```

Bulk permanent delete tidak diperbolehkan secara default untuk mencegah kesalahan.

---

# 102. DATA EXPORT UX

Export button:

```text
Export ▼

PDF
Excel
CSV
```

Jika export besar:

```text
Preparing export...
```

---

# 103. PRINT UX

Invoice dan laporan harus memiliki print-friendly layout.

Gunakan:

```css
@media print
```

dan jangan mencetak:

```text
Sidebar
Header navigation
Action buttons
```

---

# 104. DATE FORMAT

UI:

```text
08 Agustus 2026
```

Short:

```text
08 Agu 2026
```

Database:

```text
YYYY-MM-DD
```

API:

```text
ISO 8601
```

---

# 105. CURRENCY

Default:

```text
IDR
```

UI:

```text
Rp5.000.000
```

Tidak menggunakan:

```text
Rp 5,000,000
```

Formatting harus konsisten.

---

# 106. NUMBER FORMAT

Thousands:

```text
1.000
10.000
100.000
```

Decimal mengikuti kebutuhan bisnis.

---

# 107. LANGUAGE

UI utama:

```text
Bahasa Indonesia
```

Contoh:

```text
Dashboard
Pesanan
Customer
Produk
Pembayaran
Produksi
Pengiriman
Laporan
Pengaturan
```

Technical code tetap English.

---

# 108. MICROCOPY

Gunakan bahasa yang:

```text
Singkat
Jelas
Human
Tidak kaku
```

Contoh:

```text
Pesanan berhasil dibuat.
```

lebih baik daripada:

```text
Operation has been executed successfully.
```

---

# 109. ERROR MICROCOPY

Jangan:

```text
Error 422
```

Gunakan:

```text
Data belum lengkap.
Periksa kembali field yang ditandai.
```

---

# 110. SUCCESS MICROCOPY

```text
Customer berhasil ditambahkan.
Pesanan berhasil disimpan.
Pembayaran berhasil dicatat.
Invoice berhasil dibuat.
File berhasil diupload.
```

---

# 111. CONFIRMATION MICROCOPY

```text
Apakah Anda yakin ingin mengarsipkan pesanan ini?
```

Untuk permanent delete:

```text
Data akan dihapus permanen dan tidak dapat dipulihkan.
```

---

# 112. DESIGN TOKENS

Design system sebaiknya memiliki token:

```text
--color-primary
--color-secondary
--color-accent
--color-success
--color-warning
--color-danger
--color-info

--space-0
--space-1
--space-2
--space-3
--space-4
--space-5
--space-6
--space-7
--space-8
--space-9
--space-10

--radius-sm
--radius-md
--radius-lg

--font-size-sm
--font-size-md
--font-size-lg
```

---

# 113. THEME ARCHITECTURE

Frontend tidak boleh hard-code seluruh warna.

Gunakan:

```text
Theme Configuration
        ↓
CSS Variables
        ↓
Components
```

Contoh:

```css
var(--color-primary)
```

bukan:

```css
#123456
```

di setiap component.

---

# 114. DARK MODE

Dark mode tidak wajib untuk MVP.

Arsitektur harus memungkinkan penambahan:

```text
Light
Dark
System
```

di masa depan.

---

# 115. FRONTEND FOLDER PRINCIPLE

Recommended:

```text
resources/js/
│
├── components/
│
├── layouts/
│
├── pages/
│
├── features/
│
├── hooks/
│
├── services/
│
├── stores/
│
├── utils/
│
├── types/
│
├── constants/
│
└── styles/
```

---

# 116. FEATURE STRUCTURE

Feature-specific code sebaiknya dikelompokkan.

Contoh:

```text
features/
├── customers/
├── orders/
├── products/
├── payments/
├── invoices/
├── production/
├── shipping/
├── reviews/
└── reports/
```

---

# 117. PAGE STRUCTURE

Contoh:

```text
pages/
├── Dashboard/
├── Orders/
│   ├── OrderList.jsx
│   ├── OrderCreate.jsx
│   └── OrderDetail.jsx
│
├── Customers/
├── Products/
├── Payments/
├── Invoices/
├── Production/
├── Shipping/
├── Reviews/
├── Reports/
├── Settings/
└── Admin/
```

Struktur final dapat mengikuti arsitektur frontend yang telah ditentukan di `docs/03-Architecture.md`.

---

# 118. STATE MANAGEMENT

Global state hanya digunakan untuk data yang memang global.

Contoh:

```text
Authenticated User
Theme
Global UI State
```

Jangan memasukkan semua data aplikasi ke global state.

Order data tetap dapat dikelola oleh feature/order state.

---

# 119. SERVER STATE

Data API:

```text
Customers
Orders
Products
Invoices
Reports
```

sebaiknya dikelola sebagai server state.

Recommended architecture dapat menggunakan:

```text
TanStack Query
```

jika library tersebut dipilih dalam implementasi final.

---

# 120. FORM STATE

Form kompleks dapat menggunakan:

```text
React Hook Form
```

dengan validation schema.

Namun library harus tetap mengikuti keputusan final pada `docs/03-Architecture.md` dan `ai/coding-rules.md`.

---

# 121. UI DATA FLOW

```text
API
 ↓
Service
 ↓
Query / State
 ↓
Feature
 ↓
Page
 ↓
Component
```

Component tidak melakukan request API secara sembarangan.

---

# 122. COMPONENT DATA FLOW

Recommended:

```text
Page
 ↓
Feature Container
 ↓
Reusable Component
```

Component presentational sebisa mungkin tidak mengetahui detail backend.

---

# 123. UX ORDER STATUS

Status order selalu ditampilkan konsisten di:

```text
Dashboard
Order list
Order detail
Customer history
Invoice
Activity
Reports
```

---

# 124. UX PAYMENT STATUS

Payment information harus konsisten:

```text
Grand Total
Paid
Remaining
```

Jangan menampilkan angka yang berbeda antara:

```text
Order
Dashboard
Invoice
Customer
```

---

# 125. UX PROFIT

Profit hanya ditampilkan kepada admin.

Perhitungan:

```text
Revenue
-
Product Cost
-
Applicable Business Cost
=
Profit
```

Detail formula mengikuti `docs/05-Database.md` dan business logic backend.

Frontend hanya menampilkan hasil backend.

---

# 126. CUSTOMER EXPERIENCE PREPARATION

MVP belum memiliki customer portal.

Namun UI architecture harus memungkinkan future:

```text
Customer Portal
Customer Login
Order Tracking
Invoice Access
Review Submission
```

tanpa harus membongkar seluruh design system.

---

# 127. FUTURE WHATSAPP INTEGRATION

MVP belum menggunakan WhatsApp API.

Namun action dapat dipersiapkan:

```text
Copy Order Information
Copy Invoice Link
Copy Payment Information
```

Future:

```text
Send via WhatsApp
```

---

# 128. DESIGN ANTI-PATTERNS

Dilarang:

```text
❌ Too many popups
❌ Too many colors
❌ Inconsistent buttons
❌ Random spacing
❌ Random fonts
❌ Full-page reload
❌ Huge forms without grouping
❌ Table overflow without mobile strategy
❌ Hidden destructive actions
❌ Tiny touch targets
❌ Hard-coded theme colors
❌ Duplicate UI components
```

---

# 129. UX PRIORITY

Ketika terdapat konflik:

```text
Usability
    >
Consistency
    >
Performance
    >
Aesthetics
```

Namun performance dan accessibility harus menjadi baseline, bukan fitur tambahan.

---

# 130. UI/UX DEFINITION OF DONE

Sebuah halaman dianggap selesai apabila:

```text
[ ] Responsive
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success feedback
[ ] Validation
[ ] Keyboard accessible
[ ] Mobile usable
[ ] Consistent spacing
[ ] Consistent typography
[ ] Consistent color
[ ] No unnecessary popup
[ ] Search jika diperlukan
[ ] Filter jika diperlukan
[ ] Pagination jika diperlukan
[ ] Permission behavior
[ ] API error handling
```

---

# 131. FINAL FRNDLY UX PRINCIPLE

FRNDLY harus terasa seperti:

```text
Professional
but not complicated.

Powerful
but not overwhelming.

Modern
but not decorative.

Customizable
but still consistent.

Data-rich
but easy to understand.
```

Prinsip utama:

> **FRNDLY harus membantu admin menyelesaikan pekerjaan, bukan membuat admin belajar menggunakan aplikasi.**

---

# END OF UI/UX SPECIFICATION

**FRNDLY — Business Management System**

UI/UX Specification v1.0.0
