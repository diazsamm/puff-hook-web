# Spec: Website Puff Hook

Tanggal: 2026-11-05
Status: menunggu review

## 1. Tujuan

Website publik untuk brand crochet **Puff Hook** yang bisa diakses calon pembeli, berisi katalog produk dan alur custom order yang berujung ke WhatsApp, plus panel admin untuk mengelola produk dan pengaturan situs tanpa mengubah kode.

## 2. Scope

**Termasuk**
- Landing page publik sesuai referensi Stitch (`design-reference/stitch_puff_hook_crochet_website/`).
- Halaman detail produk.
- Panel admin: login, CRUD produk, upload foto, pengaturan situs.
- Katalog dan pengaturan dibaca dari database (Supabase), bukan hardcode.
- Simulator puff stitch, kalkulator custom order, testimoni, FAQ.
- SEO dasar (metadata, Open Graph, sitemap).

**Tidak termasuk (v1)**
- Pembayaran online / checkout.
- Penyimpanan order (order tetap lewat WhatsApp).
- Multi-admin / role management.
- Manajemen testimoni & teks cerita dari admin (statis di kode).
- Notifikasi email.

## 3. Arsitektur & Stack

- **Next.js (App Router) + TypeScript**, satu aplikasi untuk publik dan `/admin`.
- **Tailwind CSS** dengan design token dari `DESIGN.md`.
- **Supabase**: Postgres (data), Auth email/password (admin), Storage (foto produk).
- **zod** untuk validasi form dan Server Action.
- **Vitest** untuk unit test helper.
- **Deploy**: Vercel (free tier) + Supabase (free tier).

Data publik diambil di Server Component dengan cache tag `products`/`settings`; setiap mutasi admin memanggil `revalidateTag` sehingga halaman publik langsung ter-update.

Struktur direktori:

```
app/
  (public)/page.tsx            landing
  (public)/produk/[slug]/      detail produk
  admin/login/                 login
  admin/                       dashboard (protected)
  admin/produk/                list, baru, [id]/edit
  admin/pengaturan/
  api/                         hanya jika diperlukan
components/
  public/                      hero, simulator, catalog, custom-calculator, testimonial, faq, footer
  admin/                       product-form, image-uploader, sidebar
  ui/                          button, input, badge, card, modal
lib/
  supabase/                    client, server, admin
  custom-order.ts              konfigurasi kalkulator
  whatsapp.ts                  pembuat link wa.me
  format.ts                    formatRupiah, slugify
supabase/
  migrations/0001_init.sql
  seed.sql
public/
  logo.svg, seed/*.jpg
```

## 4. Design System

Diambil dari `DESIGN.md`:

- Font: **Playfair Display** (display/headline), **Plus Jakarta Sans** (body/label) via `next/font/google`.
- Warna: `surface #FFF8F7`, `surface-container-lowest #FFFFFF`, `primary #B10E6B`, `pink #EC4899`, `secondary #A43073`, `on-surface #251818`, `on-surface-variant #574048`, `outline-variant #DEBEC8`, `secondary-fixed #FFD8E7`.
- Radius: kartu 1.5–2.5rem, chip/tombol full pill, input 0.75rem.
- Shadow: rose lembut (`0 12px 32px -4px rgba(177,14,107,.08)`), hover lift `-3px`.
- Ikon: `lucide-react` (pengganti Material Symbols agar payload ringan; bentuk dan makna sama).
- Logo: SVG dari referensi disimpan sebagai `public/logo.svg` + komponen `Logo`.
- Animasi yarn ball/hook dari referensi dijadikan komponen `YarnAnimation`.

## 5. Halaman Publik

Landing page (satu halaman, anchor):

| Urutan | Bagian | Catatan |
|---|---|---|
| 1 | Header | logo, nav anchor, tombol WhatsApp, menu mobile |
| 2 | Hero | headline + 2 CTA + 3 badge nilai + gambar utama + badge jumlah pesanan |
| 3 | Simulator Puff Stitch | client component: pilih 4 warna benang, tombol "Hook" menambah simpul, tombol reset |
| 4 | Cerita Pengrajin | teks + statistik (3+, 150+, 99.4%) + 4 kartu pilar kualitas (statis) |
| 5 | Katalog | grid produk unggulan/terbit dari DB, filter kategori client-side (Semua, Amigurumi, Bunga, Tas & Pouch, Aksesoris) |
| 6 | Custom Order | kalkulator: jenis, tema warna, add-on, catatan → estimasi harga + kirim ke WhatsApp |
| 7 | Testimoni | carousel 3 kartu (statis) |
| 8 | FAQ | 3 accordion (statis) |
| 9 | CTA penutup | tombol WhatsApp + link katalog |
| 10 | Footer | logo, tagline, badge, link Instagram/TikTok/WhatsApp, copyright |

