# FRNDLY — CODING RULES

**Project:** FRNDLY
**Document:** Coding Rules
**Version:** 1.0.0
**Status:** Active
**Primary Backend:** Laravel
**Primary Frontend:** React.js
**Database:** MySQL / MariaDB
**Development Environment:** Laragon
**Architecture:** Modular Monolith
**Language:** Indonesian for documentation and AI interaction

---

# 1. PURPOSE

Dokumen ini berisi standar teknis penulisan kode FRNDLY.

Tujuannya:

* menjaga kode konsisten,
* mengurangi bug,
* mempermudah maintenance,
* mempermudah AI memahami codebase,
* mencegah duplicate logic,
* menjaga keamanan,
* menjaga scalability,
* menjaga kualitas frontend dan backend.

---

# 2. CORE PRINCIPLES

Semua kode FRNDLY mengikuti prinsip:

```text
Readable
Predictable
Maintainable
Secure
Testable
Consistent
Simple
```

Prioritas:

```text
Correctness
    ↓
Security
    ↓
Maintainability
    ↓
Performance
    ↓
Elegance
```

Jangan mengorbankan correctness demi kode yang terlihat lebih canggih.

---

# 3. LANGUAGE RULE

Source code menggunakan bahasa Inggris.

Contoh:

```text
Customer
Order
Invoice
Payment
Product
Shipment
Review
```

Komentar kode boleh menggunakan bahasa Inggris.

Dokumentasi proyek menggunakan Bahasa Indonesia.

AI menjelaskan proses development menggunakan Bahasa Indonesia.

---

# 4. NAMING CONVENTION

## 4.1 PHP Classes

Gunakan PascalCase.

```php
CustomerService
OrderService
InvoiceService
PaymentService
ProductService
```

---

## 4.2 PHP Methods

Gunakan camelCase.

```php
createCustomer()
updateCustomer()
calculateOrderTotal()
generateInvoice()
recordPayment()
```

---

## 4.3 PHP Variables

Gunakan camelCase.

```php
$customerId
$orderTotal
$paymentStatus
$remainingAmount
```

---

## 4.4 Database Tables

Gunakan plural snake_case.

```text
customers
orders
order_items
payments
invoices
invoice_items
products
product_variants
```

---

## 4.5 Database Columns

Gunakan snake_case.

```text
customer_id
order_date
payment_status
shipping_cost
created_at
updated_at
```

---

## 4.6 Foreign Keys

Gunakan:

```text
{singular_table_name}_id
```

Contoh:

```text
customer_id
product_id
order_id
invoice_id
```

---

## 4.7 React Components

Gunakan PascalCase.

```text
CustomerTable.jsx
CustomerForm.jsx
OrderDetail.jsx
InvoicePreview.jsx
PaymentForm.jsx
```

---

## 4.8 React Hooks

Gunakan:

```text
use + PascalCase
```

Contoh:

```text
useCustomers()
useOrders()
useInvoice()
useDebounce()
```

---

## 4.9 React Services

Gunakan camelCase.

```text
customerService
orderService
invoiceService
paymentService
```

---

## 4.10 Utility Functions

Gunakan camelCase.

```text
formatCurrency()
formatDate()
calculateSubtotal()
getStatusLabel()
```

---

# 5. FILE NAMING

Backend:

```text
PascalCase.php
```

Frontend components:

```text
PascalCase.jsx
```

Hooks:

```text
useSomething.js
```

Services:

```text
somethingService.js
```

Utilities:

```text
something.js
```

Styles:

```text
something.css
```

Tests mengikuti nama subject.

Contoh:

```text
OrderServiceTest.php
InvoiceTest.php
CustomerTest.php
```

---

# 6. DIRECTORY ORGANIZATION

## Backend

Gunakan struktur Laravel standar.

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
├── Enums/
│
├── Policies/
│
├── Jobs/
│
├── Actions/
│
└── Support/
```

Jangan memindahkan struktur Laravel tanpa alasan kuat.

---

# 7. FRONTEND STRUCTURE

Gunakan struktur:

```text
resources/
└── js/
    ├── components/
    ├── layouts/
    ├── pages/
    ├── hooks/
    ├── services/
    ├── stores/
    ├── utils/
    ├── types/
    └── routes/
