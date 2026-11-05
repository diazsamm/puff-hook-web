import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl() || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
