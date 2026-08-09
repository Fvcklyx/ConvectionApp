# FRNDLY — SECURITY SPECIFICATION

**Project:** FRNDLY
**Document:** Security Specification
**File:** `docs/Security.md`
**Version:** 1.0.0
**Status:** Approved Baseline
**Backend:** Laravel
**Frontend:** React.js
**Database:** MySQL/MariaDB
**Deployment:** VPS / Cloud
**Authentication:** Admin-only pada MVP
**Language:** Bahasa Indonesia

---

# 1. TUJUAN SECURITY

Security FRNDLY bertujuan melindungi:

* akun admin
* data customer
* data pesanan
* data pembayaran
* invoice
* file desain
* file bukti pembayaran
* laporan bisnis
* data laba
* konfigurasi perusahaan
* backup database
* audit trail

Security harus dirancang sejak awal, bukan ditambahkan setelah aplikasi selesai.

---

# 2. SECURITY PRINCIPLES

FRNDLY menggunakan prinsip:

```text
Defense in Depth
Least Privilege
Secure by Default
Fail Secure
Data Minimization
Input Validation
Output Encoding
Auditability
Secure Storage
Secure Deployment
```

---

# 3. SECURITY PRIORITY

Prioritas:

```text
1. Authentication
2. Authorization
3. Database Security
4. File Security
5. API Security
6. Session Security
7. Application Security
8. Infrastructure Security
9. Backup Security
10. Audit & Monitoring
```

---

# 4. THREAT MODEL

FRNDLY harus mempertimbangkan ancaman:

```text
Unauthorized login
Brute-force attack
Credential theft
Session hijacking
SQL Injection
XSS
CSRF
IDOR
Mass assignment
File upload attack
Malicious file
Path traversal
API abuse
Data leakage
Database compromise
Backup theft
Server compromise
Accidental deletion
Privilege escalation
```

---

# 5. MVP SECURITY SCOPE

MVP hanya memiliki:

```text
Admin
```

Tidak ada:

```text
Customer Login
Customer Portal
Multi-admin
Role Management
Multi-tenant
```

Namun architecture harus memungkinkan fitur tersebut ditambahkan kemudian.

---

# 6. AUTHENTICATION

Authentication menggunakan sistem authentication Laravel.

Jangan membuat authentication manual jika Laravel authentication mechanism tersedia.

Flow:

```text
Login
  ↓
Credential validation
  ↓
Authentication
  ↓
Session
  ↓
Authenticated Admin
```

---

# 7. LOGIN REQUIREMENTS

Login minimal membutuhkan:

```text
Username / Email
Password
```

Password tidak pernah disimpan dalam plaintext.

---

# 8. PASSWORD STORAGE

Password harus menggunakan hashing yang aman.

Recommended:

```text
Laravel Hash
```

Contoh:

```php
Hash::make($password)
```

Verifikasi:

```php
Hash::check($password, $hashedPassword)
```

Dilarang:

```text
MD5
SHA1
Plaintext password
Custom encryption untuk password
```

---

# 9. PASSWORD POLICY

Password minimal harus:

```text
Memiliki panjang minimum
Tidak mudah ditebak
Tidak menggunakan password umum
```

Application dapat menggunakan Laravel password validation rules.

Recommended baseline:

```text
Minimum 8 karakter
```

Lebih baik:

```text
12+ karakter
```

untuk akun admin.

---

# 10. PASSWORD RESET

Password reset harus:

```text
Token-based
Time-limited
Single-use
```

Token reset tidak boleh disimpan dalam bentuk plaintext jika framework menyediakan mekanisme hashing.

---

# 11. LOGIN RATE LIMITING

Login harus memiliki rate limiting.

Contoh:

```text
5 failed attempts
        ↓
Temporary throttling
```

Tujuan:

```text
Brute-force prevention
```

Nilai final dapat disesuaikan saat implementasi.

---

# 12. ACCOUNT LOCKOUT

MVP tidak harus menggunakan permanent account lockout.

Gunakan temporary throttling terlebih dahulu.

Contoh:

```text
Too many attempts
        ↓
Wait
        ↓
Try again
```

---

# 13. TWO-FACTOR AUTHENTICATION