```

Jika frontend dipisahkan menjadi project React tersendiri, struktur dapat disesuaikan tetapi konsepnya tetap sama.

---

# 8. COMPONENT ORGANIZATION

Component besar harus dipecah.

Contoh:

```text
OrderPage
├── OrderHeader
├── OrderStatus
├── CustomerSummary
├── OrderItems
├── PaymentSummary
├── ProductionTimeline
├── ShipmentSummary
└── OrderActivity
```

Hindari component dengan ratusan atau ribuan baris.

---

# 9. COMPONENT RESPONSIBILITY

Setiap component sebaiknya memiliki satu tujuan.

Contoh baik:

```text
CustomerTable
```

bertanggung jawab menampilkan customer.

Sedangkan:

```text
CustomerForm
```

bertanggung jawab terhadap form customer.

Jangan membuat:

```text
CustomerEverything.jsx
```

---

# 10. REUSABLE COMPONENT RULE

Jika UI digunakan minimal dua kali dan memiliki behavior yang sama, pertimbangkan reusable component.

Contoh:

```text
StatusBadge
CurrencyDisplay
DataTable
ConfirmDialog
EmptyState
LoadingState
```

Namun jangan membuat abstraction hanya untuk satu penggunaan sederhana.

---

# 11. REACT STATE RULE

Gunakan state lokal jika hanya digunakan satu component.

Contoh:

```jsx
const [isOpen, setIsOpen] = useState(false);
```

Gunakan global state jika data digunakan oleh banyak bagian aplikasi.

Jangan menjadikan semua state sebagai global state.

---

# 12. SERVER STATE RULE

Data dari backend harus diperlakukan sebagai server state.

Jangan membuat banyak salinan data yang sama di berbagai state.

Contoh buruk:

```text
customers
customerList
allCustomers
customersData
customerCache
```

yang semuanya berisi data sama.

---

# 13. API CALL RULE

Jangan melakukan API call langsung di banyak component menggunakan kode yang berulang.

Hindari:

```jsx
axios.get(...)
axios.get(...)
axios.get(...)
```

secara berulang.

Gunakan service:

```js
customerService.getAll()
orderService.getById()
invoiceService.download()
```

---

# 14. API SERVICE STRUCTURE

Contoh:

```text
services/
├── api.js
├── customerService.js
├── productService.js
├── orderService.js
├── paymentService.js
├── invoiceService.js
├── productionService.js
└── shipmentService.js
```

---

# 15. API CLIENT

Gunakan satu HTTP client utama.

Contoh:

```js
api.get(...)
api.post(...)
api.put(...)
api.delete(...)
```

Konfigurasi:

* base URL,
* authentication,
* headers,
* error handling,

dikelola secara terpusat.

---

# 16. API ERROR HANDLING

Jangan menangani error API dengan cara berbeda di setiap component.

Gunakan centralized handling jika memungkinkan.

Contoh:

```text
API
↓
HTTP Client
↓
Error Handler
↓
Component
```

---

# 17. LOADING STATE

Setiap request asynchronous yang terlihat oleh user harus memiliki loading state.

Contoh:

```jsx
if (isLoading) {
    return <LoadingState />;
}
```

Untuk button:

```text
Saving...
Generating...
Uploading...
Deleting...
```

---

# 18. DOUBLE SUBMISSION

Saat submit:

```text
isSubmitting = true
```

Button harus disabled sampai request selesai.

Tujuannya mencegah:

```text
double order
double payment
double invoice
```

---

# 19. FORM RULE

Form harus memiliki:

* label,
* validation,
* error message,
* loading state,
* success feedback,
* reset behavior jika diperlukan.

---

# 20. FORM VALIDATION

Frontend validation digunakan untuk UX.

Backend validation digunakan untuk keamanan dan integritas.

Keduanya tidak boleh dianggap sebagai pengganti satu sama lain.

---

# 21. FORM ERROR

Error harus muncul dekat field jika memungkinkan.

Contoh:

```text
Harga tidak boleh kurang dari 0.
```

lebih baik daripada:

```text
Something went wrong.
```

---

# 22. BACKEND VALIDATION

Gunakan Laravel Form Request.

Contoh:

```text
StoreCustomerRequest
UpdateCustomerRequest
StoreOrderRequest
UpdateOrderRequest
RecordPaymentRequest
StoreProductRequest
```

---

# 23. CONTROLLER RULE

Controller harus tipis.

Contoh:

```php
public function store(StoreCustomerRequest $request)
{
    $customer = $this->customerService
        ->create($request->validated());

    return new CustomerResource($customer);
}
```

Jangan melakukan seluruh business logic di Controller.

---

# 24. SERVICE RULE

Service menangani business logic.

Contoh:

```php
$order = $this->orderService->createOrder(
    $customer,
    $items,
    $data
);
```

---

# 25. SERVICE RESPONSIBILITY

Service harus memiliki satu domain utama.

Baik:

```text
OrderService
PaymentService
InvoiceService
```

Kurang baik:

```text
BusinessService
EverythingService
MainService
```

---

# 26. ACTION RULE

Gunakan Action jika satu operasi bisnis cukup kompleks dan reusable.

Contoh:

```text
CreateOrder
RecordPayment
GenerateInvoice
ApproveDesign
CompleteOrder
```

Tidak semua operasi membutuhkan Action class.

---

# 27. MODEL RULE

Model digunakan untuk:

* relationships,
* casts,
* scopes,
* model-specific behavior.

Jangan menjadikan Model tempat seluruh business process.

---

# 28. RELATIONSHIP RULE

Relationship harus didefinisikan dengan jelas.

Contoh:

```php
public function customer()
{
    return $this->belongsTo(Customer::class);
}
```

---

# 29. QUERY RULE

Hindari query di Blade/React.

Query database berada di backend.

Frontend hanya meminta data melalui API.

---

# 30. EAGER LOADING

Gunakan eager loading ketika relationship diperlukan.

Contoh:

```php
Order::with([
    'customer',
    'items.product',
])
```

Tetapi jangan eager-load semua relationship secara default.

---

# 31. N+1 PREVENTION

Selalu waspadai N+1 query.

Contoh buruk:

```php
foreach ($orders as $order) {
    $order->customer->name;
}
```

tanpa eager loading ketika dataset besar.

---

# 32. PAGINATION

Gunakan pagination untuk dataset besar.

Contoh:

```php
Order::query()
    ->latest()
    ->paginate(20);
