"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { slugify } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(120, "Nama maksimal 120 karakter."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter.")
    .max(80, "Slug maksimal 80 karakter."),
  category: z.enum(["amigurumi", "flower", "bag", "acc"]),
  eyebrow: z.string().trim().max(80, "Eyebrow maksimal 80 karakter.").optional(),
  badge: z.string().trim().max(40, "Badge maksimal 40 karakter.").optional(),
  badge_tone: z.enum(["primary", "neutral"]),
  hook_size: z.string().trim().max(40, "Hook size maksimal 40 karakter.").optional(),
  price: z.coerce
    .number()
    .int("Harga harus bilangan bulat.")
    .min(0, "Harga tidak boleh negatif."),
  short_description: z
    .string()
    .trim()
    .max(200, "Deskripsi singkat maksimal 200 karakter.")
    .optional(),
  description: z.string().trim().max(4000, "Deskripsi maksimal 4000 karakter.").optional(),
  images: z.array(z.string().min(1)),
  featured: z.boolean(),
  published: z.boolean(),
  sort_order: z.coerce.number().int().min(0, "Urutan tidak boleh negatif."),
});

function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

function parseImages(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return [];
  }
}

function storagePath(url: string): string | null {
  const marker = "/storage/v1/object/public/products/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

async function requireAdminSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi admin tidak valid. Silakan login ulang.");

  return supabase;
}

export async function saveProduct(
  _previousState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const nameValue = String(formData.get("name") ?? "");
  const slugValue = String(formData.get("slug") ?? "");
  const idValue = String(formData.get("id") ?? "").trim();

  const parsed = productSchema.safeParse({
    name: nameValue,
    slug: slugify(slugValue || nameValue),
    category: formData.get("category"),
    eyebrow: String(formData.get("eyebrow") ?? "").trim() || undefined,
    badge: String(formData.get("badge") ?? "").trim() || undefined,
    badge_tone: formData.get("badge_tone") ?? "neutral",
    hook_size: String(formData.get("hook_size") ?? "").trim() || undefined,
    price: formData.get("price") ?? "0",
    short_description: String(formData.get("short_description") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim() || undefined,
    images: parseImages(String(formData.get("images") ?? "[]")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: formData.get("sort_order") ?? "0",
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data produk.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const idCheck = idValue ? z.string().uuid().safeParse(idValue) : null;
  if (idCheck && !idCheck.success) {
    return { error: "ID produk tidak valid." };
  }
  const id = idCheck?.success ? idCheck.data : undefined;

  try {
    const supabase = await requireAdminSupabase();
    const data = parsed.data;

    let finalSlug = data.slug;
    for (let attempt = 2; attempt <= 50; attempt += 1) {
      const { data: existing, error: slugError } = await supabase
        .from("products")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (slugError) return { error: slugError.message };
      if (!existing || existing.id === id) break;
      finalSlug = `${data.slug}-${attempt}`;
    }

    const payload = {
      name: data.name,
      slug: finalSlug,
      category: data.category,
      eyebrow: data.eyebrow ?? null,
      badge: data.badge ?? null,
      badge_tone: data.badge_tone,
      hook_size: data.hook_size ?? null,
      price: data.price,
      short_description: data.short_description ?? null,
      description: data.description ?? null,
      images: data.images,
      featured: data.featured,
      published: data.published,
      sort_order: data.sort_order,
    };

    const { error } = id
      ? await supabase.from("products").update(payload).eq("id", id)
      : await supabase.from("products").insert(payload);

    if (error) return { error: error.message };
  } catch (caught) {
    return { error: caught instanceof Error ? caught.message : "Gagal menyimpan produk." };
  }

  updateTag("products");
  redirect("/admin/produk");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const images = parseImages(String(formData.get("images") ?? "[]"));

  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) redirect("/admin/produk");

  const supabase = await requireAdminSupabase();

  const paths = images
    .map(storagePath)
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    await supabase.storage.from("products").remove(paths);
  }

  const { error } = await supabase.from("products").delete().eq("id", parsedId.data);
  if (error) throw new Error(error.message);

  updateTag("products");
  redirect("/admin/produk");
}