2FA belum wajib untuk MVP.

Namun architecture harus memungkinkan:

```text
Password
+
OTP / Authenticator
```

ditambahkan kemudian.

Untuk production VPS, 2FA sangat direkomendasikan.

---

# 14. SESSION SECURITY

Session harus:

```text
Secure
HttpOnly
SameSite
```

Jika menggunakan HTTPS:

```text
Secure cookie = true
```

Session regeneration dilakukan setelah authentication.

---

# 15. SESSION FIXATION

Setelah login berhasil:

```text
Old session
      ↓
Regenerate
      ↓
New session
```

Tujuannya mencegah session fixation.

---

# 16. SESSION TIMEOUT

Session memiliki expiration.

Contoh:

```text
Inactivity
    ↓
Session expired
    ↓
Login again
```

Durasi final mengikuti konfigurasi production.

---

# 17. LOGOUT

Logout harus:

```text
Invalidate session
Regenerate CSRF token
```

Admin kemudian diarahkan ke login.

---

# 18. CSRF PROTECTION

Semua state-changing request harus terlindungi dari CSRF jika menggunakan cookie-based authentication.

Meliputi:

```text
POST
PUT
PATCH
DELETE
```

Laravel CSRF protection harus tetap aktif.

---

# 19. XSS PROTECTION

Frontend tidak boleh melakukan render HTML mentah tanpa sanitization.

Hindari:

```javascript
dangerouslySetInnerHTML
```

kecuali benar-benar diperlukan dan data telah disanitasi.

---

# 20. USER-GENERATED CONTENT

Data customer dapat berisi:

```text
Nama
Catatan
Review
Testimonial
```

Data tersebut dianggap untrusted.

Jangan pernah menganggap input customer aman.

---

# 21. INPUT VALIDATION

Semua input harus divalidasi di backend.

Frontend validation hanya berfungsi sebagai UX.

Model:

```text
Frontend validation
        ↓
Backend validation
        ↓
Database
```

Backend adalah authority.

---

# 22. REQUEST VALIDATION

Laravel Form Request direkomendasikan.

Contoh:

```php
StoreCustomerRequest
UpdateCustomerRequest
StoreOrderRequest
StorePaymentRequest
StoreProductRequest
```

---

# 23. SQL INJECTION

Jangan membuat SQL menggunakan string concatenation dari user input.

Hindari:

```php
DB::raw("SELECT * FROM customers WHERE name = '$name'");
```

Gunakan:

```php
Customer::where('name', $name)->get();
```

atau parameterized query.

---

# 24. ORM SECURITY

Gunakan Eloquent secara default.

Raw SQL hanya digunakan jika memang diperlukan.

Setiap penggunaan:

```text
DB::raw()
selectRaw()
whereRaw()
```

harus diperiksa secara khusus.

---

# 25. MASS ASSIGNMENT

Gunakan:

```text
$fillable
```

atau:

```text
$guarded
```

secara benar.

Jangan:

```php
Model::create($request->all());
```

tanpa validation dan field protection.

---

# 26. AUTHORIZATION

Authentication:

```text
Siapa kamu?
```

Authorization:

```text
Apa yang boleh kamu lakukan?
```

MVP:

```text
Admin → full access
```

Tetapi authorization layer tetap harus dibuat agar future role mudah ditambahkan.

---

# 27. POLICY

Gunakan Laravel Policies untuk resource-sensitive authorization.

Contoh:

```text
OrderPolicy
CustomerPolicy
ProductPolicy
InvoicePolicy
ReviewPolicy
FilePolicy
```

---

# 28. IDOR PROTECTION

Jangan menganggap ID yang diberikan frontend valid untuk user tersebut.

Contoh berbahaya:

```text
/orders/123
/orders/124
/orders/125
```

Authorization harus tetap diperiksa.

---

# 29. ROUTE PROTECTION

Admin route:

```text
auth
```

dan authorization middleware.

Contoh konsep:

```text
/authenticated
    ↓
/authorized
    ↓
/controller
```

---

# 30. API SECURITY

API harus:

```text
Authenticated
Validated
Authorized
Rate-limited where necessary
```

Response tidak boleh mengandung data internal yang tidak diperlukan.

---

# 31. API RESPONSE

