import type { MetadataRoute } from "next";
import { getPublishedProducts, getSiteUrl } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl() || "http://localhost:3000";
  const products = await getPublishedProducts();

  return [
    {
      url: `${base}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...products.map((product) => ({
      url: `${base}/produk/${product.slug}`,
      lastModified: product.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