```

Jangan menggunakan:

```php
Order::all();
```

untuk halaman daftar order yang berpotensi besar.

---

# 33. FILTER RULE

Filter harus dilakukan di database jika dataset besar.

Contoh:

```text
status
date
customer
product
payment
deadline
```

---

# 34. SEARCH RULE

Search harus:

* case-insensitive jika sesuai,
* efficient,
* indexed jika diperlukan,
* tidak menyebabkan full table scan tanpa alasan.

---

# 35. SORTING RULE

Sorting harus menggunakan whitelist field.

Jangan menerima:

```text
?sort={arbitrary SQL}
```

langsung ke query.

---

# 36. MASS ASSIGNMENT

Gunakan `$fillable` atau mekanisme Laravel yang sesuai.

Jangan memasukkan request langsung ke model tanpa kontrol.

---

# 37. DATABASE TRANSACTION

Gunakan `DB::transaction()` untuk operasi yang memengaruhi beberapa tabel dan harus atomik.

Contoh:

```php
DB::transaction(function () {
    // create order
    // create items
    // create payment
    // update status
});
```

---

# 38. MONEY TYPE

Jangan gunakan JavaScript floating point untuk nilai uang sebagai sumber kebenaran.

Backend harus menghitung nilai final.

Gunakan tipe database yang konsisten.

---

# 39. CURRENCY FORMAT

Format display rupiah dipusatkan.

Contoh:

```js
formatCurrency(75000)
```

Output:

```text
Rp75.000
```

Jangan menulis format manual di setiap component.

---

# 40. DATE FORMAT

Gunakan centralized formatter.

Contoh:

```js
formatDate(order.createdAt)
formatDateTime(payment.createdAt)
```

Jangan menggunakan format tanggal yang berbeda-beda tanpa alasan.

---

# 41. TIMEZONE

Timezone aplikasi harus ditentukan secara global.

Jangan mengandalkan timezone browser untuk business calculation.

---

# 42. ENUM RULE

Gunakan enum untuk status yang stabil.

Contoh:

```php
OrderStatus::DRAFT
OrderStatus::WAITING_DP
OrderStatus::DP_RECEIVED
OrderStatus::PROCESS
OrderStatus::PAID
```

---

# 43. STATUS LABEL

Jangan menampilkan raw enum kepada user.

Contoh:

```text
waiting_dp
```

ditampilkan sebagai:

```text
Menunggu DP
```

Gunakan centralized status configuration.

---

# 44. STATUS COLOR

Status color harus terpusat.

Contoh:

```js
getOrderStatusConfig(status)
```

menghasilkan:

```text
label
color
icon
```

Jangan menyebarkan:

```text
if status === ...
```

ke seluruh UI.

---

# 45. ORDER CALCULATION

Perhitungan order harus terpusat.

Contoh:

```text
calculateItemSubtotal()
calculateOrderSubtotal()
calculateDiscount()
calculateShipping()
calculateGrandTotal()
calculatePaidAmount()
calculateRemainingAmount()
calculateProfit()
```

---

# 46. FRONTEND CALCULATION

Frontend boleh melakukan calculation untuk preview.

Namun:

```text
Frontend Calculation ≠ Final Calculation
```

Backend selalu melakukan perhitungan final.

---

# 47. DISCOUNT RULE

Discount tidak boleh hardcoded di component.

Buruk:

```js
if (quantity >= 100) {
    discount = 0.1;
}
```

jika aturan tersebut belum menjadi business rule yang resmi.

Gunakan konfigurasi/backend.

---

# 48. PRICE SNAPSHOT

Ketika order dibuat:

harga transaksi harus disimpan pada order item.

Contoh:

```text
product_id
product_name
unit_price
quantity
subtotal
```

Perubahan harga master product tidak boleh mengubah order lama.

---

# 49. PRODUCT SNAPSHOT

Informasi penting product yang diperlukan untuk invoice harus dapat dipertahankan sebagai snapshot.

Jangan bergantung sepenuhnya pada product master saat membuat invoice lama.

---

# 50. ORDER ITEM RULE

Order harus mendukung banyak item.

Contoh:

```text
Order
├── Kaos
├── Lanyard
├── ID Card
└── Jaket
```

---

# 51. VARIANT RULE

Variant dapat memiliki:

```text
size
color
material
custom attributes
```

Jangan membuat field variant terlalu rigid jika produk memiliki karakteristik berbeda.

---

# 52. QUANTITY PER VARIANT

Untuk produk seperti kaos:

```text
S   = 20
M   = 30
L   = 50
XL  = 20
```

Total quantity harus konsisten dengan item quantity.

---

# 53. CUSTOMER DATA

Customer fields mengikuti SRS.

Contoh:

```text
name
phone
email
address
city
province
notes
```

Jangan menambahkan data sensitif yang tidak dibutuhkan.

---

# 54. CUSTOMER DUPLICATE

Gunakan normalized comparison untuk membantu mendeteksi duplicate.

Contoh:

```text
Phone
Email
```

Namun jangan otomatis merge customer tanpa konfirmasi.

---

# 55. PAYMENT RULE

Payment record minimal menyimpan:

```text
order_id
amount
payment_type
payment_date
reference
notes
```

Sesuai SRS.

---

# 56. DP RULE

DP hanya satu kali.

Backend harus memastikan rule tersebut.

Frontend tidak boleh menjadi satu-satunya penjaga rule.

---

# 57. PAYMENT VALIDATION

Payment tidak boleh:

```text
< 0
```

atau melebihi outstanding balance jika business rule tidak mengizinkannya.

---

# 58. INVOICE NUMBER GENERATION

Invoice number dibuat oleh backend.

Format:

```text
INV-YYYYMMDD-000
```

Contoh:

```text
INV-20260804-001
```

Gunakan database constraint untuk uniqueness.

---

# 59. ORDER ID

Order ID:

```text
ORD-YYYYMMDD-000
```

harus berbeda dari internal database ID.

---

# 60. INVOICE GENERATION

Flow:

```text
Order
↓
Validate
↓
Calculate
↓
Create Invoice Record
↓
Generate PDF
↓
Store PDF
↓
Return Download
```

---

# 61. PDF GENERATION

PDF generation tidak boleh bergantung pada data frontend.

Backend harus menghasilkan PDF dari database.

---

# 62. INVOICE CONTENT

Invoice minimal memiliki:

```text
Company Information
Invoice Number
Order ID
Date
Customer Information
Order Items
Quantity
Unit Price
Subtotal
Discount
Shipping
Grand Total
DP
Remaining Balance
Payment Status
Notes
```

---

# 63. INVOICE BRANDING

Branding invoice berasal dari company settings.

Jangan hardcode nama perusahaan.

---

# 64. FILE STORAGE

Gunakan Laravel Storage abstraction.

Jangan hardcode filesystem path di banyak tempat.

---

# 65. FILE NAMING

Gunakan generated filename.

Contoh:

```text
invoice_INV-20260804-001.pdf
```

atau UUID-based naming.

Jangan mempercayai filename user.

---

# 66. FILE VALIDATION

Setiap upload harus memiliki:

```text
MIME validation
Size validation
Extension validation
Storage policy
```

---

# 67. FILE ACCESS

File private tidak boleh dapat diakses hanya dengan mengetahui URL.

Gunakan authorized download endpoint jika file bersifat private.

---

# 68. DESIGN REVISION

Design file harus mendukung revision.

Contoh:

```text
Design v1
Design v2
Design v3
```

Status:

```text
Draft
Review
Approved
Rejected
```

sesuai kebutuhan implementasi.

---

# 69. AUDIT LOG

Perubahan penting harus dapat dilacak.

Contoh:

```text
User
Action
Entity
Entity ID
Timestamp
Before
After
```

---

# 70. LOGGING

Gunakan Laravel logging.

Jangan:

```php
dd($request);
```

meninggalkan debugging code di production.

---

# 71. DEBUGGING RULE

Development boleh menggunakan:

```php
dd()
dump()
ray()
```

jika tersedia.

Namun harus dibersihkan sebelum commit production-ready code.

---

# 72. EXCEPTION HANDLING

Jangan menampilkan exception mentah kepada user.

Gunakan user-friendly message.

Developer tetap mendapatkan detail melalui log.

---

# 73. HTTP STATUS CODE

Gunakan status code yang sesuai.

Contoh:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Validation Error
500 Server Error
```