Jangan mengembalikan:

```text
password
password_hash
remember_token
internal secrets
server path
private configuration
```

---

# 32. API RESOURCE

Gunakan Laravel API Resources jika diperlukan untuk mengontrol response.

Contoh:

```text
CustomerResource
OrderResource
ProductResource
InvoiceResource
ReviewResource
```

---

# 33. MASS DATA EXPOSURE

Jangan menggunakan:

```php
return Customer::all();
```

jika response akhirnya mengirim seluruh kolom database.

Gunakan field yang diperlukan.

---

# 34. PAGINATION

Endpoint yang dapat mengembalikan banyak data harus menggunakan pagination.

Contoh:

```text
/customers?page=1
/orders?page=1
/activity?page=1
```

Jangan mengirim ribuan record sekaligus.

---

# 35. RATE LIMITING

Rate limit dapat diterapkan pada:

```text
Login
Password reset
Search API
File upload
Export
Sensitive actions
```

---

# 36. CORS

CORS harus dibatasi hanya ke origin aplikasi yang valid.

Jangan menggunakan:

```text
*
```

untuk production tanpa alasan.

---

# 37. HTTPS

Production FRNDLY wajib menggunakan HTTPS.

Flow:

```text
Browser
   ↓
HTTPS
   ↓
Web Server
   ↓
Laravel
```

HTTP harus diarahkan ke HTTPS.

---

# 38. TLS

Gunakan TLS versi modern.

Hindari protocol lama.

Certificate harus:

```text
Valid
Not expired
Automatically renewed
```

---

# 39. ENVIRONMENT VARIABLES

Secret configuration harus berada di:

```text
.env
```

Contoh:

```text
APP_KEY
DB_PASSWORD
MAIL_PASSWORD
API_KEYS
AWS_SECRET
```

Jangan commit `.env`.

---

# 40. GIT SECURITY

`.gitignore` minimal harus mencakup:

```text
.env
.env.*
/vendor
/node_modules
/storage/*.key
```

Jangan commit:

```text
Password
API key
Private key
Database credentials
Production secrets
```

---

# 41. APP_KEY

`APP_KEY` harus:

```text
Unique
Secret
Stable
```

Jangan mengubah APP_KEY sembarangan di production karena dapat memengaruhi encrypted data/session.

---

# 42. DEBUG MODE

Development:

```text
APP_DEBUG=true
```

Production:

```text
APP_DEBUG=false
```

Ini wajib.

---

# 43. ERROR DISCLOSURE

Production error tidak boleh menampilkan:

```text
Stack trace
SQL query
File path
Environment variable
Server configuration
```

User hanya menerima:

```text
Terjadi kesalahan.
Silakan coba lagi.
```

Detail masuk ke log.

---

# 44. LOGGING

Application harus memiliki logging untuk:

```text
Authentication
Important business events
Errors
Security events
Critical changes
```

---

# 45. LOG SENSITIVITY

Jangan log:

```text
Password
Authentication token
API secret
Credit card data
Private keys
```

Walaupun aplikasi belum menggunakan payment gateway.

---

# 46. AUDIT TRAIL

Audit trail digunakan untuk perubahan penting.

Contoh:

```text
Order status changed
Payment recorded
Invoice generated
Customer updated
Product price changed
Settings changed
File deleted
```

---

# 47. AUDIT DATA

Audit minimal:

```text
User
Action
Entity
Entity ID
Old value
New value
Timestamp
IP address
User agent
```

IP dan user-agent harus digunakan secara proporsional dan sesuai kebutuhan keamanan.

---

# 48. AUDIT IMMUTABILITY

Audit log tidak boleh mudah diubah oleh user biasa.

Idealnya:

```text
Application
    ↓
Audit Log
    ↓
Read-only for normal admin UI
```

Permanent deletion audit harus sangat dibatasi.

---

# 49. SOFT DELETE

Data penting menggunakan soft delete jika sesuai.

Contoh:

```text
Customer
Order
Product
Review
```

Flow:

```text
Active
 ↓
Archived
 ↓
Permanent Delete
```

---

# 50. PERMANENT DELETE

Permanent delete adalah destructive action.

Harus:

```text
Require confirmation
Explain consequence
Require explicit action
Be logged
```

