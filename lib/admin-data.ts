import { createServerSupabase } from "@/lib/supabase/server";
import type { Product, SiteSettings } from "@/lib/types";

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Product | null) ?? null;
}

export async function getAdminSettings(): Promise<SiteSettings | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  if (error) throw new Error(error.message);
  return (data as SiteSettings | null) ?? null;
}
