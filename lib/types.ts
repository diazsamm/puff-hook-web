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
  whatsapp_number_2: string;
  instagram_url: string;
  tiktok_url: string;
  shopee_url: string;
  hero_badge: string;
  orders_badge: string;
  updated_at: string;
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  amigurumi: "Amigurumi",
  flower: "Puff Flower & Buket",
  bag: "Tas & Pouch",
  acc: "Aksesoris & Cardigan",
};
