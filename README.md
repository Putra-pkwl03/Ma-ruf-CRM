
---

# PT. Smart CRM - ISP Management System(akses di: https://test-smart-crm.vercel.app )

PT. Smart CRM adalah aplikasi *Customer Relationship Management* yang dirancang khusus untuk membantu PT. Smart (Internet Service Provider) dalam mendigitalisasi proses bisnis mereka. Aplikasi ini mengelola siklus hidup pelanggan mulai dari calon customer (*leads*), manajemen produk layanan internet, hingga konversi menjadi *active customers* melalui pipeline proyek yang terintegrasi.

![Main Dashboard](image.png)

## Fitur Utama

Aplikasi ini dibangun dengan fitur-fitur wajib sesuai standar kebutuhan System Analyst:

*   **Autentikasi Robust:** Login menggunakan Supabase Auth (Session/JWT) yang diamankan melalui Next.js Middleware.
*   **Manajemen Leads:** Operasi CRUD untuk mengelola prospek calon pelanggan secara efisien.
*   **Master Produk:** Pengelolaan paket internet dengan kalkulasi otomatis Harga Jual berdasarkan HPP dan Margin.
*   **Deal Pipeline:** Proses konversi Leads menjadi Project dengan dukungan multi-produk dan negosiasi harga.
*   **Sistem Approval:** Validasi otomatis oleh Manager jika harga negosiasi berada di bawah harga jual standar (di bawah margin minimal).
*   **Reporting:** Laporan visual interaktif menggunakan Recharts dan fitur ekspor data ke Excel dengan filter periode waktu dinamis.
*   **Role-Based Access Control (RBAC):** 
    *   **Sales:** Hanya dapat melihat dan mengelola data miliknya sendiri untuk menjaga privasi antar agent.
    *   **Manager:** Akses penuh untuk melihat seluruh data sales, manajemen user, serta melakukan approval project.

## Tech Stack

*   **Framework:** Next.js 16+ (App Router)
*   **Bahasa:** TypeScript
*   **Database:** PostgreSQL (via Supabase)
*   **Styling:** Tailwind CSS & Shadcn UI
*   **Visualisasi:** Recharts
*   **Containerization:** Docker & Docker Compose

## Struktur Proyek

Aplikasi ini menggunakan struktur folder Next.js modern:
```text
├── app/                  # Route handlers & Pages (Auth, Dashboard, Leads, dll)
├── components/           # UI Components (Shared, Dashboard, UI)
├── lib/                  # Konfigurasi Supabase & Helper functions
├── public/               # Static assets (Images, Icons)
├── supabase/             # Seed.sql & Database migration files
├── middleware.ts         # Autentikasi & RBAC Logic
├── Dockerfile            # Production Docker configuration
└── docker-compose.yml    # Docker orchestration
```
![Project Structure](image_650c49.png)

## Cara Menjalankan Aplikasi

### 1. Prasyarat
*   Node.js 22+
*   Akun Supabase
*   Docker (Opsional, untuk containerization)

### 2. Setup Database (Supabase)
1.  Buat project baru di [Supabase Dashboard](https://app.supabase.com/).
2.  Buka bagian **SQL Editor**.
3.  Copy dan jalankan konten dari file `supabase/seed.sql` untuk membuat tabel, relasi, profil otomatis, dan data awal produk serta akun demo.

### 3. Konfigurasi Environment
Buat file `.env.local` di root folder dan masukkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Instalasi Manual
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### 5. Menjalankan via Docker
```bash
# Build dan jalankan kontainer
docker-compose up -d
```
Aplikasi akan berjalan pada port `3000`.

## 👤 Akun Demo (Berdasarkan seed.sql)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Manager** | `manager@ptsmart.id` | `password123` |
| **Sales** | `sales@ptsmart.id` | `password123` |

## Tampilan Aplikasi

### Halaman Leads
![Halaman Leads(manager)](image-1.png)

### Halaman Product
![Pipeline Projects(manager)](image-25.png)
![Tambah Product](image-4.png)
![Edit Product](image-5.png)
![Hapus Product](image-6.png)

### Halaman Projects Pipeline & Approval
![Pipeline Products(manager)](image-7.png)
![approve Deal](image-9.png)
![Rejected Deal](image-10.png)

### Customer Aktif
![Halaman Customer(manager)](image-11.png)
![detail](image-31.png)

### Reporting 
![Laporan(manager)](image-13.png)
![alt text](image-14.png)
![File Excel hasil export](image-16.png) akses file asli di dalam project(Laporan_ISP_Eksklusif_2026-05-04)

### Mengelola Pengguna 
![Mengelola pengguna(manager)](image-17.png)
![Form tambah pengguna](image-18.png)
![Form Edit Pengguna](image-19.png)


### Halaman Leads 
![Halaman Leads(Sales)](image-20.png)
![Form Tambah Lead](image-21.png)
![Edit data Lead](image-22.png)
![Hapus Lead](image-23.png)

### Halaman Product
![Halaman Product(sales)](image-24.png)

### Halaman Projects
![Halaman Project(sales)](image-26.png)
![Form costumer negosiasi](image-27.png)

### Customer Aktif
![Castemer aktif(sales)](image-28.png)
![alt text](image-29.png)

### Reporting 
![Laporan(sales)](image-30.png)
---
**Dibuat oleh:** Ma'ruf Hariam (Putra Pongkowulu)
**Link Repository:** [https://github.com/Putra-pkwl03/maruf_crm](https://github.com/Putra-pkwl03/maruf_crm)
**Status Deployment:** Live on Vercel