Untuk data sangat penting, dapat ditambahkan password confirmation.

---

# 51. DATABASE SECURITY

Database:

```text
Not publicly exposed
Strong password
Restricted access
Regular backup
Least privilege
```

---

# 52. DATABASE USER

Production sebaiknya tidak menggunakan:

```text
root
```

untuk aplikasi.

Gunakan dedicated database user:

```text
frndly_app
```

dengan privilege yang diperlukan.

---

# 53. DATABASE PORT

Database tidak perlu diekspos langsung ke public internet.

Ideal:

```text
Internet
   ↓
Web Server
   ↓
Application
   ↓
Private Database
```

---

# 54. DATABASE BACKUP

Backup dilakukan secara terjadwal.

Minimal:

```text
Daily
```

dan dapat ditingkatkan berdasarkan kebutuhan.

---

# 55. BACKUP STRATEGY

Gunakan prinsip:

```text
3-2-1 Backup
```

Artinya:

```text
3 copies
2 different storage/media
1 offsite
```

---

# 56. BACKUP ENCRYPTION

Backup yang mengandung:

```text
Customer
Order
Payment
Business data
```

harus dilindungi.

Backup production idealnya:

```text
Encrypted
Access controlled
Offsite
```

---

# 57. BACKUP TEST

Backup bukan dianggap berhasil hanya karena file berhasil dibuat.

Harus dilakukan:

```text
Backup
 ↓
Restore test
 ↓
Verify database
```

secara berkala.

---

# 58. FILE UPLOAD SECURITY

FRNDLY menerima:

```text
Design
Images
PDF
Payment proof
Attachments
```

File upload adalah security-sensitive feature.

---

# 59. FILE TYPE VALIDATION

Jangan hanya mempercayai extension.

Contoh:

```text
.jpg
.png
.pdf
```

harus divalidasi berdasarkan MIME/content dan ukuran.

---

# 60. FILE SIZE LIMIT

Upload harus memiliki maximum size.

Contoh baseline:

```text
Image:
10 MB

PDF:
20 MB

Design:
50 MB
```

Nilai final dapat disesuaikan dengan kebutuhan bisnis.

---

# 61. MALICIOUS FILE

File upload tidak boleh langsung dianggap aman.

Hindari menyimpan executable:

```text
.php
.exe
.sh
.bat
.js
```

sebagai attachment user.

---

# 62. PRIVATE FILE STORAGE

File sensitif sebaiknya tidak disimpan langsung sebagai public URL.

Contoh:

```text
Payment Proof
Design File
Internal Attachment
```

Gunakan private storage.

---

# 63. FILE ACCESS

Download file harus melalui authorization.

Flow:

```text
Request File
    ↓
Authenticated?
    ↓
Authorized?
    ↓
File exists?
    ↓
Download
```

---

# 64. PATH TRAVERSAL

Jangan menggunakan filename user secara langsung sebagai filesystem path.

Hindari:

```text
../../../secret.txt
```

Gunakan generated filename / UUID.

---

# 65. FILE NAME

Recommended:

```text
UUID.ext
```

Contoh:

```text
9f3c2d91-....pdf
```

Original filename disimpan sebagai metadata.

---

# 66. IMAGE SECURITY

Image upload dapat diproses:

```text
Validate
Resize if necessary
Strip metadata if appropriate
Store safely
```

---

# 67. INVOICE SECURITY

Invoice dapat mengandung:

```text
Customer identity
Address
Phone
Order details
Payment details
```

Karena itu invoice harus dianggap private business document.

---

# 68. INVOICE ACCESS

Invoice hanya dapat diakses oleh:

```text
Authenticated Admin
```

MVP belum menyediakan public invoice link.

---

# 69. ORDER DATA SECURITY

Order dapat mengandung:

```text
Customer
Price
Discount
Profit
Payment
Production
```

Data ini bersifat internal.

Frontend tidak boleh menampilkan profit kepada customer pada future portal.

---

# 70. CUSTOMER PRIVACY

Data customer hanya digunakan untuk kebutuhan bisnis.

Data tidak boleh:

```text
Dijual
Dibagikan sembarangan
Ditampilkan ke customer lain
```

---

