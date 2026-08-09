# FRNDLY — TESTING SPECIFICATION

**Project:** FRNDLY
**Document:** Testing Specification
**File:** `docs/09-Testing.md`
**Version:** 1.0.0
**Status:** Approved Baseline
**Backend:** Laravel
**Frontend:** React.js
**Database:** MySQL/MariaDB
**Deployment:** VPS / Cloud
**Language:** Bahasa Indonesia

---

# 1. TUJUAN TESTING

Testing FRNDLY bertujuan memastikan aplikasi:

* berjalan sesuai requirement
* tidak merusak fitur lain ketika ada perubahan
* aman terhadap input yang tidak valid
* menjaga konsistensi data
* menghasilkan invoice yang benar
* menghitung pembayaran dan laba dengan benar
* menangani file dengan aman
* tetap responsive
* dapat digunakan dengan baik pada desktop maupun mobile
* siap digunakan pada production

Testing bukan dilakukan hanya ketika aplikasi selesai.

Testing dilakukan sepanjang development.

---

# 2. TESTING PRINCIPLE

FRNDLY menggunakan prinsip:

```text
Test Early
Test Continuously
Test Critical Logic First
Test Business Rules
Test Security
Test User Flow
Test Regression
```

---

# 3. TESTING PYRAMID

FRNDLY menggunakan testing pyramid:

```text
              E2E
             /   \
            /     \
        Integration
          /       \
         /         \
       Unit Tests
```

Prioritas:

```text
Unit
 ↓
Feature / Integration
 ↓
E2E
 ↓
Manual QA
```

---

# 4. TESTING LEVEL

Testing dibagi menjadi:

```text
1. Unit Testing
2. Feature Testing
3. Integration Testing
4. API Testing
5. Database Testing
6. Frontend Testing
7. End-to-End Testing
8. Security Testing
9. UI/UX Testing
10. Responsive Testing
11. Performance Testing
12. Backup & Recovery Testing
13. Regression Testing
14. User Acceptance Testing
```

---

# 5. TESTING ENVIRONMENT

Minimal terdapat:

```text
Local
Staging
Production
```

Testing tidak boleh dilakukan langsung pada production untuk destructive test.

---

# 6. LOCAL TESTING

Local digunakan untuk:

```text
Development
Unit test
Feature test
Database test
Frontend test
Initial integration test
```

---

# 7. STAGING TESTING

Staging harus semirip mungkin dengan production.

Digunakan untuk:

```text
Integration
E2E
Deployment testing
Performance
Security
Invoice generation
File upload
Backup restore
```

---

# 8. PRODUCTION TESTING

Production hanya digunakan untuk:

```text
Smoke test
Monitoring
Health check
```

Tidak digunakan untuk eksperimen atau destructive testing.

---

# 9. TEST DATA

Gunakan data dummy.

Contoh:

```text
Customer:
Budi Santoso

Product:
Kaos Custom

Order:
ORD-20260804-001
```

Jangan menggunakan data customer asli saat testing kecuali memang diperlukan dan telah dilindungi.

---

# 10. DATABASE TESTING

Test database harus menggunakan database testing terpisah.

Jangan menjalankan automated test terhadap database production.

---

# 11. DATABASE REFRESH

Automated test harus dapat membersihkan database setelah test.

Laravel testing utilities dapat digunakan untuk:

```text
RefreshDatabase
```

---

# 12. UNIT TESTING

Unit test digunakan untuk menguji logic kecil secara terisolasi.

Contoh:

```text
PriceCalculator
DiscountCalculator
ProfitCalculator
InvoiceNumberGenerator
PaymentCalculator
OrderStatusCalculator
```

---

# 13. PRICE CALCULATOR TEST

Contoh:

```text
Harga satuan = Rp50.000
Quantity = 10
```

Expected:

```text
Subtotal = Rp500.000
```

Test:

```text
[ ] Quantity 1
[ ] Quantity 10
[ ] Quantity 100
[ ] Quantity 0 rejected
[ ] Negative quantity rejected
```

---

# 14. DISCOUNT TEST

Diskon harus mengikuti rule bisnis yang ditentukan admin.

Contoh:

```text
Subtotal = Rp1.000.000
Discount = Rp100.000
```

Expected:

```text
Total = Rp900.000
```

Test:

```text
[ ] No discount
[ ] Fixed discount
[ ] Percentage discount
[ ] Maximum discount
[ ] Invalid discount
```