**Detail produk** `/produk/[slug]`: galeri foto, kategori, harga, hook size, deskripsi, tombol "Pesan via WhatsApp" (pesan otomatis berisi nama + URL produk), grid produk lain.

**Nomor WhatsApp** diambil dari `site_settings`. Jika kosong, tombol tetap tampil tetapi menampilkan dialog "Nomor WhatsApp belum diatur" agar tidak error.

## 6. Data Model

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('amigurumi','flower','bag','acc')),
  eyebrow text,
  badge text,
  badge_tone text not null default 'neutral' check (badge_tone in ('primary','neutral')),
  hook_size text,
  price integer not null check (price >= 0),
  short_description text,
  description text,
  images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table site_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_number text not null default '',
  instagram_url text not null default '',
  tiktok_url text not null default '',
  hero_badge text not null default '100% Handmade with Love & Fluffy Yarn',
  orders_badge text not null default '4.800+ Pesanan Rajutan Terkirim',
  updated_at timestamptz not null default now()
);
```

**RLS**
- `products`: `select` untuk `anon` hanya `published = true`; `all` untuk `authenticated`.
- `site_settings`: `select` untuk `anon`; `update` untuk `authenticated`.
- Storage bucket `products`: publik untuk baca, `authenticated` untuk insert/update/delete.

**Storage key** foto: `products/{productId}/{timestamp}-{nama-file}.webp`.

## 7. Alur Order WhatsApp

- Format nomor: digit saja, diawali `62` (divalidasi saat simpan pengaturan).
- Link: `https://wa.me/{nomor}?text={pesan}`.
- Produk: `Halo Puff Hook! Saya tertarik dengan {nama produk} ({harga}). {url produk}`.
- Custom: ringkasan jenis, tema warna, add-on, catatan, dan estimasi harga.

Pesan dibuat oleh satu helper `buildWhatsAppUrl(nomor, pesan)` agar konsisten dan mudah diuji.

## 8. Admin

- **Auth**: Supabase Auth email/password. Satu akun admin dibuat manual di Supabase Dashboard. `/admin/*` dilindungi middleware + pengecekan session di layout server; user yang belum login diarahkan ke `/admin/login`.
- **Dashboard**: jumlah produk terbit/draf, produk unggulan, tombol tambah produk.
- **Produk**: tabel (foto, nama, kategori, harga, status, unggulan) + aksi edit/hapus dengan konfirmasi.
- **Form produk**: nama, slug (otomatis dari nama, bisa diedit), kategori, eyebrow, badge + tone, hook size, harga, deskripsi singkat, deskripsi lengkap, unggulan, terbit, urutan; upload beberapa foto dengan preview, hapus, dan urutkan.
- **Upload foto**: validasi tipe (jpg/png/webp), maks 5MB, di-resize di browser ke maks 1600px dan dikonversi ke WebP sebelum diunggah.
- **Pengaturan**: nomor WhatsApp, Instagram, TikTok, badge hero, badge jumlah pesanan.
- **Mutasi** lewat Server Action: validasi zod → simpan DB → `revalidateTag` → `redirect`/toast.
- Pesan error ditampilkan inline per field; error server ditampilkan sebagai banner.

## 9. Error & Edge Case

- Produk tidak ditemukan / tidak terbit → halaman 404.
- Tidak ada produk terbit → katalog menampilkan empty state "Belum ada produk".
- Nomor WhatsApp kosong → dialog informatif, bukan link rusak.
- Gagal upload foto → foto lain tetap tersimpan, error ditampilkan.
- Hapus produk → hapus row dan file di Storage; jika hapus file gagal, produk tetap terhapus dan error dicatat.
- Slug duplikat → otomatis diberi suffix `-2`, `-3`.
- Session admin kedaluwarsa → redirect ke login dengan pesan.

## 10. Testing & Quality Gate

- Unit test (Vitest): `slugify`, `formatRupiah`, `buildWhatsAppUrl`, `calcCustomPrice`.
- Sebelum selesai: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` harus lulus.
- Smoke manual: landing tampil, filter katalog, simulator, kalkulator, login, tambah/edit/hapus produk, simpan pengaturan.

## 11. Deployment

- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Supabase: jalankan `supabase/migrations/0001_init.sql`, buat bucket `products`, buat akun admin.
- Vercel: import repo, set env, deploy.
- `README.md` berisi langkah setup Supabase + pembuatan akun admin + deploy.

## 12. Seed

6 produk dari referensi (Blushing Bunny, Puff Blossom Bouquet, Cloudy Marshmallow Tote, Strawberry Charm, Bear Coaster, Pastel Cardigan) dengan gambar contoh diunduh ke `public/seed/` dan dimasukkan lewat `seed.sql`. Foto bisa diganti dari admin.
