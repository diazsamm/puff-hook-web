# Puff Hook Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun website publik Puff Hook (katalog + custom order via WhatsApp) dengan panel admin berbasis Next.js dan Supabase.

**Architecture:** Satu aplikasi Next.js App Router. Halaman publik adalah Server Component yang membaca data lewat cache tag `products`/`settings`; panel admin memakai Supabase Auth dan Server Action untuk mutasi, lalu memanggil `revalidateTag` agar halaman publik ter-update. Foto produk diunggah dari browser langsung ke Supabase Storage setelah dikompresi ke WebP.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (Postgres/Auth/Storage), zod, lucide-react, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-05-website-puff-hooks-design.md`

## Global Constraints

- Bahasa UI: Indonesia. Nama brand: **Puff Hook**.
- Nomor WhatsApp disimpan tanpa `+`, diawali `62`; jika kosong tampilkan dialog, jangan membuat link rusak.
- Warna/typography mengikuti `design-reference/.../puff_hook_cozy_craft/DESIGN.md`.
- Tanpa komentar kode kecuali diperlukan.
- Quality gate sebelum selesai: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.
- Tidak ada commit otomatis; setiap task berakhir dengan checkpoint verifikasi.
- Jangan menaruh service role key di aplikasi.

---

### Task 1: Scaffold proyek dan design token

**Files:**
- Create: seluruh scaffold Next.js di `E:\PROJECT\Web PuffHooks`
- Create: `app/globals.css`, `app/layout.tsx`, `lib/fonts.ts`, `.env.example`
- Create: `vitest.config.ts`, `tests/setup.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: class Tailwind `bg-surface`, `text-on-surface`, `bg-primary`, `text-on-primary`, `bg-surface-container-lowest`, `font-display`, `font-body`; scripts `lint`, `typecheck`, `test`, `build`.

- [ ] **Step 1: Scaffold**

```powershell
cd "E:\PROJECT\Web PuffHooks"
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --yes
```

- [ ] **Step 2: Tambah dependensi**

```powershell
npm install @supabase/supabase-js @supabase/ssr zod lucide-react
npm install -D vitest @vitejs/plugin-react
```

- [ ] **Step 3: Set scripts di `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

- [ ] **Step 5: `lib/fonts.ts`**

```ts
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});
```

- [ ] **Step 6: `app/globals.css`** — ganti isi dengan token berikut

```css
@import "tailwindcss";

@theme {
  --color-surface: #fff8f7;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #fff0f0;
  --color-surface-container: #ffe9e8;
  --color-surface-container-high: #fce2e2;
  --color-on-surface: #251818;
  --color-on-surface-variant: #574048;
  --color-primary: #b10e6b;
  --color-on-primary: #ffffff;
  --color-primary-container: #d23284;
  --color-secondary: #a43073;
  --color-on-secondary: #ffffff;
  --color-secondary-fixed: #ffd8e7;
  --color-tertiary: #b40b56;
  --color-outline-variant: #debec8;
  --color-error: #ba1a1a;
  --font-display: var(--font-playfair), serif;
  --font-body: var(--font-jakarta), sans-serif;
  --shadow-pillow: 0 12px 32px -4px rgba(177, 14, 107, 0.08), 0 2px 6px rgba(120, 101, 101, 0.04);
  --shadow-lift: 0 18px 36px -4px rgba(236, 72, 153, 0.16);
  --animate-float: float 4.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
}

body {
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  font-family: var(--font-body);
  overscroll-behavior: none;
}