---

# 74. API RESOURCE

Gunakan Laravel API Resource untuk response API.

Contoh:

```text
CustomerResource
OrderResource
InvoiceResource
PaymentResource
ProductResource
```

---

# 75. API RESPONSE CONSISTENCY

Response harus konsisten.

Contoh:

```json
{
    "success": true,
    "message": "Data berhasil disimpan",
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

---

# 76. ROUTE RULE

Route harus RESTful.

Contoh:

```text
GET    /customers
POST   /customers
GET    /customers/{customer}
PUT    /customers/{customer}
DELETE /customers/{customer}
```

Hindari endpoint seperti:

```text
POST /doCustomerUpdate
POST /deleteCustomerNow
```

---

# 77. ROUTE NAMING

Gunakan resource naming.

```php
Route::apiResource('customers', CustomerController::class);
```

jika cocok dengan kebutuhan API.

---

# 78. AUTHENTICATION

Endpoint admin harus dilindungi authentication.

Jangan mengandalkan frontend route protection saja.

---

# 79. AUTHORIZATION

Gunakan Laravel Policy/Gate ketika authorization diperlukan.

Contoh:

```text
CustomerPolicy
OrderPolicy
InvoicePolicy
```

---

# 80. CSRF

Gunakan mekanisme CSRF Laravel sesuai architecture.

Jangan disable CSRF secara sembarangan.

---

# 81. XSS

Semua input user dianggap untrusted.

Review/testimonial harus diperlakukan sebagai untrusted content.

---

# 82. SQL INJECTION

Gunakan:

* Eloquent,
* Query Builder,
* parameter binding.

Jangan concatenate user input ke raw SQL.

---

# 83. SECRET MANAGEMENT

Jangan menyimpan:

```text
password
API key
token
secret
```

di source code.

Gunakan `.env`.

---

# 84. ENV FILE

`.env` tidak boleh masuk Git.

Gunakan:

```text
.env.example
```

sebagai template.

---

# 85. DEPENDENCY RULE

Sebelum menambah dependency:

1. Pastikan benar-benar diperlukan.
2. Cek kompatibilitas.
3. Cek maintenance.
4. Cek security.
5. Cek bundle impact.

---

# 86. PACKAGE RULE

Jangan menambahkan package hanya karena:

> "lebih mudah."

Jika native Laravel/React sudah cukup, gunakan native solution.

---

# 87. CSS RULE

Gunakan design system.

Centralize:

```text
colors
spacing
typography
radius
shadows
breakpoints
```

---

# 88. THEME RULE

Theme FRNDLY harus dapat dikustomisasi dari Settings.

Jangan hardcode warna utama pada banyak component.

---

# 89. CSS CLASS RULE

Gunakan naming yang konsisten.

Jika menggunakan Tailwind:

gunakan utility class secara konsisten.

Jika menggunakan CSS Modules:

gunakan component-scoped styles.

Jangan mencampur banyak pendekatan tanpa alasan.

---

# 90. RESPONSIVE BREAKPOINT

Gunakan breakpoint yang konsisten.

Jangan membuat breakpoint random di setiap component.

---

# 91. ACCESSIBILITY

Semua interactive element harus dapat digunakan melalui keyboard.

Button harus benar-benar:

```html
<button>
```

bukan:

```html
<div onClick="">
```

untuk action yang seharusnya button.

---

# 92. IMAGE RULE

Image harus memiliki:

```text
alt
width
height
```

jika relevan.

Gunakan lazy loading untuk image yang sesuai.

---

# 93. TABLE UX

Table harus menangani:

```text
Loading
Empty
Error
Data
Pagination
```

---

# 94. SEARCH UX

Search menggunakan debounce jika request dikirim ke backend.

Contoh:

```text
User types
↓
Debounce
↓
API request
```

bukan request pada setiap karakter.

---

# 95. GLOBAL SEARCH

Global search harus memiliki hasil yang jelas berdasarkan entity.

Contoh:

```text
Customers
Orders
Invoices
Products
```

---

# 96. MODAL RULE

Modal hanya digunakan jika memang membutuhkan focus.

Jangan menggunakan modal untuk setiap form sederhana.

---

# 97. TOAST RULE

Toast digunakan untuk feedback singkat.

Contoh:

```text
Customer berhasil dibuat.
Invoice berhasil dibuat.
Data berhasil dihapus.
```

Jangan memasukkan informasi penting yang hilang setelah toast menghilang.

---

# 98. EMPTY STATE

Setiap list harus memiliki empty state.

Contoh:

```text
Belum ada customer.

