# FRNDLY — Business Control Center

Web application untuk mengelola bisnis garment/convection: **T-shirt, lanyard, jaket, ID card, attribute event**, dan produk custom lainnya.

Modul: Dashboard, Customers, Products, Orders, Payments, Invoices, Production, Shipping, Reviews, Testimonials, Reports.

## Arsitektur

```
ConvectionApp/
├── backend/    Laravel 13 + Sanctum (REST API)
└── frontend/   React + Vite (SPA)
```

## Persyaratan

- PHP 8.3+
- Composer
- Node.js 20+
- Database: **MySQL/MariaDB** (via Laragon)

## Setup Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Atur koneksi database di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=frndly
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
php artisan serve        # http://127.0.0.1:8000
```

Akun demo seeder: **admin@frndly.test / password123**

> SQLite hanya digunakan untuk pengujian/development cepat. Standar project adalah MySQL/MariaDB via Laragon.

## Setup Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173 (proxy /api ke :8000)
```

Production build:

```bash
npm run build            # output di frontend/dist
```

## API

Base URL: `/api/v1` — semua endpoint resource membutuhkan `Authorization: Bearer <token>` (Sanctum), kecuali login dan health check.

| Endpoint | Method | Deskripsi |
| --- | --- | --- |
| `/auth/login` | POST | Login (email + password, rate limit 5/menit), mengembalikan token |
| `/auth/me` | GET | Profil user terautentikasi |
| `/auth/logout` | POST | Hapus token aktif |
| `/dashboard` | GET | Metrik + aktivitas terbaru |
| `/customers`, `/products`, `/orders`, `/payments`, `/invoices` | GET/POST | List (paginate 20) & buat data |
| `/customers/{id}`, dst. | GET/PUT/DELETE | Detail, ubah, hapus |

Contoh login:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"email":"admin@frndly.test","password":"password123"}'
```

## Alur Order & Pembayaran

1. Order dibuat dengan status **Draft** (bisa menyertakan `order_items`; subtotal/remaining dihitung otomatis).
2. Status mengikuti alur: `draft → waiting_dp → dp_received → processing → paid`.
3. Pembayaran **DP** (`dp`, sekali) lalu **Pelunasan** (`final`). Setiap pembayaran otomatis memperbarui `paid_amount` dan `remaining_amount` pada order.
4. Invoice bernomor `INV-YYYYMMDD-000` (nomor urut reset harian, dihasilkan backend) dengan status `draft → issued → paid`.

## Testing

```bash
cd backend
php artisan test
```

## Dokumentasi Referensi

Lihat `docs/` (ERD, struktur database, spesifikasi API) dan `ai/project-context.md` untuk konteks bisnis.