# 71. PERSONAL DATA

FRNDLY dapat menyimpan:

```text
Nama
Nomor HP
Email
Alamat
Kota
Provinsi
```

Data harus dilindungi dan hanya dapat diakses sesuai kebutuhan aplikasi.

---

# 72. DATA MINIMIZATION

Jangan menyimpan data customer yang tidak diperlukan.

Contoh:

```text
NIK
Tanggal lahir
KTP
```

tidak perlu disimpan kecuali ada kebutuhan bisnis yang jelas.

---

# 73. DATA RETENTION

Tetapkan kebijakan:

```text
Active Data
      ↓
Archived
      ↓
Retention Period
      ↓
Permanent Delete
```

Periode retention dapat ditentukan kemudian sesuai kebutuhan bisnis dan kewajiban hukum.

---

# 74. PRIVACY & INDONESIAN CONTEXT

Karena FRNDLY beroperasi di Indonesia, implementasi harus memperhatikan ketentuan perlindungan data pribadi yang berlaku, termasuk:

```text
UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi
```

Implementasi final perlu disesuaikan dengan kebutuhan bisnis dan nasihat hukum apabila diperlukan.

---

# 75. CUSTOMER REVIEW SECURITY

Review customer dianggap untrusted input.

Harus divalidasi:

```text
Rating
Review
Photo
```

---

# 76. RATING VALIDATION

Rating hanya:

```text
1–10
```

Backend harus menolak:

```text
0
11
-1
10.5
```

jika requirement menetapkan integer 1–10.

---

# 77. TESTIMONIAL PHOTO

Foto testimonial harus melalui:

```text
Authentication
Validation
File size limit
MIME validation
Storage protection
```

---

# 78. ADMIN SETTINGS SECURITY

Settings sensitif harus diproteksi.

Contoh:

```text
Security settings
Backup
Database configuration
System maintenance
Permanent delete
```

---

# 79. COMPANY SETTINGS

Company settings dapat diubah admin.

Perubahan harus:

```text
Validated
Audited
```

terutama:

```text
Company name
Invoice information
Bank/payment information
```

---

# 80. INVOICE TEMPLATE SECURITY

Template tidak boleh memungkinkan admin menyisipkan arbitrary executable code.

Jika menggunakan custom template:

```text
Validated template structure
```

bukan arbitrary PHP execution.

---

# 81. PDF GENERATION

PDF generator harus:

```text
Sanitize input
Limit resource consumption
Avoid remote untrusted content
```

---

# 82. SSRF PROTECTION

Jika aplikasi nantinya mengambil resource dari URL eksternal, harus ada validasi.

Jangan langsung:

```text
fetch arbitrary URL
```

yang diberikan user.

---

# 83. COMMAND INJECTION

User input tidak boleh langsung masuk ke:

```text
shell command
exec()
system()
shell_exec()
```

Jika command diperlukan, gunakan fixed command dan validated arguments.

---

# 84. LARAVEL SECURITY

Gunakan fitur keamanan bawaan Laravel sebanyak mungkin:

```text
CSRF
Authentication
Authorization
Validation
Hashing
Encryption
Rate Limiting
Signed URLs
Policies
Middleware
```

Jangan mengganti dengan implementasi custom tanpa alasan.

---

# 85. REACT SECURITY

React secara default membantu escaping output.

Tetap:

```text
Jangan render arbitrary HTML
Jangan menyimpan secret di frontend
Jangan percaya data dari browser
```

---

# 86. FRONTEND SECRET

Jangan pernah menyimpan:

```text
Database password
Private API key
APP_KEY
Server secret
```

di React environment yang dikirim ke browser.

---

# 87. ENVIRONMENT SEPARATION

Minimal:

```text
Local
Staging
Production
```

Development tidak boleh menggunakan credential production.

---

# 88. PRODUCTION DEPLOYMENT

Production:

```text
APP_ENV=production
APP_DEBUG=false
```

Pastikan:

```text
HTTPS
Firewall
SSH security
Updated packages
Database protection
Backups
Monitoring
```

---

# 89. SERVER FIREWALL

Minimal hanya membuka port yang diperlukan.

Typical:

```text
22 SSH
80 HTTP
443 HTTPS
```

