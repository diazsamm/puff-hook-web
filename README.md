# Puff Hook

Website katalog dan custom order Puff Hook (crochet handmade) dengan panel admin. Pembeli dapat melihat produk dan memesan langsung lewat WhatsApp; admin mengelola produk dan pengaturan dari dashboard.

## Stack

- Next.js 16 (App Router, Cache Components) + TypeScript
- Tailwind CSS 4
- Supabase (Postgres, Auth, Storage)
- zod, lucide-react
- Vitest

## Menjalankan lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

Tanpa kredensial Supabase, website tetap bisa dibuka dengan katalog kosong. Panel admin akan menampilkan petunjuk konfigurasi.

## Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com) (free tier cukup).
2. Buka **SQL Editor**, jalankan `supabase/migrations/0001_init.sql`, lalu `supabase/migrations/0002_second_whatsapp.sql`.
3. Jalankan `supabase/seed.sql` untuk mengisi 6 produk contoh (opsional).
4. Buka **Project Settings → API**, salin:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Buka **Authentication → Users → Add user**, buat akun admin dengan email dan password. Ini satu-satunya akun yang bisa mengelola situs.
6. Pastikan bucket **products** ada dan bersifat public (dibuat oleh migration).

## Environment

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` dipakai untuk link produk di pesan WhatsApp dan metadata Open Graph. Di produksi isi dengan domain final, misalnya `https://puffhook.vercel.app`.

## Panel admin

- `/admin/login` — masuk dengan akun admin Supabase.
- `/admin` — ringkasan jumlah produk.
- `/admin/produk` — tambah, edit, hapus produk dan upload foto.
- `/admin/pengaturan` — nomor WhatsApp 1 & 2, Instagram, TikTok, dan teks badge di halaman depan.

Jika kedua nomor WhatsApp diisi, pembeli melihat dialog **Pilih admin** (Admin 1 / Admin 2) saat menekan tombol pesan. Jika hanya satu nomor diisi, tombol langsung membuka WhatsApp.

Foto produk diunggah ke Supabase Storage, otomatis dikompres ke WebP maksimal 1600px sebelum dikirim.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Import repo di [vercel.com/new](https://vercel.com/new).
3. Tambahkan environment variable yang sama seperti `.env.local`.
4. Deploy. Setelah domain aktif, perbarui `NEXT_PUBLIC_SITE_URL` dan redeploy.

## Perintah

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test
```

## Catatan

- Order tidak disimpan di database; semua pesanan berlanjut di WhatsApp.
- Nomor WhatsApp kosong akan menampilkan dialog, bukan tautan rusak.
- Testimoni, cerita pengrajin, dan FAQ saat ini statis di komponen `components/public/`.
