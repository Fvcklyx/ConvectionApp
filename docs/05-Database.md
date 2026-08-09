# FRNDLY — DATABASE DESIGN & IMPLEMENTATION SPECIFICATION

**Project:** FRNDLY
**Document:** Database Design & Implementation Specification
**File:** `docs/Database.md`
**Version:** 1.0.0
**Status:** Approved Baseline
**Database Engine:** MySQL / MariaDB
**Framework:** Laravel
**ORM:** Eloquent
**Architecture:** Laravel + React.js
**Environment:** Laragon

---

# 1. PURPOSE

Dokumen ini menerjemahkan struktur entity pada `ERD.md` menjadi spesifikasi teknis database yang dapat langsung digunakan untuk implementasi Laravel Migration dan Eloquent Model.

Dokumen ini menjadi referensi utama untuk:

* Database schema
* Laravel migration
* Foreign key
* Index
* Unique constraint
* Data type
* Nullable rule
* Default value
* Soft delete
* Eloquent relationship
* Database integrity
* Transaction integrity
* Seed data

---

# 2. DATABASE PRINCIPLES

FRNDLY menggunakan prinsip:

> **One Source of Truth**

Artinya setiap informasi utama hanya memiliki satu sumber kebenaran.

Contoh:

```text
Customer
    ↓
customers

Product
    ↓
products

Order
    ↓
orders

Order Product
    ↓
order_items
```

Data dashboard, laporan, invoice, dan customer history harus mengambil data dari entity transaksi yang relevan.

---

# 3. DATABASE ENGINE

Database utama:

```text
MySQL / MariaDB
```

Environment development:

```text
Laragon
```

Environment production:

```text
VPS / Cloud Server
```

Database charset:

```text
utf8mb4
```

Collation:

```text
utf8mb4_unicode_ci
```

Storage engine:

```text
InnoDB
```

---

# 4. NAMING CONVENTION

## 4.1 Table

Gunakan:

```text
snake_case
plural
```

Contoh:

```text
customers
orders
order_items
product_prices
design_revisions
```

---

## 4.2 Primary Key

Semua tabel menggunakan:

```text
id
```

Tipe:

```text
BIGINT UNSIGNED AUTO_INCREMENT
```

Laravel:

```php
$table->id();
```

---

## 4.3 Foreign Key

Format:

```text
{singular_table_name}_id
```

Contoh:

```text
customer_id
order_id
product_id
created_by
```

---

## 4.4 Timestamp

Gunakan:

```php
$table->timestamps();
```

yang menghasilkan:

```text
created_at
updated_at
```

---

## 4.5 Soft Delete

Gunakan:

```php
$table->softDeletes();
```

untuk entity yang mendukung archive.

---

# 5. MONEY / CURRENCY

Semua nilai uang menggunakan:

```text
DECIMAL(15,2)
```

Laravel:

```php
$table->decimal('grand_total', 15, 2)->default(0);
```

Jangan menggunakan:

```text
FLOAT
DOUBLE
```

untuk nilai uang.

---

# 6. QUANTITY

Jumlah produk menggunakan:

```text
UNSIGNED INTEGER
```

Laravel:

```php
$table->unsignedInteger('quantity');
```

---

# 7. PERCENTAGE

Jika suatu saat diperlukan persentase:

```text
DECIMAL(5,2)
```

Contoh:

```text
10.50
```

berarti:

```text
10.50%
```

---

# 8. BOOLEAN

Boolean menggunakan:

```text
BOOLEAN
```

Laravel:

```php
$table->boolean('is_active')->default(true);
```

---

# 9. STATUS

Status bisnis tidak boleh disimpan sebagai angka tanpa arti.

Gunakan string yang eksplisit.

Contoh:

```text
draft
waiting_dp
dp_received
processing
paid
```

Untuk Laravel, status idealnya direpresentasikan menggunakan PHP Enum.

Contoh:

```php
enum OrderStatus: string
{
    case DRAFT = 'draft';
    case WAITING_DP = 'waiting_dp';
    case DP_RECEIVED = 'dp_received';
    case PROCESSING = 'processing';
    case PAID = 'paid';
}
```

Database tetap menyimpan string.

---

# 10. DATABASE TABLE MAP

FRNDLY v1 menggunakan 26 entity:

```text
users
customers
product_categories
products
product_variants
product_prices

orders
order_items
order_item_sizes
payments
invoices

designs
design_revisions

production_orders
production_events

shipments
shipment_events

reviews
testimonials

attachments

activities
audit_logs
reminders

company_settings
application_settings
backups
```

---

# 11. USERS TABLE

## Purpose

Menyimpan akun admin FRNDLY.

## Columns

```text
id
name
username
email
password
avatar
is_active
last_login_at
remember_token
created_at
updated_at
```

## Constraints

```text
username UNIQUE
email UNIQUE
```

## Migration specification

```php
$table->id();

$table->string('name', 100);
$table->string('username', 100)->unique();
$table->string('email')->unique();
$table->string('password');

$table->string('avatar')->nullable();

$table->boolean('is_active')->default(true);

$table->timestamp('last_login_at')->nullable();

$table->rememberToken();

$table->timestamps();
```