---

# 15. PAYMENT CALCULATION TEST

FRNDLY hanya memiliki satu kali DP.

Contoh:

```text
Total = Rp1.000.000
DP = Rp300.000
```

Expected:

```text
DP = Rp300.000
Remaining = Rp700.000
```

Setelah pelunasan:

```text
Paid = Rp1.000.000
Remaining = Rp0
```

---

# 16. PAYMENT VALIDATION

Test:

```text
[ ] DP tidak boleh negatif
[ ] DP tidak boleh melebihi total
[ ] Pelunasan tidak boleh melebihi sisa
[ ] DP hanya satu kali
[ ] Lunas ketika remaining = 0
```

---

# 17. ORDER STATUS TESTING

Status:

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

Test valid transitions.

---

# 18. INVALID STATUS TRANSITION

Contoh:

```text
Draft → Lunas
```

harus ditolak jika business rule tidak mengizinkan.

Contoh lain:

```text
Menunggu DP → Lunas
```

harus mengikuti payment logic.

---

# 19. STATUS CONSISTENCY

Order status tidak boleh hanya berubah karena frontend mengirim:

```text
status = "Lunas"
```

Backend harus memvalidasi kondisi pembayaran.

---

# 20. INVOICE NUMBER TESTING

Format:

```text
INV-YYYYMMDD-000
```

Counter `000` di-reset setiap hari.

Contoh hari yang sama:

```text
INV-20260804-001
INV-20260804-002
```

Keesokan harinya counter dimulai dari `001` lagi:

```text
INV-20260805-001
```

Test:

```text
[ ] Format benar
[ ] Sequential
[ ] Tidak duplicate
[ ] Date benar
[ ] Counter benar
[ ] Counter reset harian
[ ] Reset counter tidak merusak nomor hari sebelumnya
```

---

# 21. CONCURRENT INVOICE TEST

Jika dua order dibuat hampir bersamaan:

```text
Request A
Request B
```

invoice number harus tetap unik.

Expected:

```text
INV-20260804-001
INV-20260804-002
```

bukan:

```text
INV-20260804-001
INV-20260804-001
```

---

# 22. ORDER ID TESTING

Order ID juga harus:

```text
Unique
Stable
Searchable
```

Tidak boleh berubah setelah order dibuat.

---

# 23. PRODUCT TESTING

Test:

```text
[ ] Create product
[ ] Update product
[ ] Archive product
[ ] Restore product
[ ] Permanent delete
```

---

# 24. PRODUCT VARIATION TEST

Contoh:

```text
Kaos
 ├── Hitam
 ├── Putih
 ├── Navy
```

Test:

```text
[ ] Variation creation
[ ] Variation update
[ ] Variation deletion
[ ] Price handling
```

---

# 25. SIZE TESTING

Produk seperti kaos:

```text
S
M
L
XL
XXL
```

Test quantity per size:

```text
S = 10
M = 20
L = 30
XL = 15
```

Total:

```text
75 pcs
```

harus sesuai dengan order.

---

# 26. MULTI-PRODUCT ORDER TEST

Satu invoice dapat memiliki banyak produk.

Contoh:

```text
Kaos
Lanyard
ID Card
Jaket
```

Test:

```text
[ ] Multiple products
[ ] Different quantities
[ ] Different prices
[ ] Different notes
[ ] Different variations
```

---

# 27. ORDER TOTAL TEST

Contoh:

```text
Kaos      10 × 50.000 = 500.000
Lanyard   20 × 10.000 = 200.000
ID Card   20 ×  5.000 = 100.000
```

Expected:

```text
Subtotal = 800.000
```

Kemudian discount, ongkir, dan biaya lain dihitung sesuai business rule.

---

# 28. SHIPPING TEST

Test:

```text
[ ] Shipping enabled
[ ] Shipping disabled
[ ] Shipping cost
[ ] Shipping address
[ ] Shipping status
```

Pastikan ongkir tidak tercampur dengan harga produk.

---

# 29. PROFIT TEST

Profit:

```text
Revenue
-
Product Cost
-
Other applicable costs
=
Profit
```

Contoh:

```text
Revenue = Rp1.000.000
Modal = Rp700.000

Profit = Rp300.000
```

---

# 30. COST RANGE TEST

Jika modal menggunakan rentang quantity:

```text
1–10
11–50
51–100
101+
```