::selection { background: var(--color-secondary-fixed); color: #76014e; }
```

- [ ] **Step 7: `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { playfair, jakarta } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Puff Hook — Rajutan Handmade & Custom Order",
  description:
    "Puff Hook menghadirkan amigurumi, buket bunga, tas, dan aksesoris crochet handmade dengan benang milk cotton lembut. Terima custom order.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: `.env.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 9: Checkpoint**

```powershell
npm run lint; npm run typecheck; npm run build
```

Expected: semua lulus, halaman default tampil.

---

### Task 2: Helper murni + unit test

**Files:**
- Create: `lib/format.ts`, `lib/whatsapp.ts`, `lib/custom-order.ts`
- Test: `tests/format.test.ts`, `tests/whatsapp.test.ts`, `tests/custom-order.test.ts`

**Interfaces:**
- Produces:
  - `formatRupiah(value: number): string`
  - `slugify(value: string): string`
  - `normalizePhone(value: string): string`
  - `buildWhatsAppUrl(phone: string, message: string): string | null`
  - `customOrderTypes: { id: string; label: string; price: number }[]`
  - `customOrderColorSchemes: string[]`
  - `customOrderAddons: { id: string; label: string; price: number }[]`
  - `calcCustomPrice(input: { typeId: string; addonIds: string[] }): number`

- [ ] **Step 1: Tulis test yang gagal**

`tests/format.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { formatRupiah, slugify } from "@/lib/format";

describe("formatRupiah", () => {
  it("formats rupiah without decimals", () => {
    expect(formatRupiah(145000)).toBe("Rp 145.000");
  });
});

describe("slugify", () => {
  it("lowercases and joins words", () => {
    expect(slugify("Blushing Bunny Amigurumi")).toBe("blushing-bunny-amigurumi");
  });
  it("strips punctuation and trims dashes", () => {
    expect(slugify("  Puff Flower & Bouquet!  ")).toBe("puff-flower-bouquet");
  });
  it("falls back for empty input", () => {
    expect(slugify("***")).toBe("produk");
  });
});
```

`tests/whatsapp.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, normalizePhone } from "@/lib/whatsapp";

describe("normalizePhone", () => {
  it("converts local 08 to 628", () => {
    expect(normalizePhone("0812-3456-7890")).toBe("6281234567890");
  });
  it("keeps 62 prefix", () => {
    expect(normalizePhone("+62 812 3456 7890")).toBe("6281234567890");
  });
});

describe("buildWhatsAppUrl", () => {
  it("encodes the message", () => {
    expect(buildWhatsAppUrl("081234567890", "Halo Puff Hook!")).toBe(
      "https://wa.me/6281234567890?text=Halo%20Puff%20Hook!"
    );
  });
  it("returns null when the number is too short", () => {
    expect(buildWhatsAppUrl("123", "Halo")).toBeNull();
  });
});
```

`tests/custom-order.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { calcCustomPrice, customOrderTypes, customOrderAddons } from "@/lib/custom-order";

describe("calcCustomPrice", () => {
  it("returns base price without addons", () => {
    expect(calcCustomPrice({ typeId: "amigurumi-mini", addonIds: [] })).toBe(120000);
  });
  it("adds selected addons", () => {
    expect(calcCustomPrice({ typeId: "bouquet", addonIds: ["gift-box", "initial"] })).toBe(
      175000 + 15000 + 10000
    );
  });
  it("ignores unknown ids", () => {
    expect(calcCustomPrice({ typeId: "unknown", addonIds: ["unknown"] })).toBe(0);
  });
  it("exposes typed config", () => {
    expect(customOrderTypes[0].id).toBe("amigurumi-mini");
    expect(customOrderAddons.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm run test`
Expected: FAIL karena modul belum ada.

- [ ] **Step 3: Implementasi `lib/format.ts`**

```ts
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ");
}

export function slugify(value: string): string {
  const result = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return result || "produk";
}
```

- [ ] **Step 4: Implementasi `lib/whatsapp.ts`**

```ts
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const normalized = normalizePhone(phone);
  if (normalized.length < 10) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 5: Implementasi `lib/custom-order.ts`**

```ts
export const customOrderTypes = [
  { id: "amigurumi-mini", label: "Amigurumi Mini (~10cm)", price: 120000 },
  { id: "amigurumi-medium", label: "Amigurumi Sedang (~18cm)", price: 180000 },
  { id: "bouquet", label: "Buket Bunga Lengkap", price: 175000 },
  { id: "bag", label: "Tas / Pouch Custom", price: 220000 },
  { id: "cardigan", label: "Cardigan Rajut", price: 390000 },
] as const;

export const customOrderColorSchemes = [
  "Sakura Pastel (Pink & Cream)",
  "Berry Shortcake (Dusty Pink)",
  "Matcha Latte (Sage Green)",
  "Baby Blue Sky (Blue & White)",
  "Custom Bebas",
] as const;

export const customOrderAddons = [
  { id: "gift-box", label: "Gift Box & Pita", price: 15000 },
  { id: "initial", label: "Inisial Huruf", price: 10000 },
  { id: "greeting-card", label: "Kartu Ucapan", price: 5000 },
] as const;

export function calcCustomPrice(input: { typeId: string; addonIds: string[] }): number {
  const type = customOrderTypes.find((item) => item.id === input.typeId);
  if (!type) return 0;
  const addonTotal = input.addonIds.reduce((total, id) => {
    const addon = customOrderAddons.find((item) => item.id === id);
    return total + (addon?.price ?? 0);
  }, 0);
  return type.price + addonTotal;
}
```

- [ ] **Step 6: Jalankan test**

Run: `npm run test`
Expected: PASS semua.

---

### Task 3: Database, tipe, dan client Supabase

**Files:**
- Create: `supabase/migrations/0001_init.sql`, `supabase/seed.sql`
- Create: `lib/types.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/data.ts`
- Create: `public/seed/` (6 foto produk)

**Interfaces:**
- Produces:
  - `Product` = `{ id, slug, name, category, eyebrow, badge, badge_tone, hook_size, price, short_description, description, images, featured, published, sort_order, created_at, updated_at }`
  - `SiteSettings` = `{ id, whatsapp_number, instagram_url, tiktok_url, hero_badge, orders_badge, updated_at }`
  - `getPublishedProducts(): Promise<Product[]>`
  - `getProductBySlug(slug: string): Promise<Product | null>`
  - `getSettings(): Promise<SiteSettings>`
  - `createBrowserSupabase()`, `createServerSupabase()`

- [ ] **Step 1: Migration `supabase/migrations/0001_init.sql`**

```sql
create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists products (
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

create trigger products_updated_at
before update on products
for each row execute function set_updated_at();

create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  whatsapp_number text not null default '',
  instagram_url text not null default '',
  tiktok_url text not null default '',
  hero_badge text not null default '100% Handmade with Love & Fluffy Yarn',
  orders_badge text not null default '4.800+ Pesanan Rajutan Terkirim',
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at
before update on site_settings
for each row execute function set_updated_at();

alter table products enable row level security;
alter table site_settings enable row level security;

create policy "public read published products" on products
  for select using (published = true);

create policy "admin manage products" on products
  for all to authenticated using (true) with check (true);

create policy "public read site settings" on site_settings
  for select using (true);

create policy "admin update site settings" on site_settings
  for update to authenticated using (true) with check (true);

insert into site_settings (id) values (1) on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'products');

create policy "admin insert product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'products');

create policy "admin update product images" on storage.objects
  for update to authenticated using (bucket_id = 'products');

create policy "admin delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'products');
```

- [ ] **Step 2: `lib/types.ts`**

```ts
export type ProductCategory = "amigurumi" | "flower" | "bag" | "acc";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  eyebrow: string | null;
  badge: string | null;
  badge_tone: "primary" | "neutral";
  hook_size: string | null;
  price: number;
  short_description: string | null;
  description: string | null;
  images: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  whatsapp_number: string;
  instagram_url: string;
  tiktok_url: string;
  hero_badge: string;
  orders_badge: string;
  updated_at: string;
};
```

- [ ] **Step 3: Client Supabase**

`lib/supabase/client.ts`

```ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