---

# 12. CUSTOMERS TABLE

## Purpose

Master data customer.

## Columns

```text
id
name
phone
email
address
city
province
notes
total_orders
total_spent
last_order_at
created_at
updated_at
deleted_at
```

## Migration

```php
$table->id();

$table->string('name', 150);
$table->string('phone', 30);
$table->string('email')->nullable();

$table->text('address')->nullable();

$table->string('city', 100)->nullable();
$table->string('province', 100)->nullable();

$table->text('notes')->nullable();

$table->unsignedInteger('total_orders')->default(0);

$table->decimal('total_spent', 15, 2)->default(0);

$table->timestamp('last_order_at')->nullable();

$table->timestamps();
$table->softDeletes();
```

## Index

```php
$table->index('name');
$table->index('phone');
```

---

# 13. PRODUCT CATEGORIES TABLE

```php
$table->id();

$table->string('name', 100)->unique();

$table->text('description')->nullable();

$table->boolean('is_active')->default(true);

$table->timestamps();
$table->softDeletes();
```

---

# 14. PRODUCTS TABLE

## Foreign Key

```text
category_id → product_categories.id
```

## Migration

```php
$table->id();

$table->foreignId('category_id')
    ->constrained('product_categories')
    ->restrictOnDelete();

$table->string('name', 150);

$table->string('code', 50)->unique();

$table->text('description')->nullable();

$table->string('unit', 30)->default('pcs');

$table->boolean('is_active')->default(true);

$table->timestamps();
$table->softDeletes();
```

---

# 15. PRODUCT VARIANTS TABLE

```php
$table->id();

$table->foreignId('product_id')
    ->constrained('products')
    ->restrictOnDelete();

$table->string('name', 100);

$table->string('value', 100);

$table->timestamps();
$table->softDeletes();

$table->index([
    'product_id',
    'name'
]);
```

Contoh:

```text
product:
Kaos Cotton Combed

variant:
Warna = Hitam
Warna = Putih
Warna = Navy
```

---

# 16. PRODUCT PRICES TABLE

Digunakan untuk menyimpan riwayat harga berdasarkan quantity range.

```php
$table->id();

$table->foreignId('product_id')
    ->constrained('products')
    ->restrictOnDelete();

$table->foreignId('variant_id')
    ->nullable()
    ->constrained('product_variants')
    ->nullOnDelete();

$table->unsignedInteger('min_quantity');

$table->unsignedInteger('max_quantity')
    ->nullable();

$table->decimal('selling_price', 15, 2);

$table->decimal('cost_price', 15, 2);

$table->date('effective_from');

$table->date('effective_until')
    ->nullable();

$table->text('notes')->nullable();

$table->foreignId('created_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();
```

## Rule

Jika:

```text
max_quantity = NULL
```

maka berarti:

```text
unlimited upper range
```

Contoh:

```text
50+
```

---

# 17. ORDERS TABLE

Ini adalah salah satu tabel paling penting dalam FRNDLY.

```php
$table->id();

$table->string('order_number', 30)->unique();

$table->foreignId('customer_id')
    ->constrained('customers')
    ->restrictOnDelete();

$table->string('status', 30);

$table->date('order_date');

$table->date('deadline')->nullable();

$table->decimal('subtotal', 15, 2)->default(0);

$table->string('discount_type', 30)->nullable();

$table->decimal('discount_value', 15, 2)->default(0);

$table->decimal('shipping_cost', 15, 2)->default(0);

$table->decimal('grand_total', 15, 2)->default(0);

$table->decimal('dp_amount', 15, 2)->default(0);

$table->decimal('paid_amount', 15, 2)->default(0);

$table->decimal('remaining_amount', 15, 2)->default(0);

$table->text('notes')->nullable();

$table->text('internal_notes')->nullable();

$table->foreignId('created_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();
$table->softDeletes();

$table->index('status');
$table->index('order_date');
$table->index('deadline');
$table->index('customer_id');
```

---

# 18. ORDER NUMBER

Format:

```text
ORD-YYYYMMDD-XXX
```

Contoh:

```text
ORD-20260808-001
```

Order number harus dibuat oleh backend.

Frontend tidak boleh menentukan nomor order.

---

# 19. ORDER ITEM TABLE

```php
$table->id();

$table->foreignId('order_id')
    ->constrained('orders')
    ->cascadeOnDelete();

$table->foreignId('product_id')
    ->constrained('products')
    ->restrictOnDelete();

$table->string('product_name_snapshot', 150);

$table->json('variant_snapshot')->nullable();

$table->unsignedInteger('quantity');

$table->decimal('unit_price', 15, 2);

$table->decimal('cost_price', 15, 2);

$table->decimal('discount_amount', 15, 2)
    ->default(0);

$table->decimal('subtotal', 15, 2);

$table->text('notes')->nullable();

$table->timestamps();

$table->index('order_id');
$table->index('product_id');
```