Test quantity tepat pada boundary:

```text
10
11
50
51
100
101
```

Ini wajib karena boundary sering menjadi sumber bug.

---

# 31. PRICE HISTORY TESTING

Setiap perubahan harga harus dapat dilacak.

Contoh:

```text
Rp50.000
↓
Rp52.000
↓
Rp55.000
```

Pastikan order lama tidak berubah menjadi Rp55.000.

---

# 32. HISTORICAL PRICE IMMUTABILITY

Jika order dibuat dengan:

```text
Harga = Rp50.000
```

kemudian product price berubah:

```text
Rp55.000
```

order lama tetap:

```text
Rp50.000
```

---

# 33. CUSTOMER TESTING

Test:

```text
[ ] Create customer
[ ] Update customer
[ ] Search customer
[ ] Filter customer
[ ] View order history
[ ] Repeat order count
[ ] Archive customer
[ ] Restore customer
```

---

# 34. REPEAT ORDER TEST

Customer:

```text
Budi
```

Order:

```text
1
2
3
```

Expected:

```text
Repeat Order Count = 3
```

Pastikan count tidak double count karena refresh atau query duplicate.

---

# 35. CUSTOMER SEARCH

Search harus dapat berdasarkan:

```text
Nama
No. HP
Email
Order ID
Invoice
```

---

# 36. GLOBAL SEARCH TESTING

Global search harus dapat menemukan:

```text
Customer
Order
Invoice
Product
Activity
```

Search:

```text
INV-20260804-001
```

harus menemukan order yang sesuai.

---

# 37. REVIEW TESTING

Review hanya dapat dibuat setelah:

```text
Order = Lunas
```

---

# 38. REVIEW VALIDATION

Rating:

```text
1–10
```

Test:

```text
[ ] 1 accepted
[ ] 10 accepted
[ ] 0 rejected
[ ] 11 rejected
[ ] Negative rejected
```

---

# 39. TESTIMONIAL TESTING

Test:

```text
[ ] Review text
[ ] Optional testimonial
[ ] Optional photo
[ ] No testimonial
[ ] Invalid photo
[ ] Oversized photo
```

---

# 40. FILE UPLOAD TESTING

Test extension:

```text
jpg
jpeg
png
webp
pdf
```

Sesuai file type yang diizinkan.

---

# 41. MALICIOUS FILE TEST

Test file dengan extension palsu:

```text
malicious.php.jpg
```

atau file yang MIME-nya tidak sesuai.

Expected:

```text
Rejected
```

---

# 42. FILE SIZE TEST

Test:

```text
Valid size
Maximum size
Above maximum
```

Expected:

```text
Above maximum → Rejected
```

---

# 43. PRIVATE FILE TEST

Tanpa authentication:

```text
GET /private-file/123
```

Expected:

```text
401/403
```

Dengan authorization:

```text
Download allowed
```

---

# 44. INVOICE PDF TEST

Test:

```text
[ ] PDF generated
[ ] Customer correct
[ ] Order correct
[ ] Product correct
[ ] Quantity correct
[ ] Price correct
[ ] Discount correct
[ ] Payment correct
[ ] Remaining correct
[ ] Invoice number correct
[ ] Order ID correct
[ ] Company branding correct
```

---

# 45. INVOICE CONTENT TEST

Pastikan invoice tidak mengambil data secara salah.

Contoh:

```text
Customer A
```

tidak boleh mendapatkan:

```text
Customer B
```

---

# 46. INVOICE TEMPLATE TEST

Jika terdapat beberapa template:

```text
Template A
Template B
Template C
```

test setiap template.

---

# 47. PDF EDGE CASE

Test:

```text
Long customer name
Long address
Many products
Many order items
Long notes
Large quantity
Large total
```

PDF tidak boleh:

```text
Overflow
Missing content
Broken layout
```

---

# 48. DASHBOARD TESTING

Dashboard harus menampilkan data aktual.

Test:

```text
Total Orders
Unfinished Orders
DP Orders
Paid Orders
Revenue
Profit
Repeat Customers
```

---

# 49. DASHBOARD CALCULATION TEST

Contoh:

```text
10 total orders
3 unfinished
2 DP
5 paid
```

Expected:

```text
10 = total
3 = unfinished
2 = DP
5 = paid
```

Tidak boleh terjadi double counting.

---

# 50. DASHBOARD DATE FILTER

Test:

```text
Today
This week
This month
This year
Custom range
```