[Tambah Customer]
```

---

# 99. ERROR STATE

Setiap halaman data harus dapat menampilkan error state.

Contoh:

```text
Data gagal dimuat.

[Coba Lagi]
```

---

# 100. CONFIRMATION RULE

Confirmation wajib untuk:

```text
Permanent Delete
Delete
Cancel
Reset
```

Tidak diperlukan untuk:

```text
Search
Filter
Save
Open
View
```

---

# 101. DELETE FLOW

Standard:

```text
User clicks Delete
↓
Confirmation
↓
API
↓
Loading
↓
Success/Error
↓
Refresh state
```

---

# 102. ARCHIVE FLOW

Standard:

```text
Active
↓
Archive
↓
Archived
↓
Restore / Permanent Delete
```

---

# 103. AUTOSAVE

Autosave harus:

* menggunakan debounce,
* tidak mengganggu user,
* memiliki save state,
* menangani network error.

Contoh UI:

```text
Saving...
Saved
Failed to save
```

---

# 104. DASHBOARD

Dashboard tidak boleh mengambil seluruh database lalu menghitung semuanya di browser.

Gunakan backend aggregation/query.

---

# 105. DASHBOARD METRICS

Metric harus memiliki source yang jelas.

Contoh:

```text
Total Orders
Unfinished Orders
Waiting DP
Paid Orders
Revenue
Profit
Outstanding Payment
Upcoming Deadline
```

---

# 106. REPORTING

Report menggunakan backend query.

Export besar jangan memaksa browser memproses seluruh database.

---

# 107. EXPORT

Export harus mempertahankan:

```text
active filters
date range
search criteria
sorting
```

jika relevan.

---

# 108. EXCEL / CSV / PDF

Format export harus mengikuti kebutuhan:

```text
CSV
Excel
PDF
```

Jangan membuat format berbeda secara random.

---

# 109. TESTING STRUCTURE

Backend:

```text
tests/
├── Feature/
└── Unit/
```

Frontend:

```text
tests/
```

atau struktur test yang sesuai tooling yang digunakan.

---

# 110. TEST NAMING

Nama test harus menjelaskan behavior.

Baik:

```text
it_creates_order_with_multiple_products()
```

Kurang baik:

```text
testOrder()
```

---

# 111. BUSINESS TEST

Test business rule, bukan hanya implementation.

Contoh:

```text
it_does_not_allow_second_dp()
```

---

# 112. TEST DATABASE

Gunakan isolated database untuk testing.

Jangan menjalankan test pada production database.

---

# 113. FACTORY RULE

Gunakan Laravel Factory untuk test data.

Contoh:

```text
CustomerFactory
ProductFactory
OrderFactory
PaymentFactory
```

---

# 114. SEEDER RULE

Seeder digunakan untuk:

* development data,
* demo data,
* initial system configuration,

bukan data production nyata.

---

# 115. MIGRATION RULE

Setiap perubahan schema:

```text
Migration
↓
Run
↓
Test
```

Jangan mengubah schema production secara manual jika dapat dilakukan melalui migration.

---

# 116. INDEX RULE

Index:

* foreign key,
* frequently searched fields,
* frequently filtered fields,
* unique business identifiers.

Jangan membuat index tanpa alasan.

---

# 117. UNIQUE RULE

Business identifier seperti:

```text
invoice_number
order_number
```

harus memiliki unique constraint.

---

# 118. NULL RULE

Gunakan nullable hanya jika field secara bisnis memang boleh kosong.

Jangan menggunakan nullable untuk menghindari keputusan schema.

---

# 119. DEFAULT RULE

Default value hanya digunakan jika memiliki makna bisnis yang jelas.

Contoh:

```text
is_active = true
```

---

# 120. TIMESTAMP RULE

Gunakan:

```text
created_at
updated_at
```

untuk entity yang membutuhkan tracking.

Jika soft delete:

```text
deleted_at
```

---

# 121. SOFT DELETE

Gunakan SoftDeletes untuk entity yang membutuhkan archive.

Jangan menggunakan soft delete pada semua tabel secara otomatis.

---

# 122. PERMANENT DELETE

Permanent delete harus:

* explicit,
* authorized,
* confirmed,
* safe terhadap relationship.

---

# 123. CODE COMMENTS

Komentar digunakan untuk menjelaskan:

> WHY

bukan:

> WHAT

Buruk:

```php
// Add one to quantity
$quantity++;
```

Baik:

```php
// Quantity is increased because the customer added another variant.
$quantity++;
```

---

# 124. TODO RULE

TODO harus memiliki konteks.

Contoh:

```php
// TODO: Replace temporary calculation after pricing rule module is implemented.
```

Jangan:

```php
// TODO: fix
```

---

# 125. DEAD CODE

Jangan menyimpan:

* unused import,
* unused variable,
* commented-out old implementation,
* dead component.

Jika sudah tidak digunakan:

hapus.

Git menyimpan history.

---

# 126. DUPLICATE CODE

Jika logic sama muncul beberapa kali:

pertimbangkan abstraction.

Contoh:

```text
formatCurrency()
formatDate()
calculateRemainingBalance()
```

---

# 127. ABSTRACTION RULE

Jangan membuat abstraction terlalu dini.

Gunakan abstraction ketika:

* duplication nyata,
* behavior stabil,
* reusable,
* abstraction memang meningkatkan clarity.

---

# 128. FUNCTION SIZE

Function harus relatif kecil dan fokus.

Jika function menjadi sulit dipahami:

pecah menjadi beberapa function.

---

# 129. NESTED LOGIC

Hindari nested conditional terlalu dalam.

Buruk:

```text
if
 └─ if
    └─ if
       └─ if