---

# 20. SNAPSHOT PRINCIPLE

Ketika order dibuat:

```text
products.name
```

disalin ke:

```text
order_items.product_name_snapshot
```

Harga:

```text
product_prices.selling_price
```

disalin menjadi:

```text
order_items.unit_price
```

Modal:

```text
product_prices.cost_price
```

disalin menjadi:

```text
order_items.cost_price
```

Tujuan:

> Histori transaksi tidak berubah ketika master data berubah.

---

# 21. ORDER ITEM SIZES

```php
$table->id();

$table->foreignId('order_item_id')
    ->constrained('order_items')
    ->cascadeOnDelete();

$table->string('size', 30);

$table->unsignedInteger('quantity');

$table->timestamps();

$table->unique([
    'order_item_id',
    'size'
]);
```

Contoh:

```text
S     10
M     20
L     30
XL    20
XXL   5
```

---

# 22. PAYMENTS TABLE

```php
$table->id();

$table->foreignId('order_id')
    ->constrained('orders')
    ->restrictOnDelete();

$table->string('type', 30);

$table->decimal('amount', 15, 2);

$table->date('payment_date');

$table->foreignId('proof_attachment_id')
    ->nullable()
    ->constrained('attachments')
    ->nullOnDelete();

$table->text('notes')->nullable();

$table->foreignId('recorded_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();

$table->index([
    'order_id',
    'type'
]);
```

---

# 23. PAYMENT RULE

Valid:

```text
DP
Final
```

Business rule:

```text
1 order
    ↓
maximum 1 DP
    ↓
1 final payment
```

Validasi dilakukan di application layer.

Database tidak menjadi satu-satunya lapisan validasi.

---

# 24. INVOICES TABLE

```php
$table->id();

$table->foreignId('order_id')
    ->constrained('orders')
    ->restrictOnDelete();

$table->string('invoice_number', 40)->unique();

$table->string('template', 50)
    ->default('default');

$table->timestamp('issued_at');

$table->decimal('subtotal', 15, 2);

$table->decimal('discount_amount', 15, 2)
    ->default(0);

$table->decimal('shipping_cost', 15, 2)
    ->default(0);

$table->decimal('grand_total', 15, 2);

$table->json('customer_snapshot');

$table->json('company_snapshot');

$table->string('file_path')->nullable();

$table->foreignId('created_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();

$table->index('order_id');
```

---

# 25. INVOICE NUMBER

Format:

```text
INV-YYYYMMDD-XXX
```

Contoh:

```text
INV-20260808-001
```

Nomor invoice harus dihasilkan backend.

---

# 26. INVOICE SNAPSHOT

Invoice menyimpan:

```text
customer_snapshot
company_snapshot
```

agar invoice lama tetap merepresentasikan kondisi ketika invoice diterbitkan.

Contoh:

```json
{
    "name": "PT Example",
    "phone": "08123456789",
    "address": "Surabaya"
}
```

---

# 27. DESIGNS TABLE

```php
$table->id();

$table->foreignId('order_id')
    ->constrained('orders')
    ->cascadeOnDelete();

$table->string('name', 150);

$table->foreignId('current_revision_id')
    ->nullable();

$table->string('status', 30);

$table->text('notes')->nullable();

$table->foreignId('uploaded_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();
$table->softDeletes();

$table->index('order_id');
```

`current_revision_id` membutuhkan perhatian khusus karena menunjuk ke `design_revisions`, yang migration-nya dibuat setelah `designs`.

Foreign key dapat ditambahkan melalui migration terpisah setelah kedua tabel tersedia.

---

# 28. DESIGN REVISIONS TABLE

```php
$table->id();

$table->foreignId('design_id')
    ->constrained('designs')
    ->cascadeOnDelete();

$table->unsignedInteger('revision_number');

$table->foreignId('attachment_id')
    ->constrained('attachments')
    ->restrictOnDelete();

$table->text('notes')->nullable();

$table->string('status', 30);

$table->foreignId('created_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();

$table->unique([
    'design_id',
    'revision_number'
]);
```

---

# 29. PRODUCTION ORDERS

```php
$table->id();

$table->foreignId('order_id')
    ->unique()
    ->constrained('orders')
    ->restrictOnDelete();

$table->string('status', 30);

$table->timestamp('started_at')->nullable();

$table->timestamp('completed_at')->nullable();

$table->text('notes')->nullable();

$table->timestamps();
```

Relationship:

```text
Order 1 : 1 ProductionOrder
```

---

# 30. PRODUCTION EVENTS

```php
$table->id();

$table->foreignId('production_order_id')
    ->constrained('production_orders')
    ->cascadeOnDelete();

$table->string('status', 30);

$table->text('notes')->nullable();

$table->foreignId('created_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();

$table->index([
    'production_order_id',
    'created_at'
]);
```

---

# 31. SHIPMENTS TABLE