`lib/supabase/server.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (items) => {
          try {
            items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );
}
```

- [ ] **Step 4: `lib/data.ts`**

```ts
import { unstable_cache } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Product, SiteSettings } from "@/lib/types";

const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  whatsapp_number: "",
  instagram_url: "",
  tiktok_url: "",
  hero_badge: "100% Handmade with Love & Fluffy Yarn",
  orders_badge: "4.800+ Pesanan Rajutan Terkirim",
  updated_at: new Date(0).toISOString(),
};

export const getPublishedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Product[];
  },
  ["published-products"],
  { tags: ["products"] }
);

export const getProductBySlug = (slug: string) =>
  unstable_cache(
    async (): Promise<Product | null> => {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as Product | null) ?? null;
    },
    ["product", slug],
    { tags: ["products"] }
  )();

export const getSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return (data as SiteSettings | null) ?? FALLBACK_SETTINGS;
  },
  ["site-settings"],
  { tags: ["settings"] }
);
```

- [ ] **Step 5: Seed**

Unduh 6 gambar referensi ke `public/seed/` dengan nama `bunny.jpg`, `bouquet.jpg`, `tote.jpg`, `strawberry.jpg`, `coaster.jpg`, `cardigan.jpg`. Jika unduhan gagal, buat SVG placeholder bernuansa pink di path yang sama dengan ekstensi `.svg` dan sesuaikan `seed.sql`.