```

Gunakan:

* early return,
* extracted function,
* service/action.

---

# 130. BOOLEAN NAMING

Boolean harus jelas.

Gunakan:

```text
isActive
isPaid
hasReview
canEdit
```

bukan:

```text
active
paid
review
edit
```

jika konteks ambigu.

---

# 131. MAGIC NUMBER

Hindari magic number.

Buruk:

```js
if (quantity >= 100)
```

jika 100 adalah business rule.

Gunakan configuration.

---

# 132. MAGIC STRING

Hindari raw status string.

Buruk:

```js
status === "paid"
```

di banyak tempat.

Gunakan enum/configuration.

---

# 133. DATE BUSINESS LOGIC

Jangan menghitung deadline dengan string manual.

Gunakan date library/backend date handling yang konsisten.

---

# 134. TIME-SENSITIVE DATA

Deadline, payment date, invoice date harus berasal dari authoritative backend time.

Jangan menjadikan client clock sebagai source of truth.

---

# 135. FILE DOWNLOAD

File download harus melalui authorized route jika private.

Contoh konsep:

```text
GET /invoices/{invoice}/download
```

Backend memeriksa authorization sebelum file diberikan.

---

# 136. PDF DOWNLOAD UX

Button:

```text
Download Invoice
```

harus memberikan feedback jika generation membutuhkan waktu.

---

# 137. ACTIVITY CENTER

Activity harus berasal dari backend event/activity records.

Jangan hanya membuat activity UI statis.

---

# 138. AUDIT VS ACTIVITY

Bedakan:

```text
Audit Trail
```

dan:

```text
Activity Center
```

Audit:

> technical/business trace.

Activity:

> user-friendly timeline.

---

# 139. ORDER TIMELINE

Timeline harus menunjukkan event penting:

```text
Order Created
DP Received
Production Started
Design Approved
Production Completed
Shipped
Paid
```

Event yang tersedia mengikuti implementasi SRS.

---

# 140. EVENT RULE

Jika menggunakan Laravel Events:

Gunakan untuk decoupling side effects.

Jangan menggunakan event hanya agar code terlihat "advanced".

---

# 141. JOB RULE

Gunakan queued jobs untuk proses berat.

Contoh:

```text
GenerateLargeReport
GenerateBulkInvoices
CreateBackup
ProcessAttachment
```

---

# 142. QUEUE FAILURE

Job penting harus memiliki failure handling.

Jangan membuat queue job yang gagal tanpa visibility.

---

# 143. CACHE RULE

Cache hanya jika ada alasan performance.

Selalu pikirkan:

```text
Cache invalidation
TTL
Stale data
```

---

# 144. DATABASE QUERY PERFORMANCE

Jika query lambat:

1. inspect query,
2. inspect indexes,
3. inspect relationship,
4. inspect pagination,
5. inspect selected columns,
6. baru pertimbangkan caching.

---

# 145. SELECT RULE

Jangan mengambil kolom yang tidak diperlukan untuk query berat.

Gunakan:

```php
select(...)
```

jika memang memberikan manfaat.

---

# 146. API PAYLOAD

Response harus cukup untuk kebutuhan UI tetapi tidak berlebihan.

Hindari payload besar tanpa alasan.

---

# 147. SECURITY LOGIC

Frontend permission check hanya untuk UX.

Backend permission check adalah security boundary.

---

# 148. ADMIN-ONLY RULE

MVP FRNDLY hanya memiliki admin.

Namun code tetap harus dirancang agar authorization dapat diperluas jika nanti:

```text
multi-admin
roles
permissions
```

ditambahkan.

Jangan hardcode architecture yang membuat ekspansi mustahil.

---

# 149. CONFIGURATION RULE

Business configuration yang dapat berubah harus berada pada:

```text
config
database settings
admin settings
```

sesuai jenis data.

Jangan hardcode di frontend.

---

# 150. SETTINGS RULE

Settings yang dapat dikustomisasi admin harus memiliki source of truth backend.

Frontend hanya membaca dan menerapkan setting tersebut.

---

# 151. COMPANY PROFILE

Company profile:

```text
company_name
logo
address
phone
email
city
province
```

tidak boleh hardcoded.

---

# 152. BRANDING

Invoice, dashboard, dan UI harus menggunakan branding configuration.

---

# 153. DESIGN SYSTEM

Gunakan centralized design tokens.

Contoh:

```text
primary
secondary
success
warning
danger
background
surface
text
muted
border
```

---

# 154. DARK MODE

Jika dark mode ditambahkan:

semua component harus mengikuti design tokens.

Jangan memiliki warna hardcoded yang rusak ketika theme berubah.

---

# 155. ICON RULE

Gunakan satu icon library utama.

Jangan mencampurkan banyak icon library tanpa alasan.

---

# 156. TYPOGRAPHY

Typography harus konsisten:

```text
Heading
Subheading
Body
Caption
Label
```

---

# 157. UI CONSISTENCY

Komponen dengan fungsi sama harus memiliki:

* ukuran,
* spacing,
* interaction,
* state,

yang konsisten.

---

# 158. RESPONSIVE TABLE

Table besar pada mobile tidak boleh dipaksakan menjadi sangat kecil.

Gunakan pendekatan:

```text
horizontal scroll
responsive card
priority columns
```

sesuai kebutuhan.

---

# 159. MOBILE ACTIONS

Action penting harus mudah dijangkau.

Contoh:

```text
Create Order
Record Payment
Download Invoice
```

---

# 160. ACCESSIBILITY LABEL

Icon-only button harus memiliki accessible label.

Contoh:

```text
aria-label="Download invoice"
```

---

# 161. PERFORMANCE FRONTEND

Hindari:

* unnecessary re-render,
* huge component tree,
* huge bundle,
* duplicate API requests.

---

# 162. MEMOIZATION

Gunakan:

```text
useMemo
useCallback
memo
```

hanya jika memang memberikan manfaat.

Jangan melakukan memoization secara otomatis pada semua component.

---

# 163. LAZY LOADING

Gunakan lazy loading untuk page/component besar jika sesuai.

Contoh:

```text
Reports
Settings
Analytics
```

---

# 164. IMAGE OPTIMIZATION

Upload image:

* resize jika perlu,
* compress jika perlu,
* gunakan format yang sesuai.

---

# 165. PDF PERFORMANCE

PDF besar tidak boleh mengunci request HTTP terlalu lama jika dapat diproses melalui queue.

---

# 166. BACKUP PERFORMANCE

Backup sebaiknya tidak mengganggu request user.

Gunakan queue/scheduler jika diperlukan.

---

# 167. SCHEDULER

Scheduled task digunakan untuk:

```text
backup
cleanup
reminder preparation
maintenance
```

jika memang dibutuhkan.

---

# 168. CLEANUP RULE

Temporary file harus memiliki cleanup mechanism.

Jangan membiarkan:

```text
temporary PDF
temporary export
temporary upload
```

menumpuk selamanya.

---

# 169. STORAGE LIMIT

Upload harus memiliki:

* max file size,
* allowed MIME,
* storage monitoring jika dibutuhkan.

---

# 170. ERROR MONITORING

Production harus memiliki cara mengetahui:

```text
500 errors
failed jobs
database failures
storage failures
```

---

# 171. ENVIRONMENT CHECK

Sebelum development:

```bash
php -v
composer -V
node -v
npm -v
php artisan --version
```

---

# 172. LARAGON

FRNDLY development menggunakan Laragon.

Jangan menginstruksikan user menginstal PHP ulang jika PHP Laragon sudah tersedia dan berfungsi.

---

# 173. MYSQL

Database development menggunakan MySQL/MariaDB melalui Laragon.

Database credentials berasal dari `.env`.

---

# 174. COMMAND RULE

AI harus menjelaskan command sebelum meminta user menjalankannya jika command:

* destructive,
* mengubah database,
* install dependency,
* mengubah environment.

---

# 175. NO BLIND INSTALLATION

Jangan menjalankan:

```text
composer install
npm install
```

secara membabi buta jika dependency sudah tersedia dan tujuan command belum jelas.

---

# 176. PACKAGE INSTALLATION

Jika menambahkan dependency:

jelaskan:

```text
Package
Purpose
Why needed
Impact
```

---

# 177. BUILD CHECK

Setelah perubahan frontend besar:

```bash
npm run build
```

harus diperiksa.

---

# 178. LARAVEL CHECK

Setelah perubahan backend penting:

```bash
php artisan test
```

atau test relevan harus dijalankan.

---

# 179. MIGRATION CHECK

Setelah perubahan migration:

```bash
php artisan migrate
```

di development.

Kemudian test.

---

# 180. CODE STYLE

Gunakan formatter/linter yang telah dipilih project.

Jangan membuat style manual berbeda-beda.

---

# 181. FORMAT BEFORE COMMIT

Sebelum commit:

```text
Format
Lint
Test
Build
Review
```

sesuai kebutuhan perubahan.

---

# 182. GIT DIFF RULE

Sebelum commit:

periksa diff.

Pastikan tidak ada:

```text
debug code
secret
temporary file
unrelated change
```

---

# 183. COMMIT MESSAGE

Gunakan Conventional Commit style.

Contoh:

```text
feat: add customer management
feat: add invoice generation
fix: prevent duplicate payment
refactor: simplify order calculation
test: add payment validation tests
docs: update invoice documentation
```

---

# 184. BRANCH

Untuk feature besar:

```text
feature/customer-management
feature/order-management
feature/invoice-generation
```

Bug:

```text
fix/duplicate-payment
fix/invoice-total
```

---

# 185. AI CHANGE REPORT

Setelah coding, AI harus memberikan:

```text
## Changes