Data harus mengikuti range.

---

# 51. REPORT TESTING

Reports harus konsisten dengan database.

Contoh:

```text
Dashboard Revenue
=
Report Revenue
=
Order Revenue
```

Jika berbeda, harus ada business rule yang jelas.

---

# 52. EXPORT TESTING

FRNDLY mendukung:

```text
PDF
CSV
Excel
```

Test:

```text
[ ] Export all
[ ] Export filtered
[ ] Export date range
[ ] Export search result
```

---

# 53. EXPORT DATA CONSISTENCY

Data export harus sama dengan data yang ditampilkan.

Jika filter:

```text
Status = Lunas
```

export tidak boleh memasukkan:

```text
Status = Draft
```

---

# 54. FILTER TESTING

Filter:

```text
Status
Date
Customer
Product
Payment
Shipping
```

harus dapat digunakan secara kombinasi jika UI mengizinkan.

---

# 55. SORTING TEST

Test:

```text
Newest
Oldest
Highest price
Lowest price
Highest profit
```

---

# 56. PAGINATION TEST

Test:

```text
1 page
2 pages
Many pages
Last page
Empty page
```

Pastikan tidak ada duplicate record.

---

# 57. SOFT DELETE TEST

Flow:

```text
Active
↓
Delete
↓
Archived
```

Expected:

```text
Tidak muncul di default list
```

---

# 58. RESTORE TEST

```text
Archived
↓
Restore
↓
Active
```

Data harus kembali tanpa kehilangan relationship penting.

---

# 59. PERMANENT DELETE TEST

Permanent delete harus:

```text
Require confirmation
Delete intended record
Create audit event
Handle related records safely
```

---

# 60. RELATIONSHIP DELETE TEST

Contoh customer memiliki:

```text
Orders
Reviews
Attachments
```

Jangan menghapus parent secara sembarangan sehingga menyebabkan orphan data.

Relationship policy harus jelas.

---

# 61. AUTO SAVE TESTING

Draft harus tersimpan otomatis.

Test:

```text
Input data
↓
Wait
↓
Refresh
↓
Draft remains
```

---

# 62. AUTO SAVE FAILURE

Jika server gagal:

```text
Auto-save failed
```

UI harus memberi feedback tanpa menghapus input user.

---

# 63. DRAFT RECOVERY

Test:

```text
Create order
Input data
Close browser
Open again
```

Jika fitur recovery mendukungnya:

```text
Draft recovered
```

---

# 64. ACTIVITY CENTER TEST

Activity Center harus mencatat aktivitas penting.

Contoh:

```text
Order created
Payment added
Order status changed
Invoice generated
Customer updated
```

---

# 65. AUDIT TRAIL TEST

Pastikan:

```text
Actor
Action
Entity
Timestamp
```

tersimpan dengan benar.

---

# 66. SECURITY TESTING

Minimal:

```text
[ ] Authentication
[ ] Authorization
[ ] CSRF
[ ] XSS
[ ] SQL Injection
[ ] IDOR
[ ] File upload
[ ] Session security
[ ] Rate limiting
```

---

# 67. AUTHENTICATION TEST

Test:

```text
Valid credential → Success
Wrong password → Fail
Unknown user → Fail
Empty credential → Fail
```

---

# 68. AUTHORIZATION TEST

Unauthenticated:

```text
/dashboard
```

Expected:

```text
Redirect to login / 401
```

---

# 69. SESSION TEST

Test:

```text
Login
Logout
Session expiration
Invalid session
Multiple browser sessions
```

---

# 70. CSRF TEST

Request tanpa CSRF token pada protected operation harus ditolak sesuai mekanisme aplikasi.

---

# 71. XSS TEST

Input:

```html
<script>alert('XSS')</script>
```

Expected:

```text
Tidak dieksekusi
```

---

# 72. SQL INJECTION TEST

Test malicious input seperti:

```text
' OR '1'='1
```

Expected:

```text
Tidak mengubah query
```

---

# 73. IDOR TEST

Attempt:

```text
/order/1
/order/2
/order/3
```

harus tetap melalui authorization.

---

# 74. API TESTING

Test setiap endpoint:

```text
Success
Validation error
Authentication error
Authorization error
Not found
Server error
```

---

# 75. HTTP STATUS

