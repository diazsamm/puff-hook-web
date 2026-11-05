"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { slugify } from "@/lib/format";
import type { Product } from "@/lib/types";
import { saveProduct, type ProductFormState } from "./actions";

const initialState: ProductFormState = {};

export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, pending] = useActionState(saveProduct, initialState);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [images, setImages] = useState<string[]>(product?.images ?? []);

  const fieldErrors = state.fieldErrors ?? {};
  const errorKeys = Object.keys(fieldErrors);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {state.error ? (
        <div className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          <p className="font-semibold">{state.error}</p>
          {errorKeys.length > 0 ? (
            <ul className="mt-1 list-inside list-disc text-xs">
              {errorKeys.map((key) => (
                <li key={key}>{fieldErrors[key]}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nama produk</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) => {
              const next = event.target.value;
              setName(next);
              if (!slugTouched) setSlug(slugify(next));
            }}
            required
            maxLength={120}
            placeholder="Blushing Bunny Amigurumi"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug URL</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            required
            maxLength={80}
            placeholder="blushing-bunny-amigurumi"
          />
          <p className="text-[11px] text-on-surface-variant">
            Alamat: /produk/{slug || "slug-produk"}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Kategori</Label>
          <Select id="category" name="category" defaultValue={product?.category ?? "amigurumi"}>
            <option value="amigurumi">Amigurumi</option>
            <option value="flower">Puff Flower &amp; Buket</option>
            <option value="bag">Tas &amp; Pouch</option>
            <option value="acc">Aksesoris &amp; Cardigan</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step={1000}
            defaultValue={product?.price ?? 0}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="eyebrow">Label kecil di atas nama</Label>
          <Input
            id="eyebrow"
            name="eyebrow"
            defaultValue={product?.eyebrow ?? ""}
            maxLength={80}
            placeholder="Amigurumi Premium"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hook_size">Ukuran hook</Label>
          <Input
            id="hook_size"
            name="hook_size"
            defaultValue={product?.hook_size ?? ""}
            maxLength={40}
            placeholder="4.0mm Hook"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="badge">Badge</Label>
          <Input
            id="badge"
            name="badge"
            defaultValue={product?.badge ?? ""}
            maxLength={40}
            placeholder="Best Seller"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="badge_tone">Warna badge</Label>
          <Select id="badge_tone" name="badge_tone" defaultValue={product?.badge_tone ?? "neutral"}>
            <option value="neutral">Pink lembut</option>
            <option value="primary">Pink pekat</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort_order">Urutan tampil</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            min={0}
            defaultValue={product?.sort_order ?? 0}
          />
          <p className="text-[11px] text-on-surface-variant">
            Angka kecil tampil lebih dulu.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1 lg:col-span-2">
          <Label>Foto produk</Label>
          <ImageUploader value={images} onChange={setImages} />
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <Label htmlFor="short_description">Deskripsi singkat</Label>
          <Textarea
            id="short_description"
            name="short_description"
            rows={2}
            maxLength={200}
            defaultValue={product?.short_description ?? ""}
            placeholder="Tampil di kartu katalog, maksimal 200 karakter."
          />
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <Label htmlFor="description">Deskripsi lengkap</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            maxLength={4000}
            defaultValue={product?.description ?? ""}
            placeholder="Ceritakan bahan, ukuran, dan detail produk."
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:col-span-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-on-surface">
            <input
              type="checkbox"
              name="published"
              defaultChecked={product?.published ?? true}
              className="h-4 w-4 accent-primary"
            />
            Terbitkan di situs
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-on-surface">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4 accent-primary"
            />
            Tandai sebagai unggulan
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-outline-variant/40 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-all hover:bg-tertiary active:scale-95 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {pending ? "Menyimpan..." : "Simpan produk"}
        </button>
        <Link
          href="/admin/produk"
          className="text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
