# FRNDLY Frontend

Frontend SPA untuk **FRNDLY** — aplikasi manajemen bisnis konveksi/custom apparel.

- **Framework:** React 19 + Vite
- **HTTP Client:** Axios
- **Icons:** lucide-react
- **Dokumentasi UI/UX:** `docs/07-UIUX.md`

## Setup

```bash
npm install
npm run dev    # http://localhost:5173 (proxy /api ke :8000)
```

Konfigurasi proxy Vite mengarah ke backend di `http://127.0.0.1:8000`.

## Script

```text
npm run dev      → development server
npm run build    → production build (frontend/dist)
npm run lint     → oxlint
npm run preview  → preview production build
```

## Struktur

```text
src/
├── api.js       → axios instance + interceptor token
├── App.jsx      → root component
├── main.jsx     → entry point
└── assets/
```

## Login

Autentikasi memakai email:

```text
POST /api/v1/auth/login
{ "email": "admin@frndly.test", "password": "password123" }
```

Token disimpan dan dikirim sebagai `Authorization: Bearer <token>`.

## Referensi

- `docs/` — seluruh spesifikasi (UI/UX, API, dll.)
- `ai/` — aturan development FRNDLY
