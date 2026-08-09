# LAPORAN AUDIT DOKUMENTASI FRNDLY

**Tanggal audit:** 2026-08-09
**Cakupan:** 21 file `.md` (root, `ai/`, `docs/`, `revision/`, `backend/`, `frontend/`)
**Git:** 3 commit (`7b61282` first commit, `93a4c5c` Revision 1, `6c5f852` Change Name Revision)

---

## Ringkasan Ukuran File (semua sudah dibaca penuh)

| File | Baris | Status |
|------|------:|--------|
| `docs/01-PRD.md` | 1688 | Lengkap |
| `docs/02-SRS.md` | 2575 | Lengkap |
| `docs/03-Architecture.md` | 2330 | Lengkap |
| `docs/04-ERD.md` | 2127 | Lengkap (26 entity) |
| `docs/05-Database.md` | 2958 | Lengkap |
| `docs/06-API.md` | 2514 | Lengkap |
| `docs/07-UIUX.md` | 2971 | Lengkap |
| `docs/08-Security.md` | 2202 | Lengkap |
| `docs/09-Testing.md` | 2452 | Lengkap |
| `docs/10-Changelog.md` | 1180 | Lengkap |
| `docs/11-Business-Rules.md` | 102 | **TERPOTONG** |
| `ai/master-rules.md` | 2947 | Lengkap |
| `ai/master-prompt.md` | 2368 | Lengkap |
| `ai/coding-rules.md` | 3307 | Lengkap |
| `ai/project-context.md` | 1592 | Lengkap |
| `README.md` | 97 | Perlu perbaikan |
| `backend/README.md` | — | Template default |
| `frontend/README.md` | — | Template default |
| `CONTEXT.md`, `AGENT.md`, `revision/01-UIUX-CRUD.md` | — | Dibaca |

---

## 1. TEMUAN KRITIS (harus segera ditangani)