`supabase/seed.sql`:

```sql
insert into products (slug, name, category, eyebrow, badge, badge_tone, hook_size, price, short_description, description, images, featured, sort_order)
values
('blushing-bunny-amigurumi','Blushing Bunny Amigurumi','amigurumi','Amigurumi Premium','Best Seller','primary','4.0mm Hook',145000,'Boneka kelinci empuk berbahan chenille chunky dengan aksen pipi blush dan pita satin.','Dirajut satu per satu dengan teknik puff stitch padat. Tinggi sekitar 18 cm, cocok untuk hadiah dan koleksi.',array['/seed/bunny.jpg'],true,1),
('puff-blossom-bouquet','Puff Blossom Flower Bouquet','flower','Bouquet Gift','Bunga Abadi','neutral','3.0mm Hook',175000,'Buket bunga rajutan 7 tangkai kombinasi mawar puff, daisy, dan lavender.','Cantik abadi tanpa layu. Dikirim dengan wrapping frosted dan pita.',array['/seed/bouquet.jpg'],true,2),
('cloudy-marshmallow-tote','Cloudy Marshmallow Tote Bag','bag','Tas & Jinjing','Favorit Hangout','neutral','6.0mm Hook',220000,'Tas rajut puff tebal, muat tablet dan dompet, dengan furing satin dan kancing magnet.','Tekstur puff stitch yang montok dengan dual-tone pastel.',array['/seed/tote.jpg'],true,3),
('strawberry-charm','Strawberry Charm','acc','Aksesoris','Charm','neutral','2.5mm Hook',35000,'Gantungan kunci stroberi mini dari benang milk cotton.','Ukuran sekitar 6 cm, bisa dipasang di tas atau kunci.',array['/seed/strawberry.jpg'],false,4),
('bear-coaster','Bear Coaster (4pcs)','acc','Aksesoris','Isi 4','neutral','3.5mm Hook',65000,'Set 4 coaster berbentuk beruang dengan tekstur rajut rapat.','Diameter 12 cm per coaster, menyerap panas dengan baik.',array['/seed/coaster.jpg'],false,5),
('pastel-cardigan','Pastel Cardigan','acc','Rajutan Apparel','Limited','primary','5.0mm Hook',380000,'Cardigan granny square pastel dengan potongan longgar.','Dirajut tangan dengan benang cotton, tersedia dalam ukuran all size.',array['/seed/cardigan.jpg'],false,6)
on conflict (slug) do nothing;
```

- [ ] **Step 6: Checkpoint**

Run: `npm run typecheck`
Expected: PASS. Migration belum dijalankan (butuh kredensial), dicatat di README Task 12.

---

### Task 4: UI primitive dan logo

**Files:**
- Create: `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/select.tsx`
- Create: `components/logo.tsx`
- Create: `public/logo.svg` (hasil decode base64 dari `design-reference/.../puff_hook_crochet_logo/code.html`)

**Interfaces:**
- Produces:
  - `<Button variant="primary" | "secondary" | "ghost" size="sm" | "md" />`
  - `<Badge tone="primary" | "neutral" />`
  - Input/Textarea/Select meneruskan props native dan class `Field` yang sama.
  - `<Logo className? />`

- [ ] **Step 1: `components/ui/button.tsx`**

```tsx
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-[0_12px_28px_-4px_rgba(177,14,107,0.28)] hover:bg-[#8c0053] hover:-translate-y-0.5",
  secondary:
    "bg-surface-container-lowest text-primary border-[1.5px] border-[#F472B6] hover:bg-secondary-fixed hover:-translate-y-0.5",
  ghost: "text-primary hover:bg-secondary-fixed/60",
};
const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3.5 text-sm",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className = "") {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
```