```php
$table->id();

$table->foreignId('order_id')
    ->constrained('orders')
    ->restrictOnDelete();

$table->string('recipient_name', 150);

$table->string('recipient_phone', 30)->nullable();

$table->text('address');

$table->string('city', 100)->nullable();

$table->string('province', 100)->nullable();

$table->string('courier', 100)->nullable();

$table->string('service', 100)->nullable();

$table->string('tracking_number', 100)->nullable();

$table->decimal('shipping_cost', 15, 2)
    ->default(0);

$table->string('status', 30);

$table->timestamp('shipped_at')->nullable();

$table->timestamp('delivered_at')->nullable();

$table->text('notes')->nullable();

$table->timestamps();

$table->index('order_id');
$table->index('tracking_number');
```

---

# 32. SHIPMENT EVENTS

```php
$table->id();

$table->foreignId('shipment_id')
    ->constrained('shipments')
    ->cascadeOnDelete();

$table->string('status', 30);

$table->text('notes')->nullable();

$table->foreignId('created_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();

$table->index([
    'shipment_id',
    'created_at'
]);
```

---

# 33. REVIEWS TABLE

```php
$table->id();

$table->foreignId('order_id')
    ->constrained('orders')
    ->restrictOnDelete();

$table->foreignId('customer_id')
    ->constrained('customers')
    ->restrictOnDelete();

$table->unsignedTinyInteger('rating');

$table->text('review_text')->nullable();

$table->boolean('is_published')
    ->default(false);

$table->timestamps();

$table->unique('order_id');

$table->index('customer_id');
```

---

# 34. RATING RULE

Rating:

```text
1–10
```

Backend validation:

```text
rating >= 1
rating <= 10
```

Review hanya dapat dibuat apabila:

```text
order.status = paid
```

---

# 35. TESTIMONIALS TABLE

```php
$table->id();

$table->foreignId('review_id')
    ->constrained('reviews')
    ->restrictOnDelete();

$table->foreignId('customer_id')
    ->constrained('customers')
    ->restrictOnDelete();

$table->text('quote');

$table->foreignId('photo_attachment_id')
    ->nullable()
    ->constrained('attachments')
    ->nullOnDelete();

$table->boolean('is_featured')
    ->default(false);

$table->boolean('is_published')
    ->default(false);

$table->timestamps();

$table->index('customer_id');
```

---

# 36. ATTACHMENTS TABLE

Universal file system.

```php
$table->id();

$table->foreignId('uploaded_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->string('original_name');

$table->string('stored_name');

$table->string('path');

$table->string('disk', 50);

$table->string('mime_type', 100);

$table->string('extension', 20)->nullable();

$table->unsignedBigInteger('size');

$table->string('checksum', 128)->nullable();

$table->timestamps();
$table->softDeletes();
```

Index:

```php
$table->index('checksum');
```

---

# 37. ATTACHMENT SECURITY

File upload harus divalidasi berdasarkan:

```text
MIME type
Extension
File size
Checksum
Storage path
```

File user tidak boleh langsung disimpan ke:

```text
/public
```

untuk file yang bersifat private.

Gunakan Laravel filesystem.

---

# 38. ACTIVITIES TABLE

```php
$table->id();

$table->foreignId('user_id')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->string('action', 100);

$table->text('description');

$table->string('subject_type', 100)->nullable();

$table->unsignedBigInteger('subject_id')->nullable();

$table->json('metadata')->nullable();

$table->timestamp('created_at')->useCurrent();

$table->index([
    'subject_type',
    'subject_id'
]);

$table->index([
    'user_id',
    'created_at'
]);
```

---

# 39. AUDIT LOGS TABLE

```php
$table->id();

$table->foreignId('user_id')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->string('event', 50);

$table->string('auditable_type', 100);

$table->unsignedBigInteger('auditable_id');

$table->json('old_values')->nullable();

$table->json('new_values')->nullable();

$table->ipAddress('ip_address')->nullable();

$table->text('user_agent')->nullable();

$table->timestamp('created_at')->useCurrent();

$table->index([
    'auditable_type',
    'auditable_id'
]);

$table->index([
    'user_id',
    'created_at'
]);
```

---

# 40. REMINDERS TABLE

```php
$table->id();

$table->foreignId('user_id')
    ->constrained('users')
    ->cascadeOnDelete();

$table->string('type', 50);

$table->string('title', 150);

$table->text('description')->nullable();

$table->timestamp('remind_at');

$table->string('status', 30)
    ->default('pending');

$table->string('related_type', 100)->nullable();

$table->unsignedBigInteger('related_id')->nullable();

$table->timestamp('completed_at')->nullable();

$table->timestamps();

$table->index([
    'related_type',
    'related_id'
]);

$table->index([
    'user_id',
    'status',
    'remind_at'
]);
```

---

# 41. COMPANY SETTINGS TABLE

FRNDLY pada tahap awal hanya menggunakan satu perusahaan.