| # | Temuan | Lokasi |
|---|--------|--------|
| K1 | **`Business-Rules.md` tidak lengkap/terpotong.** Hanya 102 baris, berakhir mendadak di tengah aturan #13 (*"AI coding assistant tidak boleh mengubah business rule tan…"*). Tidak ada daftar business rule lengkap, tidak ada penutup/status dokumen. | `docs/11-Business-Rules.md` |
| K2 | **Header `File:` salah nama** — 6 dokumen menulis nama lama yang tidak cocok dengan file aktual (`docs/Database.md`, `docs/API.md`, `docs/UIUX.md`, `docs/Security.md`, `docs/Testing.md`, `docs/Changelog.md`). Berbahaya karena dipakai rujukan silang dokumen lain (lihat K3). | `docs/05`–`docs/10` |
| K3 | **Referensi silang ke nama dokumen lama.** `Security.md` (#114) merujuk `docs/Architecture.md`, `docs/Database.md`, `docs/API.md`; `Changelog.md` (#36) merujuk seluruh nama lama; `master-rules.md` (#85) merujuk `docs/Changelog.md`. Jika nama file diubah, rujukan ini patah. | `08-Security`, `10-Changelog`, `ai/master-rules` |

---

## 2. TEMUAN KONSISTENSI (nama/istilah berbeda antar dokumen)

| # | Perbedaan | Dokumen A | Dokumen B |
|---|-----------|-----------|-----------|
| C1 | **`process` vs `processing`** untuk status order | `ai/master-rules.md` #21 → `process` | `04-ERD`, `05-Database`, `06-API`, `README` → `processing` |
| C2 | **Login pakai username vs email** | `06-API.md` #17 body `{username, password}`; ERD `users.username` UQ | `README.md` contoh curl pakai `{"email":...}` |
| C3 | **Enum payment type** `DP/Final` vs `dp/final` vs `DP/Pelunasan` | `05-Database` #22 → `DP`/`Final` | `04-ERD` → `dp/final`; `06-API` → `dp\|final`; `02-SRS` → label Indonesia |
| C4 | **`customers.phone`** NOT NULL saja vs UNIQUE | `04-ERD` tabel #7 → NOT NULL; `05-Database` → index | `04-ERD` #45 → UNIQUE |
| C5 | **Nama entity lama vs final (26 tabel)** — `companies`/`settings`/`pricing_rules`/`discount_rules`/`price_histories`/`order_item_variants`/`production_stages`/`production_histories`/`activity_logs` **tidak ada** di ERD final; penggantinya `company_settings`/`application_settings`/`product_prices`/`order_item_sizes`/`production_orders`/`production_events`/`activities`. | `ai/project-context.md` #55, `ai/master-prompt.md` #10, `docs/10-Changelog` #17 | `docs/04-ERD.md`, `docs/05-Database.md` |
| C6 | **Status invoice `draft→issued→paid`** hanya muncul di README, tidak terdefinisi di ERD/Database/SRS. | `README.md` | — |
| C7 | **Status "Cancelled"** di sistem warna status SRS tidak ada di workflow order | `02-SRS` #22 | `02-SRS` #10/FR-019 |
| C8 | **Stage produksi berbeda-beda** (API `cutting/printing/sewing` vs master-prompt `Design→Approval→Production→QC→Packing→Shipping` vs SRS `Ready→Shipment`) | `06-API` #42 | `ai/master-prompt` #22, `02-SRS` |
| C9 | **`invoices.file_path`** VARCHAR(500) vs `string()` (255) | `04-ERD` | `05-Database` |

---

## 3. TEMUAN STRUKTUR/ISI DOKUMEN

- **`docs/01-PRD.md` (1688 baris)**: lengkap & rapi. Celah minor: #61 P0 memasukkan "Database" padahal infra bukan fitur; "Advanced Backup" vs "Backup" tanpa pembeda; **sumber data cost/profit tidak pernah didefinisikan**; "size limit" tanpa nilai.
- **`docs/02-SRS.md` (2575 baris)**: lengkap. **FR-048 REPORTING hanya stub 1 kalimat**; FR-020 Order Data tidak punya field Production Cost padahal profit memakainya; FR-006 repeat customer tanpa ambang jumlah order; bahasa status campur (Inggris/Indonesia).
- **`docs/03-Architecture.md` (2330 baris)**: lengkap. **ADR-008 kurang field Reason**; daftar domain tidak konsisten (17 vs 15 item, menghilangkan Authentication & Reminder); #72 menawarkan 2 pola struktur tanpa memilih satu.
- **`docs/04-ERD.md` (2127 baris)**: lengkap, 26 tabel. Node `settings` (induk company/application_settings) di diagram tidak ada sebagai tabel nyata; Mermaid `users` tidak menyertakan `avatar`/`remember_token`.
- **`docs/05-Database.md` (2958 baris)**: lengkap. Migrasi `current_revision_id` circular dipindah terpisah (baik).
- **`docs/06-API.md` (2514 baris)**: lengkap tapi banyak **pola endpoint campur aduk** — nested `/orders/{order}/shipments` vs top-level `/shipments/{id}`; invoice nested vs top-level; resource singular `.../review` & `company` melanggar aturan plural #16; prefix `/api/v1` kadang dihilangkan; tak ada `GET /orders/{order}/payments` (list); format invoice `INV-...` tidak didokumentasikan di file ini.
- **`docs/07-UIUX.md` (2971 baris)**: lengkap. **Section #38 & #47 duplikat judul "SHIPPING UX"**; PAGE STRUCTURE #117 tidak memuat halaman Payments/Invoices (modul inti); warna "Accent" (#16/#81) tidak ada di design tokens #112; skala spacing token tidak memetakan skala penuh #21.
- **`docs/08-Security.md` (2202 baris)**: lengkap & paling solid. Ukuran file & rate limit beberapa "disesuaikan" (belum final).
- **`docs/09-Testing.md` (2452 baris)**: lengkap. Framework test frontend tidak disebutkan; detail counter invoice `-000` (reset harian vs lanjut) tidak dijelaskan.
- **`docs/10-Changelog.md` (1180 baris)**: lengkap. **CURRENT PROJECT STATUS masih "Pre-Development / Foundation"** padahal kode sudah terimplementasi; RELEASE HISTORY & roadmap versi belum diisi.
- **`docs/11-Business-Rules.md`**: **KRITIS — terpotong** (lihat K1).
- **`README.md` root**: daftar modul tidak lengkap (tidak ada Production, Shipping, Reviews, Reports, Testimonial); menyatakan "SQLite (development)" **bertentangan** dengan `ai/master-rules.md`, `ai/coding-rules.md`, `docs/05`, `ai/project-context` yang menetapkan **MySQL/MariaDB via Laragon**; contoh login pakai email (lihat C2); status invoice `draft→issued→paid` (C6).
- **`backend/README.md` & `frontend/README.md`**: masih **template default** Vite/Laravel (belum disesuaikan FRNDLY).
- **`ai/master-rules.md` (2947)**, **`ai/master-prompt.md` (2368)**, **`ai/coding-rules.md` (3307)**, **`ai/project-context.md` (1592)**: lengkap & konsisten satu sama lain. Semua menetapkan MySQL/MariaDB + Laragon (bukan SQLite).

---

## 4. REKOMENDASI (urut prioritas)

1. **Lengkapi `docs/11-Business-Rules.md`** — perlu keputusan PO tentang isi business rules (atau gabungkan/rujuk ke SRS).
2. **Perbaiki header `File:`** di docs 05–10 dan **seluruh referensi silang** nama dokumen lama.
3. **Samakan enum**: `process` vs `processing`; payment type; login identifier (pilih username atau email); `customers.phone` UNIQUE atau tidak.
4. **Reconcile daftar entity lama** di `project-context`/`master-prompt`/`Changelog` terhadap 26 tabel ERD final (bisa diberi catatan "konseptual, final = ERD").
5. **Bereskan `06-API.md`**: pola endpoint nested vs top-level; hilangkan `company`/`review` singular; dokumentasikan format `INV-YYYYMMDD-000`.
6. **Update `README.md`**: lengkapi modul, ubah SQLite→MySQL/MariaDB, perbaiki contoh login.
7. **Isi detail yang belum lengkap**: FR-048 reporting, field production cost di SRS, ambang repeat customer, reset counter invoice.
8. **`07-UIUX.md`**: deduplikasi judul section, tambah halaman Payments/Invoices di page structure.
9. **Update `10-Changelog.md`**: status proyek & release history.
10. **Isi `backend/README.md` & `frontend/README.md`** sesuai proyek.