- [ ] **Step 2: `components/ui/badge.tsx`**

```tsx
import type { ComponentProps } from "react";

export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: ComponentProps<"span"> & { tone?: "primary" | "neutral" }) {
  const tones = {
    primary: "bg-primary text-on-primary",
    neutral: "bg-surface-container-high text-primary",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
```

- [ ] **Step 3: Field components**

Input/Textarea/Select memakai class berikut:

```
w-full rounded-xl bg-surface-container-low px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/70 outline-none border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition
```

- [ ] **Step 4: `public/logo.svg`**

Decode base64 di `design-reference/.../puff_hook_crochet_logo/code.html`:

```powershell
$b64 = (Get-Content "design-reference\stitch_puff_hook_crochet_website\puff_hook_crochet_logo\code.html" -Raw).Trim()
[IO.File]::WriteAllBytes("public\logo.svg", [Convert]::FromBase64String($b64))
```

- [ ] **Step 5: `components/logo.tsx`**

```tsx
import Image from "next/image";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return <Image src="/logo.svg" alt="Puff Hook" width={72} height={72} className={className} priority />;
}
```

- [ ] **Step 6: Checkpoint**

Run: `npm run typecheck; npm run build`
Expected: PASS.

---

### Task 5: Header, footer, dan shell publik

**Files:**
- Create: `components/public/site-header.tsx`, `components/public/site-footer.tsx`, `components/public/whatsapp-link.tsx`
- Create: `app/(public)/layout.tsx`
- Modify: `app/layout.tsx` (hapus konten default, biarkan root)
- Move: `app/page.tsx` → `app/(public)/page.tsx`

**Interfaces:**
- Consumes: `getSettings()`, `Logo`, `ButtonLink`, `buildWhatsAppUrl`.
- Produces: `SiteHeader({ settings })`, `SiteFooter({ settings })`, `<WhatsAppLink phone message className children />`.

- [ ] **Step 1: `WhatsAppLink`** — jika `buildWhatsAppUrl` mengembalikan `null`, render `<button>` yang membuka `alert("Nomor WhatsApp belum diatur oleh admin.")`; selain itu render `<a target="_blank" rel="noopener noreferrer">`.

- [ ] **Step 2: Header**

Sticky, `bg-surface/85 backdrop-blur-xl`, logo + wordmark "Puff Hook / Artisan Crochet", nav anchor (`#koleksi-produk`, `#tentang-kami`, `#custom-order`, `#faq`), tombol WhatsApp, tombol menu mobile yang membuka panel berisi nav + CTA.

- [ ] **Step 3: Footer**

Logo, tagline, dua badge, link Instagram (`settings.instagram_url`), TikTok (fallback `#`), WhatsApp, copyright tahun berjalan.

- [ ] **Step 4: `app/(public)/layout.tsx`**

```tsx
import { getSettings } from "@/lib/data";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="pt-14">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
```

- [ ] **Step 5: Checkpoint**

Run: `npm run build`
Expected: PASS, header/footer tampil di `/`.

---

### Task 6: Hero + animasi yarn

**Files:**
- Create: `components/public/hero.tsx`, `components/public/yarn-animation.tsx`
- Modify: `app/(public)/page.tsx`

**Interfaces:**
- Consumes: `SiteSettings`, `Product[]`.
- Produces: `<Hero settings={settings} />`.

- [ ] **Step 1: `yarn-animation.tsx`**

Pindahkan seluruh `<svg>` dari `design-reference/.../animated_svg/code.html` menjadi komponen client. Ganti `viewbox` → `viewBox`, `lineargradient` → `linearGradient`, `fedropshadow` → `feDropShadow`. Simpan keyframes di `<style>` dalam komponen. `aria-hidden="true"`.

- [ ] **Step 2: `hero.tsx`**

Grid 12 kolom di desktop, satu kolom di mobile. Kiri: badge (`settings.hero_badge`), headline "Kehangatan Rajutan *Lembut* di Setiap Puff Stitch." (kata "Lembut" italic `text-primary`), paragraf, dua CTA (`#koleksi-produk`, `#custom-order`), tiga badge nilai. Kanan: badge `settings.orders_badge`, kartu gambar (gunakan `/seed/bunny.jpg`, `next/image`, `fill`, `priority`), panel animasi yarn, label "Live Crafting".

