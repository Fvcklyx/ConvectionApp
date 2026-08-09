# FRNDLY — API SPECIFICATION

**Project:** FRNDLY
**Document:** API Specification
**File:** `docs/API.md`
**Version:** 1.0.0
**Status:** Approved Baseline
**Backend:** Laravel
**Frontend:** React.js
**Database:** MySQL / MariaDB
**Authentication:** Laravel Sanctum
**API Style:** RESTful JSON API
**Language:** Indonesian
**Environment:** Laragon → VPS/Cloud

---

# 1. PURPOSE

Dokumen ini mendefinisikan kontrak API antara:

```text
React.js
    ↓
HTTP/JSON
    ↓
Laravel API
    ↓
Service / Action
    ↓
Eloquent
    ↓
MySQL / MariaDB
```

API menjadi sumber aturan komunikasi antara frontend dan backend.

---

# 2. API PRINCIPLES

FRNDLY API harus:

```text
RESTful
Consistent
Predictable
Secure
Validated
Stateless
Versioned
Documented
```

Frontend tidak boleh mengetahui detail internal database.

---

# 3. BASE URL

Development:

```text
http://frndly.test/api
```

atau jika menggunakan Laravel development server:

```text
http://127.0.0.1:8000/api
```

Production:

```text
https://<domain>/api
```

API version:

```text
/api/v1
```

Sehingga endpoint final:

```text
/api/v1/...
```

Contoh:

```text
GET /api/v1/customers
```

---

# 4. CONTENT TYPE

Request:

```http
Content-Type: application/json
Accept: application/json
```

Response:

```http
Content-Type: application/json
```

File upload menggunakan:

```http
multipart/form-data
```

---

# 5. AUTHENTICATION

FRNDLY menggunakan:

```text
Laravel Sanctum
```

Authentication berbasis:

```text
Bearer Token
```

Header:

```http
Authorization: Bearer <token>
```

Endpoint yang membutuhkan login menggunakan middleware:

```text
auth:sanctum
```

---

# 6. PUBLIC VS PROTECTED API

## Public

Hanya endpoint yang memang diperlukan tanpa authentication.

Contoh:

```text
GET /health
```

Review submission dapat dibuat public hanya jika mekanisme token/order verification sudah tersedia.

Untuk MVP, sebagian besar API bersifat protected.

---

# 7. RESPONSE FORMAT

Semua response sukses menggunakan struktur konsisten.

```json
{
    "success": true,
    "message": "Data berhasil diambil.",
    "data": {}
}
```

---

# 8. PAGINATED RESPONSE

```json
{
    "success": true,
    "message": "Data berhasil diambil.",
    "data": [],
    "meta": {
        "current_page": 1,
        "per_page": 20,
        "total": 100,
        "last_page": 5
    }
}
```

---

# 9. ERROR RESPONSE

```json
{
    "success": false,
    "message": "Terjadi kesalahan.",
    "errors": {}
}
```

---

# 10. VALIDATION ERROR

HTTP:

```text
422 Unprocessable Entity
```

Response:

```json
{
    "success": false,
    "message": "Data yang diberikan tidak valid.",
    "errors": {
        "name": [
            "Nama wajib diisi."
        ],
        "phone": [
            "Nomor HP tidak valid."
        ]
    }
}
```

---

# 11. AUTHENTICATION ERROR

HTTP:

```text
401 Unauthorized
```

```json
{
    "success": false,
    "message": "Anda belum terautentikasi."
}
```

---

# 12. AUTHORIZATION ERROR

HTTP:

```text
403 Forbidden
```

```json
{
    "success": false,
    "message": "Anda tidak memiliki akses."
}
```

---

# 13. NOT FOUND

HTTP:

```text
404 Not Found
```

```json
{
    "success": false,
    "message": "Data tidak ditemukan."
}
```

---

# 14. SERVER ERROR

HTTP:

```text
500 Internal Server Error
```

Production response:

```json
{
    "success": false,
    "message": "Terjadi kesalahan pada server."
}
```

Detail internal tidak boleh dikirim ke frontend production.

---

# 15. HTTP METHODS

| Method | Fungsi                 |
| ------ | ---------------------- |
| GET    | Mengambil data         |
| POST   | Membuat data           |
| PUT    | Mengubah data penuh    |
| PATCH  | Mengubah sebagian data |
| DELETE | Menghapus/archive data |

---

# 16. RESOURCE CONVENTION

Gunakan plural noun.

Benar:

```text
/customers
/orders
/products
/invoices
```

Jangan:

```text
/getCustomers
/createOrder
/updateProduct
```

---

# 17. AUTH API

## POST `/api/v1/auth/login`

Login admin.

Request:

```json
{
    "username": "admin",
    "password": "password"
}
```

Response:

```json
{
    "success": true,
    "message": "Login berhasil.",
    "data": {
        "user": {},
        "token": "..."
    }
}
```

---

## POST `/api/v1/auth/logout`

Protected.

Response:

```json
{
    "success": true,
    "message": "Logout berhasil."
}
```

---

## GET `/api/v1/auth/me`

Mengambil user yang sedang login.

Response:

```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Admin",
        "username": "admin",
        "email": "admin@example.com"
    }
}
```

---

# 18. CUSTOMER API

Base:

```text
/api/v1/customers
```

---

## GET `/customers`

Mengambil daftar customer.

Query:

```text
?page=1
&per_page=20
&search=andi
&status=active
&sort=name
&direction=asc
```

Response:

```json
{
    "success": true,
    "data": [],
    "meta": {}
}
```

---

## POST `/customers`

Create customer.

Request:

```json
{
    "name": "Andi",
    "phone": "08123456789",
    "email": "andi@example.com",
    "address": "Jl. Example",
    "city": "Surabaya",
    "province": "Jawa Timur",
    "notes": "Customer event."
}
```

---

## GET `/customers/{id}`

Detail customer.

Response harus dapat mencakup:

```text
Profile
Order count
Total spending
Last order
Order history
Reviews
```

---

## PUT `/customers/{id}`

Update customer.

---

## DELETE `/customers/{id}`

Soft delete customer.

---

## POST `/customers/{id}/restore`

Restore customer.

---

## GET `/customers/{id}/orders`

Riwayat pesanan customer.

Query:

```text
?page=1
&status=paid
```

---

# 19. PRODUCT CATEGORY API

Base:

```text
/api/v1/product-categories
```

Endpoints:

```text
GET    /product-categories
POST   /product-categories
GET    /product-categories/{id}
PUT    /product-categories/{id}
DELETE /product-categories/{id}
POST   /product-categories/{id}/restore
```

---

# 20. PRODUCT API

Base:

```text
/api/v1/products
```

Endpoints:

```text
GET    /products
POST   /products
GET    /products/{id}
PUT    /products/{id}
DELETE /products/{id}
POST   /products/{id}/restore
```

---

## GET `/products`

Query:

```text
?search=kaos
&category_id=1
&is_active=true
&sort=name
&direction=asc
&page=1
```

---

# 21. PRODUCT DETAIL

Response:

```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Kaos Cotton Combed",
        "code": "KSS-001",
        "category": {},
        "variants": [],
        "prices": []
    }
}
```

---

# 22. PRODUCT VARIANT API

Base:

```text
/api/v1/products/{product}/variants
```

Endpoints:

```text
GET
POST
PUT
DELETE
```

Contoh variant:

```json
{
    "name": "Warna",
    "value": "Hitam"
}
```

---

# 23. PRODUCT PRICE API

Base:

```text
/api/v1/products/{product}/prices
```

Create price:

```json
{
    "min_quantity": 1,
    "max_quantity": 20,
    "selling_price": 75000,
    "cost_price": 50000,
    "effective_from": "2026-08-08"
}
```

---

# 24. PRICE HISTORY