```php
$table->id();

$table->string('company_name', 150);

$table->foreignId('logo_attachment_id')
    ->nullable()
    ->constrained('attachments')
    ->nullOnDelete();

$table->string('phone', 30)->nullable();

$table->string('email')->nullable();

$table->text('address')->nullable();

$table->string('city', 100)->nullable();

$table->string('province', 100)->nullable();

$table->string('website')->nullable();

$table->text('invoice_footer')->nullable();

$table->timestamps();
```

---

# 42. APPLICATION SETTINGS TABLE

Digunakan untuk konfigurasi aplikasi.

```php
$table->id();

$table->string('key', 150)->unique();

$table->json('value')->nullable();

$table->string('group', 100)->nullable();

$table->foreignId('updated_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();
```

Contoh:

```text
theme.primary_color
theme.secondary_color
theme.status_colors
invoice.default_template
dashboard.default_period
```

---

# 43. BACKUPS TABLE

```php
$table->id();

$table->string('type', 30);

$table->string('file_path');

$table->unsignedBigInteger('file_size')->nullable();

$table->string('checksum', 128)->nullable();

$table->string('status', 30);

$table->timestamp('started_at')->nullable();

$table->timestamp('completed_at')->nullable();

$table->foreignId('created_by')
    ->nullable()
    ->constrained('users')
    ->nullOnDelete();

$table->timestamps();

$table->index('status');
$table->index('created_at');
```

---

# 44. FOREIGN KEY DELETE POLICY

FRNDLY tidak menggunakan:

```text
CASCADE
```

secara default.

Penggunaan harus disesuaikan dengan jenis data.

---

## 44.1 Master Data

Contoh:

```text
products → product_categories
```

Gunakan:

```php
->restrictOnDelete()
```

agar data tidak dapat dihapus jika masih digunakan.

---

## 44.2 Child Transaction

Contoh:

```text
orders → order_items
```

Boleh:

```php
->cascadeOnDelete()
```

karena order item tidak memiliki arti tanpa order.

Namun jika order sudah menjadi transaksi resmi, penghapusan order harus dicegah oleh business logic.

---

## 44.3 User Reference

Contoh:

```text
created_by → users
```

Gunakan:

```php
->nullOnDelete()
```

agar histori tetap ada jika user dihapus.

---

# 45. SOFT DELETE POLICY

Soft delete digunakan untuk data yang mungkin perlu dipulihkan.

Recommended:

```text
customers
products
product_categories
product_variants
orders
designs
attachments
```

---

# 46. TRANSACTION DELETE POLICY

Order yang sudah:

```text
DP
```

atau:

```text
PAID
```

tidak boleh benar-benar dihapus melalui operasi biasa.

Sebaliknya:

```text
Archive
```

digunakan.

Permanent delete hanya melalui mekanisme khusus.

---

# 47. DATABASE TRANSACTION

Operasi berikut harus menggunakan database transaction:

```text
Create Order
Update Order
Record DP
Record Final Payment
Generate Invoice
Create Production Order
Complete Production
Create Shipment
Create Review
```

Contoh konsep:

```php
DB::transaction(function () {

    // create order

    // create order items

    // create payment

    // update totals

});
```

Jika satu proses gagal:

```text
ROLLBACK
```

---

# 48. ORDER CREATION TRANSACTION

Ketika order dibuat:

```text
BEGIN
 ↓
Create Order
 ↓
Create Order Items
 ↓
Create Sizes
 ↓
Calculate Subtotal
 ↓
Calculate Discount
 ↓
Calculate Shipping
 ↓
Calculate Grand Total
 ↓
Commit
```

Tidak boleh menghasilkan order setengah jadi.

---

# 49. PAYMENT TRANSACTION

Ketika DP masuk:

```text
BEGIN
 ↓
Validate Order
 ↓
Validate DP
 ↓
Create Payment
 ↓
Update paid_amount
 ↓
Update remaining_amount
 ↓
Update order status
 ↓
Commit
```

---

# 50. MONEY CALCULATION

Formula:

```text
subtotal
=
Σ(order_item.subtotal)
```

Kemudian:

```text
discount_amount
=
discount berdasarkan business rule
```

Kemudian:

```text
grand_total
=
subtotal
-
discount
+
shipping
```

Kemudian:

```text
remaining_amount
=
grand_total
-
paid_amount
```

Nilai tersebut harus dihitung oleh backend.

Frontend hanya menampilkan preview.

---

# 51. PROFIT CALCULATION

Per order:

```text
revenue
=
Σ(order_items.subtotal)
-
discount
```

Cost:

```text
cost
=
Σ(order_items.cost_price × quantity)
```

Profit dasar:

```text
profit
=
revenue - cost
```

Jika shipping atau operational cost diperhitungkan:

```text
net_profit
=
revenue
-
product_cost
-
shipping_cost
-
other_operational_cost
```

Business rule final dapat diperluas kemudian.

---

# 52. CUSTOMER AGGREGATE

Customer memiliki:

```text
total_orders
total_spent
last_order_at
```

Tetapi data tersebut merupakan:

> **Cached Aggregate**

bukan sumber kebenaran utama.

Source:

```text
orders
```

---

# 53. REPEAT ORDER