### Added
...

### Modified
...

### Removed
...

### Database
...

### Tests
...

### Commands
...

### Notes
...
```

---

# 186. AI BEFORE CODING

Sebelum mengubah kode kompleks:

AI harus memeriksa:

```text
Existing files
Existing architecture
Existing naming
Existing dependencies
Existing API
Existing database
```

---

# 187. AI MUST NOT OVERWRITE

AI tidak boleh mengganti file besar secara total jika perubahan dapat dilakukan secara incremental.

---

# 188. AI MUST PRESERVE EXISTING WORK

Jika code existing masih valid:

pertahankan.

Jangan rewrite hanya untuk menggunakan style AI sendiri.

---

# 189. AI MUST SEARCH BEFORE CREATE

Sebelum membuat:

```text
Service
Hook
Component
Utility
Helper
```

AI harus memeriksa apakah fungsi serupa sudah ada.

---

# 190. AI MUST REUSE

Jika reusable component/function sudah tersedia:

gunakan kembali.

Jangan membuat duplicate.

---

# 191. AI MUST NOT DUPLICATE BUSINESS LOGIC

Contoh:

Jika order calculation berada di:

```text
OrderCalculationService
```

jangan membuat versi berbeda di:

```text
OrderPage.jsx
InvoicePage.jsx
Dashboard.jsx
```

---

# 192. SINGLE CALCULATION SOURCE

Calculation penting:

```text
subtotal
discount
shipping
grand_total
paid
remaining
profit
```

harus memiliki authoritative implementation.

---

# 193. FRONTEND DISPLAY

Frontend hanya memformat data.

Contoh:

```text
75000
↓
Rp75.000
```

---

# 194. BACKEND BUSINESS DATA

Backend menentukan:

```text
75000
```

bukan:

```text
"Rp75.000"
```

untuk field numeric.

---

# 195. DATABASE NUMERIC DATA

Jangan menyimpan:

```text
"Rp75.000"
```

sebagai numeric business field.

Simpan:

```text
75000
```

---

# 196. JSON DATA

JSON API menggunakan structured data.

Contoh:

```json
{
    "unit_price": 75000,
    "quantity": 100,
    "subtotal": 7500000
}
```

Frontend melakukan formatting.

---

# 197. NULL HANDLING

Frontend harus menangani:

```text
null
undefined
empty
```

dengan benar.

Jangan menganggap semua API field selalu tersedia.

---

# 198. OPTIONAL DATA

Optional field harus memiliki UI yang masuk akal.

Contoh:

```text
Catatan:
—
```

bukan:

```text
undefined
```

---

# 199. API CONTRACT

Jika API field berubah:

periksa semua consumer.

Jangan mengubah:

```text
customer.name
```

menjadi:

```text
customer.full_name
```

tanpa memperbarui seluruh consumer dan dokumentasi.

---

# 200. FINAL CODING STANDARD

Setiap kode FRNDLY harus memenuhi:

```text
☐ Naming consistent
☐ No duplicate logic
☐ No magic numbers
☐ No magic strings
☐ Backend validation
☐ Error handling
☐ Loading state
☐ Empty state
☐ Responsive UI
☐ Security checked
☐ Query optimized
☐ Tests added where needed
☐ No debug code
☐ No secrets
☐ Documentation updated
☐ Existing architecture preserved
```

---

# 201. GOLDEN CODING RULE

> **Write code that another developer—or another AI six months from now—can understand without needing to guess your intention.**

---

# 202. FINAL AI RULE

Ketika AI akan menulis kode FRNDLY:

```text
READ
↓
UNDERSTAND
↓
SEARCH EXISTING CODE
↓
PLAN
↓
IMPLEMENT
↓
TEST
↓
REVIEW
↓
DOCUMENT
```

Bukan:

```text
PROMPT
↓
GENERATE RANDOM CODE
↓
HOPE IT WORKS
```

---

# 203. END OF CODING RULES

FRNDLY Coding Rules merupakan standar teknis aktif untuk seluruh development.

Jika terdapat konflik dengan keputusan Project Owner atau requirement terbaru:

**jangan menebak.**

Identifikasi konflik tersebut dan minta keputusan.

Jika solusi yang lebih sederhana tersedia:

**gunakan solusi sederhana.**

Jika solusi yang lebih aman tersedia:

**prioritaskan keamanan.**

Jika perubahan berpotensi merusak data:

**berhenti dan lakukan verification terlebih dahulu.**

---

**FRNDLY**

> Clean code is not code that looks clever.
> Clean code is code whose intention is obvious.