```text
GET /products/{product}/prices
```

Response harus menampilkan histori.

Contoh:

```json
{
    "data": [
        {
            "min_quantity": 1,
            "max_quantity": 20,
            "selling_price": 75000,
            "effective_from": "2026-08-08"
        },
        {
            "min_quantity": 21,
            "max_quantity": 50,
            "selling_price": 70000,
            "effective_from": "2026-08-08"
        }
    ]
}
```

---

# 25. ORDER API

Base:

```text
/api/v1/orders
```

Endpoints:

```text
GET    /orders
POST   /orders
GET    /orders/{id}
PUT    /orders/{id}
DELETE /orders/{id}
POST   /orders/{id}/restore
```

---

# 26. CREATE ORDER

Endpoint:

```text
POST /orders
```

Request:

```json
{
    "customer_id": 1,
    "deadline": "2026-08-20",
    "shipping_cost": 15000,
    "discount_type": "fixed",
    "discount_value": 50000,
    "notes": "Pesanan event.",
    "internal_notes": "Prioritaskan produksi.",
    "items": [
        {
            "product_id": 1,
            "variant": {
                "Warna": "Hitam"
            },
            "quantity": 50,
            "unit_price": 70000,
            "notes": "Logo depan.",
            "sizes": [
                {
                    "size": "M",
                    "quantity": 20
                },
                {
                    "size": "L",
                    "quantity": 30
                }
            ]
        }
    ]
}
```

Backend wajib:

```text
Validate customer
Validate product
Validate quantity
Validate price
Calculate subtotal
Calculate discount
Calculate shipping
Calculate grand total
Calculate remaining amount
Generate order number
Create order
Create items
Create sizes
Create activity
Create audit log
```

---

# 27. ORDER NUMBER

Frontend tidak mengirim:

```json
{
    "order_number": "ORD-..."
}
```

Backend yang menghasilkan.

Format:

```text
ORD-YYYYMMDD-XXX
```

---

# 28. ORDER STATUS API

Endpoint:

```text
PATCH /orders/{id}/status
```

Request:

```json
{
    "status": "processing"
}
```

Allowed:

```text
draft
waiting_dp
dp_received
processing
paid
```

---

# 29. STATUS TRANSITION

Valid transition:

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

Backend harus menolak transition yang tidak valid.

Contoh:

```text
paid → draft
```

tidak diperbolehkan melalui endpoint normal.

---

# 30. ORDER TIMELINE

```text
GET /orders/{id}/timeline
```

Response:

```json
{
    "success": true,
    "data": [
        {
            "type": "order_status",
            "status": "waiting_dp",
            "description": "Menunggu pembayaran DP.",
            "created_at": "2026-08-08T10:00:00Z"
        },
        {
            "type": "payment",
            "description": "DP diterima.",
            "created_at": "2026-08-08T12:00:00Z"
        }
    ]
}
```

Timeline mengambil data dari:

```text
activities
payments
production_events
shipment_events
audit_logs
```

---

# 31. ORDER ITEM API

Untuk edit item tertentu:

```text
PUT /orders/{order}/items/{item}
```

Delete:

```text
DELETE /orders/{order}/items/{item}
```

Tetapi perubahan order harus mengikuti business rules.

---

# 32. PAYMENT API

Base:

```text
/api/v1/orders/{order}/payments
```

---

## POST `/orders/{order}/payments`

Request:

```json
{
    "type": "dp",
    "amount": 500000,
    "payment_date": "2026-08-08",
    "proof_attachment_id": 10,
    "notes": "Bukti transfer via WhatsApp."
}
```

---

# 33. PAYMENT TYPE

Allowed:

```text
dp
final
```

Rules:

```text
DP hanya sekali.
Final payment setelah DP.
Total payment tidak boleh melebihi grand total.
```

---

# 34. PAYMENT RESPONSE