Repeat order:

```text
COUNT(completed/relevant orders)
```

Customer dapat ditandai sebagai repeat customer jika:

```text
total_orders >= 2
```

Threshold dapat dibuat configurable jika dibutuhkan.

---

# 54. DISCOUNT

FRNDLY mendukung:

```text
Percentage Discount
Fixed Discount
Quantity-based Discount
```

Namun:

> Nilai dan kondisi discount ditentukan oleh admin.

Database hanya menyimpan hasil transaksi.

---

# 55. PRICE HISTORY

Harga tidak boleh overwrite histori.

Contoh:

```text
2026-01
Kaos = 50.000

2026-06
Kaos = 55.000
```

Keduanya tetap tersimpan dalam:

```text
product_prices
```

Order lama tetap:

```text
50.000
```

Order baru:

```text
55.000
```

---

# 56. INDEX STRATEGY

Index diprioritaskan pada:

```text
Foreign Key
Search Field
Filter Field
Sorting Field
Unique Field
Date Field
Status Field
```

Contoh:

```text
orders.customer_id
orders.status
orders.order_date
orders.deadline
customers.name
customers.phone
products.code
invoices.invoice_number
```

---

# 57. SEARCH OPTIMIZATION

Global search tahap awal dapat menggunakan:

```text
LIKE
```

atau Laravel query builder.

Field utama:

```text
customers.name
customers.phone
orders.order_number
products.name
products.code
invoices.invoice_number
```

Jika dataset sudah sangat besar, dapat dipertimbangkan:

```text
Laravel Scout
Meilisearch
Typesense
```

tetapi **belum diperlukan pada MVP**.

---

# 58. DATABASE NORMALIZATION

FRNDLY menggunakan prinsip relational normalization.

Target:

```text
3NF
```

Namun snapshot diperbolehkan untuk kebutuhan histori.

Contoh:

```text
order_items.product_name_snapshot
```

bukan pelanggaran desain karena digunakan untuk historical integrity.

---

# 59. JSON POLICY

JSON hanya digunakan untuk:

```text
Snapshot
Metadata
Flexible Configuration
Audit Data
```

Jangan menyimpan entity relational utama dalam JSON.

Tidak boleh:

```json
{
    "customer": {
        "id": 10,
        "name": "..."
    }
}
```

sebagai pengganti:

```text
orders.customer_id
```

---

# 60. MIGRATION ORDER

Migration harus dibuat berdasarkan dependency.

Urutan:

```text
01 users

02 attachments

03 product_categories
04 products
05 product_variants
06 product_prices

07 customers

08 orders
09 order_items
10 order_item_sizes

11 payments
12 invoices

13 designs
14 design_revisions

15 production_orders
16 production_events

17 shipments
18 shipment_events

19 reviews
20 testimonials

21 activities
22 audit_logs
23 reminders

24 company_settings
25 application_settings
26 backups
```

---

# 61. LARAVEL MIGRATION NAMING

Contoh:

```text
2026_08_08_000001_create_users_table.php
2026_08_08_000002_create_attachments_table.php
2026_08_08_000003_create_product_categories_table.php
...
```

Laravel akan menggunakan timestamp migration.

Jangan mengubah timestamp migration yang sudah dijalankan pada production.

---

# 62. MODEL STRUCTURE

Setiap entity utama memiliki Eloquent Model.

Contoh:

```text
app/Models/
├── User.php
├── Customer.php
├── ProductCategory.php
├── Product.php
├── ProductVariant.php
├── ProductPrice.php
├── Order.php
├── OrderItem.php
├── OrderItemSize.php
├── Payment.php
├── Invoice.php
├── Design.php
├── DesignRevision.php
├── ProductionOrder.php
├── ProductionEvent.php
├── Shipment.php
├── ShipmentEvent.php
├── Review.php
├── Testimonial.php
├── Attachment.php
├── Activity.php
├── AuditLog.php
├── Reminder.php
├── CompanySetting.php
├── ApplicationSetting.php
└── Backup.php
```

---

# 63. ELOQUENT RELATIONSHIP

## Customer

```php
public function orders()
{
    return $this->hasMany(Order::class);
}

public function reviews()
{
    return $this->hasMany(Review::class);
}
```

---

## Order

```php
public function customer()
{
    return $this->belongsTo(Customer::class);
}

public function items()
{
    return $this->hasMany(OrderItem::class);
}

public function payments()
{
    return $this->hasMany(Payment::class);
}

public function invoices()
{
    return $this->hasMany(Invoice::class);
}

public function designs()
{
    return $this->hasMany(Design::class);
}

public function production()
{
    return $this->hasOne(ProductionOrder::class);
}

public function shipments()
{
    return $this->hasMany(Shipment::class);
}

public function review()
{
    return $this->hasOne(Review::class);
}
```

---

# 64. PRODUCT RELATIONSHIP

```php
public function category()
{
    return $this->belongsTo(ProductCategory::class);
}

public function variants()
{
    return $this->hasMany(ProductVariant::class);
}

public function prices()
{
    return $this->hasMany(ProductPrice::class);
}

public function orderItems()
{
    return $this->hasMany(OrderItem::class);
}
```

