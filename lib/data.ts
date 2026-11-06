import { cacheLife, cacheTag } from "next/cache";
import { SEED_PRODUCTS } from "@/lib/seed-products";
import { createPublicSupabase, isSupabaseConfigured } from "@/lib/supabase/public";
import type { Product, SiteSettings } from "@/lib/types";

export const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  whatsapp_number: "",
  whatsapp_number_2: "",
  instagram_url: "https://www.instagram.com/puffhook.crochet_",
  tiktok_url: "",
  shopee_url: "",
  hero_badge: "100% Handmade with Love & Fluffy Yarn",
  orders_badge: "4.800+ Pesanan Rajutan Terkirim",
  updated_at: "2026-01-01T00:00:00.000Z",
};

export async function getPublishedProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  if (!isSupabaseConfigured()) return SEED_PRODUCTS;

  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  if (!isSupabaseConfigured()) {
    return SEED_PRODUCTS.find((product) => product.slug === slug) ?? null;
  }

  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load product", error.message);
    return null;
  }

  return (data as Product | null) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("settings");
  cacheLife("hours");

  if (!isSupabaseConfigured()) return FALLBACK_SETTINGS;

  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load site settings", error.message);
    return FALLBACK_SETTINGS;
  }

  const settings = (data as SiteSettings | null) ?? FALLBACK_SETTINGS;
  return {
    ...settings,
    whatsapp_number_2: settings.whatsapp_number_2 ?? "",
    shopee_url: settings.shopee_url ?? "",
  };
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
}