Gunakan status yang sesuai.

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
429 Too Many Requests
500 Server Error
```

---

# 76. API VALIDATION RESPONSE

Validation error harus konsisten.

Contoh:

```json
{
    "message": "Data yang diberikan tidak valid.",
    "errors": {
        "name": [
            "Nama wajib diisi."
        ]
    }
}
```

---

# 77. FRONTEND TESTING

Frontend harus diuji:

```text
Component
Form
State
API interaction
Loading state
Error state
Empty state
Responsive behavior
```

---

# 78. FORM TESTING

Setiap form harus diuji:

```text
Empty
Valid
Invalid
Boundary
Very long input
Special character
Duplicate data
```

---

# 79. LOADING STATE

Saat API berjalan:

```text
Loading
```

harus ditampilkan.

Jangan membuat user mengira aplikasi freeze.

---

# 80. ERROR STATE

Jika API gagal:

```text
Error message
Retry action
```

harus tersedia jika sesuai.

---

# 81. EMPTY STATE

Contoh:

```text
Belum ada customer.
```

Bukan:

```text
Blank screen
```

---

# 82. SUCCESS FEEDBACK

Action penting harus memberikan feedback.

Contoh:

```text
Customer berhasil dibuat.
```

Tidak harus selalu menggunakan popup.

Toast atau inline feedback dapat digunakan.

---

# 83. POP-UP RULE

FRNDLY tidak boleh menggunakan modal berlebihan.

Modal digunakan untuk:

```text
Destructive action
Important confirmation
Complex input
```

Bukan untuk setiap action sederhana.

---

# 84. RESPONSIVE TESTING

Minimal:

```text
Desktop
Laptop
Tablet
Mobile
```

---

# 85. BREAKPOINT TESTING

Test pada ukuran:

```text
320px
375px
390px
768px
1024px
1280px
1440px+
```

---

# 86. MOBILE TESTING

Mobile harus tetap mendukung:

```text
Dashboard
Customer
Order
Payment
Invoice
Search
Filter
Activity
```

---

# 87. TOUCH TARGET

Button pada mobile harus mudah disentuh.

Hindari:

```text
Button terlalu kecil
Link terlalu rapat
```

---

# 88. ACCESSIBILITY TESTING

Minimal:

```text
Keyboard navigation
Visible focus
Form labels
Alt text
Contrast
Semantic HTML
```

---

# 89. PERFORMANCE TESTING

Test:

```text
Page load
API response
Database query
Search
Dashboard
PDF generation
Export
File upload
```

---

# 90. DATABASE PERFORMANCE

Perhatikan:

```text
N+1 query
Missing indexes
Large joins
Unoptimized search
Large dataset
```

---

# 91. N+1 TESTING

Contoh:

```text
Orders
  ↓
Customer
  ↓
Products
```

Pastikan tidak melakukan query database berulang untuk setiap row.

Gunakan eager loading jika diperlukan.

---

# 92. LARGE DATA TEST

Simulasikan:

```text
1,000 customers
10,000 orders
50,000 order items
```

dan lihat:

```text
Search
Dashboard
Reports
Export
```

---

# 93. SEARCH PERFORMANCE

Search harus tetap usable ketika data bertambah.

Database indexing perlu dipertimbangkan pada field yang sering dicari.

---

# 94. PDF PERFORMANCE

Test invoice:

```text
1 product
10 products
50 products
100 products
```

PDF generator tidak boleh menyebabkan timeout yang tidak wajar.

---

# 95. EXPORT PERFORMANCE

Export data besar harus mempertimbangkan:

```text
Memory
CPU
Execution time
File size
```

---

# 96. BACKUP TESTING

Test:

```text
Backup created
Backup readable
Backup stored
Backup restored
```

---

# 97. RESTORE TESTING

Simulasi:

```text
Database lost
↓
Restore backup
↓
Verify data
```

Data penting harus kembali.

---

# 98. DISASTER RECOVERY TEST

Minimal test:

```text
Database corruption
File storage loss
Server failure
```

Tujuannya memastikan recovery procedure benar-benar dapat dilakukan.

---

# 99. REGRESSION TESTING

Setiap perubahan besar harus menjalankan regression test.

Contoh:

```text
Payment feature changed
```

Test kembali:

```text
Order
Invoice
Dashboard
Profit
Reports
```

---

# 100. CRITICAL REGRESSION SUITE

Minimal setiap release:

```text
[ ] Login
[ ] Dashboard
[ ] Customer
[ ] Create order
[ ] Payment
[ ] Status
[ ] Invoice
[ ] Product
[ ] Review
[ ] Search
[ ] Export
[ ] Backup
```

---

# 101. SMOKE TEST

Setelah deployment:

```text
Login
↓
Dashboard
↓
Customer
↓
Create/view order
↓
Invoice
```

Jika gagal, deployment dianggap failed.

---

# 102. USER ACCEPTANCE TESTING

UAT memastikan aplikasi benar-benar sesuai workflow bisnis.

Contoh:

```text
Customer baru
↓
Create order
↓
Menunggu DP
↓
DP masuk
↓
Produksi
↓
Lunas
↓
Review
```

Workflow tersebut harus dapat dilakukan tanpa error.

---

# 103. UAT SCENARIO 1 — CUSTOMER BARU

```text
1. Create customer
2. Create order
3. Add product
4. Add quantity
5. Add price
6. Save draft
7. Set Menunggu DP
8. Record DP
9. Set DP Masuk
10. Process order
11. Record final payment
12. Set Lunas
13. Generate invoice
14. Add review
```

Expected:

```text
Workflow completed successfully.
```

---

# 104. UAT SCENARIO 2 — REPEAT ORDER

```text
Customer existing
↓
Create new order
↓
Select existing customer
↓
Add products
↓
Apply discount
↓
Payment
↓
Complete
```

Expected:

```text
Order count increases
Historical orders remain intact
Previous order prices unchanged
```

---

# 105. UAT SCENARIO 3 — MULTI-PRODUCT

```text
Customer
 ├── Kaos
 ├── Lanyard
 ├── ID Card
 └── Jaket
