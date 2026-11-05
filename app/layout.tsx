import type { Metadata } from "next";
import { jakarta, playfair } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Puff Hook — Rajutan Handmade & Custom Order",
    template: "%s | Puff Hook",
  },
  description:
    "Puff Hook menghadirkan amigurumi, buket bunga, tas, dan aksesoris crochet handmade dengan benang milk cotton lembut. Terima custom order.",
  openGraph: {
    title: "Puff Hook — Rajutan Handmade & Custom Order",
    description:
      "Amigurumi, buket bunga, tas, dan aksesoris crochet handmade dengan benang milk cotton lembut.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