---

# 65. ORDER ITEM RELATIONSHIP

```php
public function order()
{
    return $this->belongsTo(Order::class);
}

public function product()
{
    return $this->belongsTo(Product::class);
}

public function sizes()
{
    return $this->hasMany(OrderItemSize::class);
}
```

---

# 66. DESIGN RELATIONSHIP

```php
public function order()
{
    return $this->belongsTo(Order::class);
}

public function revisions()
{
    return $this->hasMany(DesignRevision::class);
}

public function currentRevision()
{
    return $this->belongsTo(
        DesignRevision::class,
        'current_revision_id'
    );
}
```

---

# 67. PRODUCTION RELATIONSHIP

```php
public function order()
{
    return $this->belongsTo(Order::class);
}

public function events()
{
    return $this->hasMany(ProductionEvent::class);
}
```

---

# 68. SHIPMENT RELATIONSHIP

```php
public function order()
{
    return $this->belongsTo(Order::class);
}

public function events()
{
    return $this->hasMany(ShipmentEvent::class);
}
```

---

# 69. REVIEW RELATIONSHIP

```php
public function order()
{
    return $this->belongsTo(Order::class);
}

public function customer()
{
    return $this->belongsTo(Customer::class);
}

public function testimonial()
{
    return $this->hasOne(Testimonial::class);
}
```

---

# 70. SEEDING STRATEGY

Development database harus memiliki seed data.

Minimal:

```text
Admin User
Company Setting
Product Categories
Products
Product Variants
Product Prices
```

Contoh category:

```text
Kaos
Jaket
Lanyard
ID Card
Event Attribute
```

---

# 71. FACTORY STRATEGY

Factory dibuat untuk:

```text
Customer
Order
OrderItem
Product
Payment
Review
```

Tujuannya:

* testing
* development
* demo
* performance testing

---

# 72. DATABASE TESTING

Minimal test:

```text
Customer creation
Product creation
Order creation
Multiple order items
Multiple sizes
DP creation
Final payment
Invoice generation
Review after paid order
Production lifecycle
Shipment lifecycle
Soft delete
Audit log
```

---

# 73. INTEGRITY TEST

Test:

```text
Order total
=
Σ order items
-
discount
+
shipping
```

Test:

```text
remaining_amount
=
grand_total
-
paid_amount
```

Test:

```text
size quantity
=
order item quantity
```

---

# 74. SECURITY

Database credentials tidak boleh disimpan dalam repository.

Gunakan:

```text
.env
```

Contoh:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=frndly
DB_USERNAME=root
DB_PASSWORD=
```

`.env` harus masuk `.gitignore`.

---

# 75. PRODUCTION DATABASE

Production:

```text
DB_CONNECTION=mysql
DB_HOST=<PRIVATE_HOST>
DB_PORT=3306
DB_DATABASE=<PRIVATE_DATABASE>
DB_USERNAME=<PRIVATE_USERNAME>
DB_PASSWORD=<PRIVATE_PASSWORD>
```

Credentials tidak boleh ditulis dalam:

```text
README
SRS
ERD
Database.md
GitHub
```

---

# 76. BACKUP STRATEGY

FRNDLY membutuhkan:

```text
Manual Backup
Automatic Backup
Backup History
Restore Capability
```

Backup database minimal mencakup:

```text
Database
Uploaded Files
Application Configuration
```

Backup harus berada di storage terpisah jika memungkinkan.

---

# 77. ARCHIVE STRATEGY

Data yang sudah tidak aktif:

```text
Soft Delete
```

Data archive:

```text
Archive Page
```

Permanent deletion:

```text
Admin Confirmation
+
Audit Log
```

Permanent deletion tidak boleh dilakukan dari UI normal.

---

# 78. DATABASE PERFORMANCE

Prinsip:

```text
Index correctly
Avoid N+1 queries
Use eager loading
Paginate large datasets
Select only required columns
Use aggregate queries
Cache expensive configuration
```

Contoh:

```php
Order::with([
    'customer',
    'items.product'
])->paginate(20);
```

---

# 79. PAGINATION

Default pagination:

```text
20 records/page
```

Untuk:

```text
Customers
Orders
Products
Invoices
Activities
Audit Logs
```

Admin dapat mengubah jumlah:

```text
10
20
50
100
```

jika UI mendukung.

---

# 80. SOFT DELETE QUERY

Normal:

```php
Customer::query()->get();
```

Archive:

```php
Customer::onlyTrashed()->get();
```

Restore:

```php
$customer->restore();
```

Permanent delete:

```php
$customer->forceDelete();
```

`forceDelete()` harus dibatasi pada service/action khusus.

---

# 81. DATABASE SOURCE OF TRUTH

Source of truth:

```text
Customer information
    → customers

Product information
    → products

Product price history
    → product_prices

Order information
    → orders

Order product
    → order_items

Payment
    → payments

