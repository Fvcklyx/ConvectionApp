# FRNDLY Backend

Backend REST API untuk **FRNDLY** — aplikasi manajemen bisnis konveksi/custom apparel.

- **Framework:** Laravel 13
- **Auth:** Laravel Sanctum (token-based)
- **Database:** MySQL/MariaDB (default project; SQLite hanya untuk development cepat)
- **Dokumentasi API:** `docs/06-API.md`

## Modul yang terimplementasi

```text
Auth (login/logout/me)
Dashboard
Customers
Products
Orders
Payments
Invoices (termasuk PDF)
```

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Konfigurasi database di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=frndly
DB_USERNAME=root
DB_PASSWORD=
```

Migrasi dan seeder:

```bash
php artisan migrate --seed
php artisan serve   # http://127.0.0.1:8000
```

Akun demo: **admin@frndly.test / password123**

## Route Utama

Semua endpoint di bawah prefix `/api/v1`:

```text
POST   /auth/login
GET    /auth/me
POST   /auth/logout
GET    /dashboard
GET    /customers | /products | /orders | /payments | /invoices
GET    /customers/{id} | /products/{id} | /orders/{id} | /payments/{id} | /invoices/{id}
POST   /customers | /products | /orders | /payments | /invoices
PUT    /customers/{id} | /products/{id} | /orders/{id} | /payments/{id} | /invoices/{id}
DELETE /customers/{id} | /products/{id} | /orders/{id} | /payments/{id} | /invoices/{id}
GET    /invoices/{invoice}/pdf
GET    /health
```

## Testing

```bash
php artisan test
```

## Referensi

- `docs/` — seluruh spesifikasi (ERD, database, API, dll.)
- `ai/` — aturan development FRNDLY