- [ ] **Step 3: Update `app/(public)/page.tsx`**

```tsx
import { getPublishedProducts, getSettings } from "@/lib/data";
import { Hero } from "@/components/public/hero";

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSettings(), getPublishedProducts()]);
  return (
    <>
      <Hero settings={settings} />
      {/* section berikut ditambahkan pada task selanjutnya */}
    </>
  );
}
```

- [ ] **Step 4: Checkpoint**

Run: `npm run build`
Expected: PASS; hero tampil responsif.

---

### Task 7: Simulator, katalog, testimoni, FAQ

**Files:**
- Create: `components/public/puff-simulator.tsx` (client)
- Create: `components/public/product-catalog.tsx` (client)
- Create: `components/public/product-card.tsx`
- Create: `components/public/testimonials.tsx`
- Create: `components/public/faq.tsx`
- Modify: `app/(public)/page.tsx`

**Interfaces:**
- Consumes: `Product[]`, `formatRupiah`, `ProductCategory`.
- Produces: `<PuffSimulator />`, `<ProductCatalog products={products} />`, `<Testimonials />`, `<Faq />`.

- [ ] **Step 1: Simulator**

State: `color` (default `{ hex: "#F472B6", name: "Blush Pink" }`), `stitches: { id: number; hex: string }[]`. Tombol warna: Blush Pink `#F472B6`, Cream Milk `#FDF4E3`, Baby Berry `#BE185D`, Vanilla Mist `#E8D5C4`. Tombol "Hook a Puff Stitch! (+1 Simpul)" menambah simpul; tombol reset mengosongkan. Tray horizontal menampilkan simpul sebagai `div` bulat berwarna dengan animasi `animate-bounce` satu kali.

- [ ] **Step 2: Katalog**

Filter chips: Semua, Amigurumi (`amigurumi`), Puff Flower & Buket (`flower`), Tas & Pouch (`bag`), Aksesoris (`acc`). Grid 1/2/3 kolom. Empty state "Belum ada produk di kategori ini."

`ProductCard`: gambar `aspect-square`, badge kiri atas (`badge`, tone), hook size kanan bawah, eyebrow, nama (link ke `/produk/[slug]`), deskripsi 2 baris (`line-clamp-2`), harga, tombol "Pesan WA" memakai `WhatsAppLink`.

- [ ] **Step 3: Testimoni dan FAQ**

Testimoni: 3 kartu dengan 5 bintang, quote, inisial, nama, kota. Scroll horizontal `snap-x` di mobile, grid 3 kolom di desktop. FAQ: 3 `<details>` dengan ikon chevron yang berotasi saat open, konten sesuai referensi.

- [ ] **Step 4: Susun halaman**

Urutan: `<Hero />`, section simulator (bg `surface-container-low/50`), section cerita + 4 pilar, `<ProductCatalog />` (`id="koleksi-produk"`), `<CustomOrderCalculator />` (Task 8), `<Testimonials />`, `<Faq />` (`id="faq"`), CTA penutup, lalu footer dari layout.

- [ ] **Step 5: Checkpoint**

Run: `npm run build; npm run typecheck`
Expected: PASS.

---

### Task 8: Kalkulator custom order

**Files:**
- Create: `components/public/custom-order-calculator.tsx` (client)
- Modify: `app/(public)/page.tsx`

**Interfaces:**
- Consumes: `customOrderTypes`, `customOrderColorSchemes`, `customOrderAddons`, `calcCustomPrice`, `formatRupiah`, `buildWhatsAppUrl`.

- [ ] **Step 1: Form**

State: `typeId` (default `amigurumi-medium`), `colorScheme` (default pertama), `addonIds: string[]`, `notes`. Hitung `total = calcCustomPrice(...)` setiap perubahan. Tampilkan 3 langkah proses (Konsultasi, Rajut 3–7 hari, QC & Gift Box).

- [ ] **Step 2: Kirim WhatsApp**