```json
{
    "success": true,
    "message": "Pembayaran berhasil dicatat.",
    "data": {
        "payment": {},
        "order": {
            "paid_amount": 500000,
            "remaining_amount": 1000000,
            "status": "dp_received"
        }
    }
}
```

---

# 35. INVOICE API

Base:

```text
/api/v1/orders/{order}/invoices
```

---

## GET `/orders/{order}/invoices`

Mengambil invoice order.

---

## POST `/orders/{order}/invoices`

Generate invoice.

Backend menghasilkan:

```text
Invoice Number
PDF
Invoice Snapshot
```

---

## GET `/invoices/{invoice}`

Detail invoice.

---

## GET `/invoices/{invoice}/download`

Download PDF invoice.

Response:

```text
application/pdf
```

---

# 36. INVOICE TEMPLATE

Template:

```text
default
modern
minimal
formal
```

Admin dapat memilih template.

Request:

```json
{
    "template": "modern"
}
```

---

# 37. DESIGN API

Base:

```text
/api/v1/orders/{order}/designs
```

Endpoints:

```text
GET
POST
GET /designs/{id}
PUT
DELETE
```

---

# 38. DESIGN REVISION API

```text
GET  /designs/{design}/revisions
POST /designs/{design}/revisions
GET  /designs/{design}/revisions/{revision}
```

Create revision:

```json
{
    "attachment_id": 20,
    "notes": "Revisi warna logo.",
    "status": "pending_review"
}
```

---

# 39. ATTACHMENT API

Base:

```text
/api/v1/attachments
```

Upload:

```text
POST /attachments
```

Content type:

```text
multipart/form-data
```

Fields:

```text
file
```

Response:

```json
{
    "success": true,
    "data": {
        "id": 10,
        "original_name": "design.png",
        "mime_type": "image/png",
        "size": 102400
    }
}
```

---

# 40. FILE SECURITY

Backend harus memvalidasi:

```text
Extension
MIME
Size
Filename
Storage disk
```

Jangan percaya filename dari client.

---

# 41. PRODUCTION API

Base:

```text
/api/v1/orders/{order}/production
```

Create:

```text
POST /orders/{order}/production
```

Detail:

```text
GET /orders/{order}/production
```

Update status:

```text
PATCH /orders/{order}/production/status
```

---

# 42. PRODUCTION STATUS

Recommended:

```text
waiting
cutting
printing
sewing
finishing
quality_check
completed
```

Tidak semua produk harus melewati semua tahap.

---

# 43. PRODUCTION EVENT

```text
GET /production/{production}/events
POST /production/{production}/events
```

Event:

```json
{
    "status": "sewing",
    "notes": "50 pcs sedang dijahit."
}
```

---

# 44. SHIPPING API

Base:

```text
/api/v1/orders/{order}/shipments
```

Create:

```text
POST /orders/{order}/shipments
```

Update:

```text
PUT /shipments/{shipment}
```

Detail:

```text
GET /shipments/{shipment}
```

---

# 45. SHIPMENT DATA

Request:

```json
{
    "recipient_name": "Andi",
    "recipient_phone": "08123456789",
    "address": "Jl. Example",
    "city": "Surabaya",
    "province": "Jawa Timur",
    "courier": "JNE",
    "service": "REG",
    "tracking_number": "ABC123",
    "shipping_cost": 25000
}
```

---

# 46. SHIPMENT STATUS

```text
pending
packed
shipped
in_transit
delivered
cancelled
```

---

# 47. SHIPMENT TIMELINE

```text
GET /shipments/{shipment}/events
```

---

# 48. REVIEW API

Base:

```text
/api/v1/orders/{order}/review
```

Create:

```text
POST /orders/{order}/review
```

Request:

```json
{
    "rating": 10,
    "review_text": "Hasilnya sangat bagus."
}
```

---

# 49. REVIEW RULE

Review hanya dapat dibuat jika:

```text
order.status = paid
```

Satu order:

```text
maximum 1 review
```

---

# 50. TESTIMONIAL API