Database port:

```text
3306
```

tidak perlu dibuka ke public jika database berada di server yang sama/private network.

---

# 90. SSH SECURITY

Gunakan:

```text
SSH key
```

dan jika memungkinkan:

```text
Disable password login
Disable root login
```

Production VPS harus mengikuti hardening yang sesuai provider.

---

# 91. SERVER UPDATES

Server harus rutin mendapatkan:

```text
Security patches
OS updates
PHP updates
Laravel updates
Node dependencies
```

Update harus diuji sebelum production.

---

# 92. DEPENDENCY SECURITY

Dependency harus diperiksa secara berkala.

PHP:

```text
composer audit
```

Node:

```text
npm audit
```

Namun hasil audit harus ditinjau, bukan otomatis memperbarui semua package.

---

# 93. DEPENDENCY POLICY

Jangan menambahkan package hanya karena:

```text
Looks cool
AI recommended it
```

Setiap dependency harus memiliki alasan.

Pertimbangkan:

```text
Maintenance
Security
Popularity
Compatibility
License
Bundle size
```

---

# 94. SUPPLY CHAIN SECURITY

Package pihak ketiga harus:

```text
Known source
Trusted
Version-pinned/lockfile
Reviewed
```

Jangan menjalankan package tidak dikenal di production.

---

# 95. COMPOSER LOCK

Production harus menggunakan:

```text
composer.lock
```

agar dependency version konsisten.

---

# 96. NPM LOCK

Gunakan:

```text
package-lock.json
```

atau package manager lockfile yang dipilih.

Jangan mengabaikan lockfile.

---

# 97. SECURITY HEADERS

Production sebaiknya menggunakan security headers yang sesuai.

Contoh:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Strict-Transport-Security
```

Konfigurasi harus diuji agar tidak merusak aplikasi.

---

# 98. CONTENT SECURITY POLICY

CSP dapat digunakan untuk mengurangi risiko XSS.

Namun implementasi harus disesuaikan dengan:

```text
Laravel
React
Vite
CDN
External resources
```

Jangan menerapkan policy secara membabi buta.

---

# 99. CLICKJACKING

Aplikasi sebaiknya tidak dapat di-embed sembarangan.

Gunakan:

```text
frame-ancestors
```

atau mekanisme header yang sesuai.

---

# 100. MIME SNIFFING

Gunakan:

```text
X-Content-Type-Options: nosniff
```

jika kompatibel dengan deployment.

---

# 101. SECURITY MONITORING

MVP dapat memiliki monitoring sederhana:

```text
Application logs
Server logs
Failed login
Errors
Disk usage
Backup status
```

---

# 102. DISK MONITORING

Karena FRNDLY menyimpan file, storage harus dipantau.

Monitor:

```text
Disk usage
Database size
File storage size
Backup size
```

---

# 103. STORAGE WARNING

Contoh:

```text
Storage:
72%

⚠ Storage mulai tinggi.
```

Critical:

```text
Storage:
92%

⚠ Storage hampir penuh.
```

---

# 104. BACKUP MONITORING

Dashboard admin dapat menampilkan:

```text
Last successful backup
Backup size
Backup status
```

Jika gagal:

```text
⚠ Backup terakhir gagal.
```

---

# 105. SECURITY INCIDENT

Jika terjadi security incident:

```text
Identify
Contain
Investigate
Recover
Review
```

Contoh:

```text
Suspicious login
      ↓
Review audit
      ↓
Change password
      ↓
Invalidate sessions
      ↓
Check logs
      ↓