```ts
const message = [
  "Halo Puff Hook! Saya ingin custom order:",
  `- Jenis: ${typeLabel}`,
  `- Tema Warna: ${colorScheme}`,
  `- Tambahan: ${addonLabels.length ? addonLabels.join(", ") : "Tidak ada"}`,
  `- Catatan: ${notes.trim() || "Tidak ada catatan tambahan"}`,
  `- Estimasi: ${formatRupiah(total)}`,
].join("\n");
```

Tombol submit memakai `window.open(buildWhatsAppUrl(phone, message) ?? undefined, "_blank")`; jika null tampilkan dialog nomor belum diatur.

- [ ] **Step 3: Checkpoint**

Run: `npm run build`
Expected: PASS; estimasi berubah saat opsi diganti.

---

### Task 9: Halaman detail produk

**Files:**
- Create: `app/(public)/produk/[slug]/page.tsx`
- Create: `components/public/product-gallery.tsx` (client)

**Interfaces:**
- Consumes: `getProductBySlug`, `getPublishedProducts`, `formatRupiah`, `WhatsAppLink`.

- [ ] **Step 1: Page**

`generateMetadata` mengembalikan title/description produk + `openGraph.images` dari `images[0]`. `notFound()` jika tidak ada. Layout 2 kolom: galeri (gambar utama + thumbnail) dan info (eyebrow, nama, harga, badge, hook size, deskripsi, CTA WhatsApp, info pengiriman). Di bawahnya grid "Produk lain" (maks 3, exclude slug saat ini).

- [ ] **Step 2: Gallery**

State `activeIndex`; gambar utama `next/image` dengan `aspect-square`, thumbnail 4 kolom.

- [ ] **Step 3: Checkpoint**

Run: `npm run build; npm run typecheck`
Expected: PASS.

---

### Task 10: Auth admin, middleware, login

**Files:**
- Create: `app/admin/layout.tsx`, `app/admin/login/page.tsx`, `app/admin/login/login-form.tsx` (client)
- Create: `lib/supabase/middleware.ts`, `middleware.ts`
- Create: `app/admin/page.tsx`

**Interfaces:**
- Produces: `updateSession(request): Promise<NextResponse>`; route `/admin/login` publik, route `/admin/*` lain butuh session.

- [ ] **Step 1: Middleware**

`lib/supabase/middleware.ts` membuat `createServerClient` dengan request/response cookies, memanggil `supabase.auth.getUser()`. Jika path diawali `/admin` selain `/admin/login` dan tidak ada user, redirect ke `/admin/login?next=<path>`. Jika sudah login dan membuka `/admin/login`, redirect ke `/admin`.

- [ ] **Step 2: Login form**

Email + password, memanggil `supabase.auth.signInWithPassword` lewat browser client, lalu `router.replace(next ?? "/admin"); router.refresh()`. Error ditampilkan inline.

- [ ] **Step 3: Admin layout**

Sidebar (Dashboard, Produk, Pengaturan, "Lihat situs") + tombol keluar (`supabase.auth.signOut()`), memeriksa `getUser()` di server dan `redirect("/admin/login")` jika kosong.

- [ ] **Step 4: Dashboard**

Hitung produk terbit, draf, unggulan dari Supabase; tampilkan tiga kartu statistik dan tombol "Tambah produk".

- [ ] **Step 5: Checkpoint**

Run: `npm run build`
Expected: PASS; `/admin` tanpa login redirect ke `/admin/login`.

---

### Task 11: CRUD produk + upload foto

**Files:**
- Create: `app/admin/produk/page.tsx`, `app/admin/produk/baru/page.tsx`, `app/admin/produk/[id]/page.tsx`
- Create: `app/admin/produk/actions.ts`, `app/admin/produk/product-form.tsx` (client)
- Create: `components/admin/image-uploader.tsx` (client)
- Create: `lib/image.ts`

**Interfaces:**
- Produces:
  - `saveProduct(input: ProductInput): Promise<{ error?: string }>`
  - `deleteProduct(id: string): Promise<{ error?: string }>`
  - `compressImage(file: File): Promise<Blob>`
  - `<ProductForm product?: Product />`, `<ImageUploader value={string[]} onChange={...} />`

- [ ] **Step 1: `compressImage`**