Invoice
    → invoices

Production
    → production_orders

Shipping
    → shipments

Review
    → reviews

Testimonial
    → testimonials
```

---

# 82. WHAT MUST NOT HAPPEN

Jangan:

```text
❌ Menyimpan order hanya dalam JSON
❌ Menyimpan customer hanya dalam invoice
❌ Mengambil harga lama dari products
❌ Menghapus transaction secara langsung
❌ Menggunakan FLOAT untuk uang
❌ Membuat foreign key sembarangan
❌ Menyimpan password plaintext
❌ Menaruh database credentials di source code
❌ Menggunakan frontend sebagai sumber perhitungan final
❌ Membuat dashboard menyimpan data transaksi duplikat
```

---

# 83. FRONTEND VS BACKEND RESPONSIBILITY

Frontend:

```text
Input
Preview
UX
Validation awal
Display
```

Backend:

```text
Validation final
Business logic
Price calculation
Discount calculation
Payment calculation
Invoice numbering
Order numbering
Authorization
Database transaction
```

Database:

```text
Persistence
Relationship
Constraint
Integrity
History
```

---

# 84. DATABASE FLOW

```text
React.js
   │
   │ HTTP Request
   ▼
Laravel Controller
   │
   ▼
Form Request Validation
   │
   ▼
Service / Action
   │
   ▼
Eloquent Model
   │
   ▼
MySQL / MariaDB
```

Response:

```text
MySQL
   ↓
Eloquent
   ↓
Resource / DTO
   ↓
Laravel API
   ↓
React.js
```

---

# 85. MVP DATABASE SCOPE

MVP tidak harus langsung mengaktifkan seluruh 26 entity.

Prioritas:

```text
PHASE 1

users
customers
product_categories
products
product_variants
product_prices
```

Kemudian:

```text
PHASE 2

orders
order_items
order_item_sizes
payments
invoices
```

Kemudian:

```text
PHASE 3

attachments
designs
design_revisions
production_orders
production_events
```

Kemudian:

```text
PHASE 4

shipments
reviews
testimonials
```

Kemudian:

```text
PHASE 5

activities
audit_logs
reminders
backups
settings
```

---

# 86. DATABASE VERSIONING

Database schema mengikuti Laravel migration.

Setiap perubahan:

```text
Migration
+
Model update
+
Test
+
Documentation update
```

Jangan mengedit database production secara manual tanpa migration.

---

# 87. CHANGE MANAGEMENT

Jika struktur database berubah:

```text
1. Update requirement
2. Update SRS
3. Update ERD
4. Update Database.md
5. Create migration
6. Update Model
7. Update tests
8. Run migration
```

---

# 88. DATABASE DEFINITION OF DONE

Database dianggap siap apabila:

```text
[ ] Semua migration berhasil
[ ] Foreign key valid
[ ] Index valid
[ ] Unique constraint valid
[ ] Seeder berhasil
[ ] Factory berhasil
[ ] Model relationship berhasil
[ ] Soft delete bekerja
[ ] Transaction bekerja
[ ] Order calculation benar
[ ] Payment calculation benar
[ ] Invoice generation dapat mengambil data
[ ] Test database berhasil
```

---

# 89. FINAL DATABASE ARCHITECTURE

```text
                    FRNDLY DATABASE
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    MASTER DATA       TRANSACTION       SYSTEM
        │                 │                 │
        ├─ Customers      ├─ Orders         ├─ Users
        ├─ Products       ├─ Items          ├─ Audit
        ├─ Variants       ├─ Payments       ├─ Activity
        ├─ Prices         └─ Invoices       ├─ Reminder
        └─ Categories                       ├─ Backup
                                            └─ Settings
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         Production    Shipping    Customer
            │             │        Experience
            ▼             ▼           │
         Designs       Shipments       ├─ Reviews
         Production                    └─ Testimonials
```

---

# 90. FINAL PRINCIPLE

Database FRNDLY harus memenuhi lima prinsip:

```text
1. Consistent
2. Traceable
3. Historical
4. Secure
5. Scalable
```

Tujuan akhirnya bukan sekadar membuat database yang dapat menyimpan data.

Database harus mampu menjawab:

```text
Siapa customer?
Apa yang dipesan?
Kapan dipesan?
Berapa jumlahnya?
Berapa harga saat itu?
Berapa modalnya?
Berapa discount?
Berapa DP?
Berapa pelunasannya?
Apakah sudah lunas?
Bagaimana proses produksinya?
Bagaimana pengirimannya?
Apakah ada review?
Berapa ratingnya?
Apa yang berubah?
Siapa yang mengubah?
Kapan perubahan terjadi?
```

Dengan demikian database FRNDLY dapat menjadi fondasi utama untuk:

```text
Dashboard
Customer Management
Order Management
Product Management
Pricing
Payment
Invoice
Production
Shipping
Review
Reporting
Audit
Backup
```

---

# END OF DATABASE SPECIFICATION

**FRNDLY — Business Management System**

Database Design & Implementation Specification v1.0.0