Base:

```text
/api/v1/testimonials
```

Admin:

```text
GET
POST
PUT
DELETE
```

Publish:

```text
PATCH /testimonials/{id}/publish
```

Unpublish:

```text
PATCH /testimonials/{id}/unpublish
```

---

# 51. DASHBOARD API

Endpoint utama:

```text
GET /api/v1/dashboard
```

Response:

```json
{
    "success": true,
    "data": {
        "summary": {
            "total_orders": 120,
            "unfinished_orders": 12,
            "dp_orders": 8,
            "paid_orders": 100,
            "total_revenue": 150000000,
            "total_profit": 45000000
        },
        "recent_orders": [],
        "upcoming_deadlines": [],
        "recent_activities": []
    }
}
```

---

# 52. DASHBOARD PERIOD

Query:

```text
GET /dashboard?period=this_month
```

Allowed:

```text
today
this_week
this_month
this_year
custom
```

Custom:

```text
?start_date=2026-08-01
&end_date=2026-08-31
```

---

# 53. REPORT API

Base:

```text
/api/v1/reports
```

---

## GET `/reports/sales`

Parameter:

```text
start_date
end_date
customer_id
product_id
status
```

---

## GET `/reports/profit`

Parameter:

```text
start_date
end_date
product_id
```

---

## GET `/reports/customers`

Menghasilkan:

```text
Total Customer
New Customer
Repeat Customer
Top Customer
```

---

## GET `/reports/products`

Menghasilkan:

```text
Produk terlaris
Quantity
Revenue
Cost
Profit
```

---

# 54. REPORT EXPORT

Endpoint:

```text
GET /reports/{type}/export
```

Format:

```text
pdf
csv
xlsx
```

Contoh:

```text
GET /reports/sales/export?format=xlsx
```

---

# 55. GLOBAL SEARCH API

Endpoint:

```text
GET /api/v1/search
```

Query:

```text
?q=andi
```

Response:

```json
{
    "success": true,
    "data": {
        "customers": [],
        "orders": [],
        "products": [],
        "invoices": []
    }
}
```

---

# 56. ACTIVITY CENTER API

```text
GET /api/v1/activities
```

Filter:

```text
user_id
action
subject_type
date
```

---

# 57. AUDIT API

```text
GET /api/v1/audit-logs
GET /api/v1/audit-logs/{id}
```

Audit log hanya dapat dilihat admin.

Audit log tidak boleh diedit melalui API biasa.

---

# 58. REMINDER API

Base:

```text
/api/v1/reminders
```

Endpoints:

```text
GET
POST
PUT
DELETE
PATCH /reminders/{id}/complete
```

---

# 59. SETTINGS API

Application settings:

```text
GET /api/v1/settings
PUT /api/v1/settings
```

Company:

```text
GET /api/v1/company
PUT /api/v1/company
```

---

# 60. THEME SETTINGS

Contoh:

```json
{
    "primary_color": "#...",
    "secondary_color": "#...",
    "accent_color": "#...",
    "status_colors": {
        "draft": "#...",
        "waiting_dp": "#...",
        "dp_received": "#...",
        "processing": "#...",
        "paid": "#..."
    }
}
```

Frontend menggunakan data tersebut untuk theming.

---

# 61. BACKUP API

```text
GET  /api/v1/backups
POST /api/v1/backups
GET  /api/v1/backups/{id}
GET  /api/v1/backups/{id}/download
DELETE /api/v1/backups/{id}
```

Backup API sangat sensitif dan hanya dapat diakses admin.

---

# 62. FILTER STANDARD

Resource list harus mendukung filter jika relevan.

Contoh:

```text
?search=
?status=
?customer_id=
?product_id=
?start_date=
?end_date=
?sort=
?direction=
?page=
?per_page=
```

---

# 63. SORTING

Allowed sorting field harus di-whitelist.

Contoh:

```php
$allowedSorts = [
    'created_at',
    'name',
    'order_date',
    'deadline',
    'grand_total',
];
```

Jangan langsung menggunakan query parameter sebagai SQL column.

---

# 64. API SECURITY

API harus menerapkan:

```text
Authentication
Authorization
Validation
Rate Limiting
CSRF protection sesuai mekanisme auth
Input sanitization
Mass assignment protection
File validation
SQL injection protection
```

Laravel Eloquent / Query Builder harus digunakan.

Jangan membuat SQL string dari input user secara langsung.

---

# 65. MASS ASSIGNMENT

Model harus menggunakan:

```php
protected $fillable = [];
```

atau:

```php
protected $guarded = [];
```

dengan pertimbangan keamanan.

Recommended:

```php
protected $fillable = [
    'name',
    'phone',
    'email',
];
```

Jangan memasukkan field sensitif secara sembarangan.

---

# 66. RATE LIMITING

Endpoint sensitif:

```text
POST /auth/login
POST /attachments
POST /backups
```

harus memiliki rate limit.

Contoh konsep:

```text
login:
5 requests/minute/IP
```

Angka final dapat disesuaikan setelah deployment.

---

# 67. BUSINESS RULE VALIDATION

API tidak boleh hanya melakukan:

```text
required
string
integer
```

tetapi juga business validation.

Contoh:

```text
DP tidak boleh lebih dari total.
Order paid tidak dapat kembali menjadi draft.
Review hanya untuk order paid.
DP hanya satu kali.
Invoice tidak boleh menggunakan nomor duplicate.
Harga harus berasal dari pricing rule yang valid.
```

---

# 68. SERVICE LAYER

Business logic kompleks tidak boleh ditempatkan seluruhnya di Controller.

Struktur:

```text
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
│
├── Services/
│   ├── OrderService.php
│   ├── PaymentService.php
│   ├── InvoiceService.php
│   ├── PricingService.php
│   ├── ProductionService.php
│   ├── ShipmentService.php
│   └── ReportService.php
│
└── Models/
```

---

# 69. ACTION PATTERN

Untuk operasi kompleks:

```text
app/Actions/
```

Contoh:

```text
CreateOrder.php
RecordPayment.php
GenerateInvoice.php
CompleteProduction.php
CreateShipment.php
CreateReview.php
```

---

# 70. CONTROLLER RESPONSIBILITY

Controller hanya bertugas:

```text
Receive Request
Validate Request
Call Service/Action
Return Response
```

Jangan:

```text
Controller
    ↓
100+ lines business calculation
```

---

# 71. API RESOURCE

Laravel API Resource digunakan untuk menentukan response.

Contoh:

```text
CustomerResource
OrderResource
OrderItemResource
ProductResource
InvoiceResource
PaymentResource
ReviewResource
```

Jangan mengembalikan seluruh Model secara langsung.

---

# 72. LAZY LOADING PROTECTION

Hindari:

```text
N+1 Query
```

Gunakan:

```php
Order::with([
    'customer',
    'items.product',
    'payments'
]);
```

---

# 73. API VERSIONING

Current:

```text
v1
```

Future:

```text
v2
```

Jika breaking change terjadi:

```text
/api/v2
```

Jangan merusak:

```text
/api/v1
```

tanpa migration strategy.

---

# 74. API DOCUMENTATION

Tahap berikutnya dapat menggunakan:

```text
OpenAPI / Swagger
```

atau Laravel-compatible documentation tool.

Namun pada MVP:

```text
API.md
```

menjadi baseline manual.

---

# 75. API TESTING

Gunakan Laravel Feature Test.

Minimal:

```text
AuthenticationTest
CustomerApiTest
ProductApiTest
OrderApiTest
PaymentApiTest
InvoiceApiTest
ProductionApiTest
ShipmentApiTest
ReviewApiTest
DashboardApiTest
ReportApiTest
```

---

# 76. CRITICAL API TEST

## Create Order

```text
POST /orders
```