```

Expected:

```text
One order
One invoice
Multiple order items
Correct total
Correct payment
Correct profit
```

---

# 106. UAT SCENARIO 4 — DESIGN REVISION

```text
Upload design
↓
Revision
↓
Upload new version
↓
Mark revision
↓
Approve final design
```

Expected:

```text
Design history preserved.
```

---

# 107. UAT SCENARIO 5 — SHIPPING

```text
Order completed
↓
Shipping information
↓
Shipping status
↓
Tracking information
```

Expected:

```text
Shipping data stored correctly.
```

---

# 108. UAT SCENARIO 6 — ARCHIVE

```text
Customer
↓
Archive
↓
Archived page
↓
Restore
```

Expected:

```text
Data preserved.
```

---

# 109. UAT SCENARIO 7 — PERMANENT DELETE

```text
Archive
↓
Permanent delete
↓
Confirmation
↓
Delete
```

Expected:

```text
Record permanently removed according to deletion policy.
Action recorded in audit trail where applicable.
```

---

# 110. BUG SEVERITY

Bug dikategorikan:

### Critical

Aplikasi/security/data integrity tidak dapat digunakan.

Contoh:

```text
Database corruption
Authentication bypass
Payment calculation completely wrong
```

### High

Fitur utama rusak.

```text
Invoice gagal
Order tidak dapat dibuat
Payment salah
```

### Medium

Fitur bekerja tetapi terdapat masalah.

```text
Filter salah
Export sebagian salah
```

### Low

Masalah minor.

```text
Spacing
Minor UI issue
```

---

# 111. BUG PRIORITY

Priority:

```text
P0 → Immediate
P1 → Very High
P2 → Normal
P3 → Low
```

Critical security bug:

```text
P0
```

---

# 112. BUG REPORT FORMAT

Setiap bug minimal memiliki:

```text
Title
Environment
Steps to reproduce
Expected result
Actual result
Severity
Priority
Screenshot / log
```

---

# 113. EXAMPLE BUG

```text
Title:
Invoice total salah ketika menggunakan diskon.

Environment:
Local

Steps:
1. Create order
2. Add product Rp1.000.000
3. Add discount Rp100.000
4. Generate invoice

Expected:
Rp900.000

Actual:
Rp1.000.000

Severity:
High

Priority:
P1
```

---

# 114. TEST CASE FORMAT

Gunakan format:

```text
ID
Feature
Scenario
Precondition
Steps
Expected Result
Actual Result
Status
```

Contoh:

```text
TC-ORDER-001

Feature:
Order

Scenario:
Create order

Precondition:
Admin logged in

Steps:
1. Open order page
2. Create order
3. Select customer
4. Add product
5. Save

Expected:
Order created successfully.