Restore if necessary
```

---

# 106. PASSWORD COMPROMISE

Jika password admin diduga bocor:

```text
1. Change password
2. Invalidate sessions
3. Review login activity
4. Review audit trail
5. Rotate relevant secrets
```

---

# 107. DATA BREACH

Jika terjadi kebocoran data:

```text
Contain incident
Identify affected data
Preserve logs
Investigate
Recover
Assess legal obligations
```

---

# 108. SECURITY TESTING

Sebelum production lakukan:

```text
Authentication testing
Authorization testing
Input validation
File upload testing
XSS testing
CSRF testing
SQL injection testing
IDOR testing
Session testing
Backup restore testing
```

---

# 109. SECURITY TEST CASES

Contoh:

```text
[ ] Wrong password rejected
[ ] Rate limiting works
[ ] Unauthenticated route blocked
[ ] Unauthorized resource blocked
[ ] SQL injection blocked
[ ] XSS blocked
[ ] CSRF protected
[ ] Invalid file rejected
[ ] Oversized file rejected
[ ] Private file inaccessible
[ ] Permanent delete requires confirmation
[ ] Production debug disabled
```

---

# 110. PENETRATION TESTING

Sebelum deployment besar:

```text
Vulnerability scanning
```

dan jika budget memungkinkan:

```text
Professional penetration testing
```

---

# 111. SECURITY DEFINITION OF DONE

Security sebuah feature dianggap selesai jika:

```text
[ ] Authentication requirement checked
[ ] Authorization checked
[ ] Backend validation
[ ] Frontend validation
[ ] SQL injection protected
[ ] XSS considered
[ ] CSRF considered
[ ] Sensitive data protected
[ ] Audit requirement checked
[ ] Error handling secure
[ ] Logging safe
[ ] File security checked
[ ] Rate limiting checked if necessary
[ ] Tests written
```

---

# 112. AI CODING SECURITY RULE

AI coding assistant tidak boleh:

```text
Membuat hardcoded password
Membuat hardcoded API key
Menonaktifkan CSRF tanpa alasan
Menonaktifkan authentication
Menonaktifkan authorization
Menggunakan APP_DEBUG=true di production
Mengekspos .env
Membuka database ke public tanpa alasan
Menggunakan raw SQL secara sembrono
Menyimpan password plaintext
Mengizinkan arbitrary file upload
```

---

# 113. SECURITY CHANGE RULE

Perubahan yang menyentuh:

```text
Authentication
Authorization
Database
File storage
Encryption
Backup
Server
Environment
```

harus dianggap sebagai **high-risk change**.

AI/developer wajib menjelaskan:

```text
What changed
Why
Security impact
Testing performed
Rollback plan
```

---

# 114. SECURITY DOCUMENTATION

Security-related implementation harus terdokumentasi di:

```text
docs/Security.md
docs/Architecture.md
docs/Database.md
docs/API.md
```

Dokumen tidak boleh saling bertentangan.

---

# 115. SECURITY SOURCE OF TRUTH

Untuk security:

```text
Security.md
      ↓
Architecture.md
      ↓
Implementation
      ↓
Tests
```

Jika terdapat konflik requirement security:

```text
Security.md
```

menjadi baseline keamanan.

---

# 116. FUTURE SECURITY ROADMAP

## Phase 1 — MVP

```text
Authentication
Session security
CSRF
Validation
Authorization foundation
File security
Audit trail
Backup
HTTPS
Basic server hardening
```

## Phase 2

```text
2FA
Advanced audit
Security monitoring
Better backup automation
Security alerts
```

## Phase 3

```text
Customer authentication
Customer portal security
Role-based access control
Advanced permission system
```

## Phase 4

```text
Multi-admin
Multi-role
Multi-tenant isolation
Advanced compliance
```

---

# 117. FINAL SECURITY PRINCIPLE

FRNDLY harus mengikuti prinsip:

> **Never trust the client.**

Browser tidak dipercaya.

Frontend tidak dipercaya.

User input tidak dipercaya.

File upload tidak dipercaya.

API request tidak dipercaya.

Semua harus:

```text
Validate
Authenticate
Authorize
Sanitize
Log where necessary
Store securely
```

---

# 118. FINAL SECURITY CONTRACT

Setiap developer atau AI coding assistant yang bekerja pada FRNDLY wajib memahami:

```text
Security is not a feature.

Security is a system-wide requirement.
```

Tidak boleh mengorbankan security hanya demi:

```text
Kecepatan coding
Kemudahan implementasi
Visual
Demo
Vibe coding
```

Jika ada konflik antara:

```text
"cara cepat"
```

dan

```text
"cara aman"
```

maka implementasi harus memilih cara aman, kecuali trade-off tersebut telah didiskusikan dan disetujui.

---

# END OF SECURITY SPECIFICATION

**FRNDLY — Business Management System**

Security Specification v1.0.0