Harus memastikan:

```text
Order created
Order number generated
Items created
Sizes created
Subtotal correct
Discount correct
Shipping correct
Grand total correct
Remaining correct
Activity created
```

---

# 77. PAYMENT TEST

Test:

```text
Create DP
```

Harus menghasilkan:

```text
payment created
paid_amount updated
remaining_amount updated
status = dp_received
```

Kemudian:

```text
Create final payment
```

harus menghasilkan:

```text
paid_amount = grand_total
remaining_amount = 0
status = paid
```

---

# 78. INVALID PAYMENT TEST

Harus ditolak:

```text
DP kedua
Payment > remaining
Final payment sebelum DP jika business rule mengharuskannya
Payment terhadap order yang sudah paid
```

---

# 79. INVOICE TEST

Invoice harus:

```text
Generate unique invoice number
Capture customer snapshot
Capture company snapshot
Capture order totals
Generate PDF
Store file
```

---

# 80. REVIEW TEST

Review harus ditolak jika:

```text
order.status != paid
```

Review kedua untuk order yang sama:

```text
REJECT
```

---

# 81. API LOGGING

Error API harus dicatat melalui Laravel logging.

Contoh:

```text
storage/logs/laravel.log
```

Jangan mengirim stack trace ke frontend production.

---

# 82. API PERFORMANCE

Target prinsip:

```text
Fast response
Minimal queries
Pagination
Caching
Proper indexes
```

Dashboard dapat menggunakan caching untuk statistik yang mahal jika dibutuhkan.

---

# 83. API CACHE

Data yang relatif stabil:

```text
Company Settings
Application Settings
Product Categories
```

dapat menggunakan cache.

Data transaksi:

```text
Orders
Payments
Invoices
```

tidak boleh menggunakan cache tanpa invalidation strategy.

---

# 84. API DATA OWNERSHIP

Frontend:

```text
Tidak memiliki authority terhadap business truth.
```

Laravel:

```text
Source of business logic.
```

Database:

```text
Source of persistence.
```

---

# 85. REQUEST FLOW

Contoh create order:

```text
React
 ↓
POST /api/v1/orders
 ↓
Authenticate
 ↓
Authorize
 ↓
FormRequest
 ↓
OrderService
 ↓
PricingService
 ↓
DB Transaction
 ↓
Order
 ↓
OrderItems
 ↓
Payments
 ↓
Activity
 ↓
Audit
 ↓
OrderResource
 ↓
React
```

---

# 86. ERROR HANDLING FRONTEND

React harus dapat menangani:

```text
400
401
403
404
409
422
429
500
503
```

Contoh UX:

```text
422 → tampilkan validation error
401 → redirect login
403 → tampilkan unauthorized
404 → tampilkan not found
409 → tampilkan conflict
429 → tampilkan retry message
500 → tampilkan server error
```

---

# 87. HTTP STATUS STANDARD

| Status | Meaning             |
| ------ | ------------------- |
| 200    | Success             |
| 201    | Created             |
| 204    | No Content          |
| 400    | Bad Request         |
| 401    | Unauthorized        |
| 403    | Forbidden           |
| 404    | Not Found           |
| 409    | Conflict            |
| 422    | Validation Error    |
| 429    | Too Many Requests   |
| 500    | Server Error        |
| 503    | Service Unavailable |

---

# 88. CONFLICT RESPONSE

Contoh duplicate DP:

```json
{
    "success": false,
    "message": "DP untuk order ini sudah tercatat.",
    "errors": {
        "payment": [
            "Order hanya dapat memiliki satu pembayaran DP."
        ]
    }
}
```

HTTP:

```text
409 Conflict
```

---

# 89. API IDEMPOTENCY

Operasi sensitif seperti:

```text
Payment
Invoice generation
Backup
```

harus dirancang agar tidak menghasilkan duplicate akibat double-click atau network retry.

Untuk endpoint yang membutuhkan idempotency, dapat digunakan:

```http
Idempotency-Key: <unique-key>
```

---

# 90. FILE DOWNLOAD

Invoice:

```text
GET /api/v1/invoices/{invoice}/download
```

Backend harus memastikan:

```text
User authenticated
Invoice exists
User authorized
File exists
```

Kemudian response PDF.

---

# 91. API AUDIT

Operasi yang wajib dicatat:

```text
Login
Logout
Create
Update
Delete
Restore
Force Delete
Payment
Invoice
Status Change
Backup
Settings Change
```

---

# 92. API ACTIVITY

Activity lebih bersifat user-friendly.

Contoh:

```text
Admin mencatat DP Rp500.000 untuk ORD-20260808-001.
```

Sedangkan audit:

```json
{
    "event": "updated",
    "old_values": {},
    "new_values": {}
}
```

---

# 93. API RESPONSE LANGUAGE

Semua message API untuk admin FRNDLY menggunakan Bahasa Indonesia.

Contoh:

```text
Data berhasil disimpan.
Pesanan berhasil dibuat.
Pembayaran berhasil dicatat.
Invoice berhasil dibuat.
Data tidak ditemukan.
Anda tidak memiliki akses.
```

Namun:

```text
Field
Endpoint
Status
Enum
```

tetap menggunakan English naming convention.

---

# 94. API NAMING LANGUAGE

Gunakan English:

```text
customer
order
payment
invoice
shipment
review
```

Jangan:

```text
pelanggan
pesanan
pembayaran
tagihan
```

di dalam nama endpoint/backend field.

Bahasa Indonesia hanya untuk:

```text
UI
Error message
Activity description
Documentation explanation
```

---

# 95. MVP API PRIORITY

## Phase 1

```text
Auth
Customers
Categories
Products
Variants
Prices
```

## Phase 2

```text
Orders
Order Items
Payments
Invoices
```

## Phase 3

```text
Attachments
Designs
Production
```

## Phase 4

```text
Shipping
Reviews
Testimonials
```

## Phase 5

```text
Dashboard
Reports
Search
Activities
Audit
Reminders
Settings
Backup
```

---

# 96. API DEFINITION OF DONE

API dianggap siap apabila:

```text
[ ] Authentication berjalan
[ ] Authorization berjalan
[ ] Validation berjalan
[ ] CRUD utama berjalan
[ ] Pagination berjalan
[ ] Search berjalan
[ ] Filter berjalan
[ ] Sorting berjalan
[ ] Error response konsisten
[ ] Order calculation benar
[ ] Payment lifecycle benar
[ ] Invoice generation berjalan
[ ] File upload aman
[ ] Audit trail berjalan
[ ] Activity center berjalan
[ ] Feature test tersedia
[ ] API tidak menghasilkan N+1
```

---

# 97. FINAL API ARCHITECTURE

```text
                    React.js
                       │
                       │ HTTPS / JSON
                       ▼
                ┌───────────────┐
                │  Laravel API  │
                │     /v1       │
                └───────┬───────┘
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
        Controllers   Requests   Resources
             │
             ▼
       Services / Actions
             │
       ┌─────┴─────┐
       ▼           ▼
    Eloquent     Domain Logic
       │
       ▼
   MySQL/MariaDB
```

---

# 98. FINAL API PRINCIPLE

API FRNDLY harus selalu mengikuti prinsip:

> **Frontend meminta, Backend memutuskan, Database menyimpan.**

React tidak boleh menentukan:

```text
Final price
Final discount
Final payment status
Invoice number
Order number
Profit
Authorization
```

Laravel yang menentukan.

Database memastikan:

```text
Consistency
Integrity
Persistence
History
```

Dengan arsitektur ini, FRNDLY dapat dikembangkan secara bertahap tanpa membuat frontend, backend, dan database memiliki aturan yang berbeda.

---

# END OF API SPECIFICATION

**FRNDLY — Business Management System**

API Specification v1.0.0