Status:
PASS
```

---

# 115. TEST NAMING

Backend:

```text
test_user_can_create_order()
test_order_total_is_calculated_correctly()
test_invoice_number_is_unique()
```

Frontend:

```text
should render customer list
should calculate order total
should display validation error
```

---

# 116. TEST COVERAGE

Coverage bukan satu-satunya indikator kualitas.

Target awal:

```text
Critical business logic:
High coverage

Security-sensitive code:
High coverage

Simple UI:
Reasonable coverage
```

Jangan mengejar:

```text
100% coverage
```

dengan mengorbankan test quality.

---

# 117. CRITICAL BUSINESS LOGIC

Wajib memiliki automated tests:

```text
Price
Discount
Payment
Profit
Invoice
Order status
Quantity
Repeat order
```

---

# 118. TEST-FIRST FOR CRITICAL LOGIC

Untuk logic penting:

```text
Requirement
↓
Test
↓
Implementation
↓
Pass
```

Contoh:

```text
Requirement:
DP hanya satu kali.

Test:
Second DP rejected.

Implementation:
Payment service.

Result:
PASS.
```

---

# 119. AI CODING TEST RULE

AI coding assistant tidak boleh mengatakan:

```text
"Feature sudah selesai."
```

hanya karena code berhasil dibuat.

AI harus mengecek:

```text
Implementation
↓
Tests
↓
Expected behavior
↓
Regression
```

---

# 120. AI TEST REPORT

Setiap AI coding task yang signifikan harus memberikan:

```text
Implemented:
...

Tests:
...

Passed:
...

Failed:
...

Not tested:
...

Potential risks:
...
```

---

# 121. DEFINITION OF DONE

Feature dianggap DONE jika:

```text
[ ] Requirement implemented
[ ] Backend validation
[ ] Frontend validation
[ ] Unit test if applicable
[ ] Feature test if applicable
[ ] Integration tested
[ ] Error state tested
[ ] Empty state tested
[ ] Loading state tested
[ ] Security checked
[ ] Responsive checked
[ ] Regression checked
[ ] Documentation updated
```

---

# 122. RELEASE CHECKLIST

Sebelum release:

```text
[ ] Tests pass
[ ] No critical bug
[ ] No high security vulnerability
[ ] Migration tested
[ ] Backup available
[ ] Restore procedure verified
[ ] APP_DEBUG=false
[ ] HTTPS active
[ ] Environment correct
[ ] Assets built
[ ] Smoke test passed
```

---

# 123. PRODUCTION DEPLOYMENT CHECK

Setelah deploy:

```text
[ ] Homepage works
[ ] Login works
[ ] Dashboard works
[ ] Customer works
[ ] Order works
[ ] Payment works
[ ] Invoice works
[ ] File upload works
[ ] Search works
[ ] Export works
[ ] Logs working
[ ] Backup working
```

---

# 124. TESTING WORKFLOW FRNDLY

Workflow standar:

```text
Requirement
    ↓
Design
    ↓
Implementation
    ↓
Unit Test
    ↓
Feature Test
    ↓
Integration Test
    ↓
UI Test
    ↓
Security Test
    ↓
Regression Test
    ↓
UAT
    ↓
Release
```

---

# 125. TESTING PRIORITY FRNDLY

Urutan prioritas:

```text
1. Data Integrity
2. Payment
3. Invoice
4. Order
5. Authentication
6. Authorization
7. Customer
8. Product
9. Profit
10. File
11. Dashboard
12. Reports
13. UI
```

---

# 126. FINAL TESTING PRINCIPLE

FRNDLY bukan hanya harus:

> "Bisa dijalankan."

Tetapi harus:

> **Benar, aman, konsisten, dapat diuji, dan dapat dipertanggungjawabkan.**

Setiap data yang masuk harus menghasilkan data yang konsisten.

Setiap perubahan harus dapat dilacak.

Setiap fitur penting harus memiliki test.

Setiap release harus melewati regression test.

---

# 127. FINAL TESTING CONTRACT

```text
FRNDLY DEVELOPMENT CONTRACT

No feature is DONE without verification.

No critical business logic without automated testing.

No production deployment without smoke testing.

No destructive operation without testing.

No security-sensitive feature without security review.

No database-changing feature without migration testing.

No invoice/payment feature without calculation testing.
```

---

# END OF TESTING SPECIFICATION

**FRNDLY — Business Management System**

Testing Specification v1.0.0