```ts
export async function compressImage(file: File, maxEdge = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality)
  );
  if (!blob) throw new Error("Gagal mengompresi gambar");
  return blob;
}
```

- [ ] **Step 2: ImageUploader**

Validasi `file.type` di `["image/jpeg","image/png","image/webp"]` dan `file.size <= 5 * 1024 * 1024`. Upload ke `products/${crypto.randomUUID()}/${Date.now()}.webp` dengan browser client. `getPublicUrl` → push ke array. Tampilkan grid preview + tombol hapus (juga menghapus object Storage bila URL milik bucket). Progress per file.

- [ ] **Step 3: Actions**

`saveProduct` memvalidasi zod:

```ts
const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(80),
  category: z.enum(["amigurumi", "flower", "bag", "acc"]),
  eyebrow: z.string().trim().max(80).optional(),
  badge: z.string().trim().max(40).optional(),
  badge_tone: z.enum(["primary", "neutral"]),
  hook_size: z.string().trim().max(40).optional(),
  price: z.coerce.number().int().min(0),
  short_description: z.string().trim().max(200).optional(),
  description: z.string().trim().max(4000).optional(),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
});
```

Slug duplikat → tambahkan `-2`, `-3`, dst. Setelah insert/update panggil `revalidateTag("products")` lalu `redirect("/admin/produk")`. `deleteProduct` menghapus object Storage dari `images` lalu row, lalu `revalidateTag("products")`.

- [ ] **Step 4: Form**

Field sesuai schema. Slug otomatis dari nama selama slug belum diedit manual. Upload foto memakai `ImageUploader`. Tombol simpan menampilkan state loading; error server tampil di banner atas.

- [ ] **Step 5: Daftar produk**

Tabel: thumbnail, nama, kategori, harga, status (badge terbit/draf), unggulan, aksi Edit/Hapus. Hapus memakai `confirm()`.

- [ ] **Step 6: Checkpoint**

Run: `npm run lint; npm run typecheck; npm run build`
Expected: PASS.

---

### Task 12: Pengaturan, README, dan quality gate akhir

**Files:**
- Create: `app/admin/pengaturan/page.tsx`, `app/admin/pengaturan/actions.ts`, `app/admin/pengaturan/settings-form.tsx`
- Create: `README.md`
- Modify: `.env.example`

**Interfaces:**
- Produces: `saveSettings(input): Promise<{ error?: string }>`.

- [ ] **Step 1: Settings action**

Schema: `whatsapp_number` (opsional, panjang 0 atau 10–15 digit setelah normalisasi), `instagram_url`, `tiktok_url` (URL valid atau kosong), `hero_badge`, `orders_badge`. Update row id 1, `revalidateTag("settings")`.

- [ ] **Step 2: Settings form**

Input nomor WhatsApp dengan helper text format `62812xxxxxxx`, Instagram, TikTok, dua teks badge, tombol simpan, dan pesan sukses.

- [ ] **Step 3: README**

Berisi: prasyarat, `npm install`, isi `.env.local`, langkah Supabase (buat project, jalankan `supabase/migrations/0001_init.sql`, jalankan `seed.sql`, buat akun admin lewat Authentication → Users, cek bucket `products`), `npm run dev`, deploy Vercel (import repo + env), dan catatan bahwa nomor WhatsApp diisi di `/admin/pengaturan`.

- [ ] **Step 4: Quality gate akhir**

```powershell
npm run lint; npm run typecheck; npm run test; npm run build
```

Expected: semua PASS.

- [ ] **Step 5: Smoke test**

Jalankan `npm run dev`, cek: `/` semua section tampil, filter katalog, simulator, kalkulator menghasilkan pesan WA, `/produk/blushing-bunny-amigurumi`, `/admin` redirect ke login. Matikan dev server setelah selesai.

---

## Catatan eksekusi

- Task 1–9 bisa diverifikasi tanpa kredensial Supabase karena data kosong ditangani dengan fallback (katalog kosong, settings default).
- Task 10–12 memerlukan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` untuk uji manual penuh; build tetap harus lulus tanpa env (gunakan nilai placeholder saat build jika perlu).
- Semua mutasi admin wajib memanggil `revalidateTag` yang sesuai.
