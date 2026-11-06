import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Gift, MessageCircle, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/public/product-card";
import { ProductGallery } from "@/components/public/product-gallery";
import { WhatsAppLink } from "@/components/public/whatsapp-link";
import {
  getProductBySlug,
  getPublishedProducts,
  getSiteSettings,
  getSiteUrl,
} from "@/lib/data";
import { formatRupiah } from "@/lib/format";
import { productOrderMessage } from "@/lib/whatsapp";

type PageProps = { params: Promise<{ slug: string }> };

export const instant = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Produk tidak ditemukan" };

  return {
    title: product.name,
    description: product.short_description ?? product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.short_description ?? undefined,
      images: product.images.length > 0 ? [product.images[0]] : undefined,
    },
  };
}

const perks = [
  { icon: ShieldCheck, title: "Handmade rapi", caption: "Dirajut satu per satu" },
  { icon: Gift, title: "Gift box", caption: "Kemasan pita pastel" },
  { icon: Truck, title: "Kirim aman", caption: "Hard box & bubble wrap" },
];

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);

  if (!product) notFound();

  const [products, siteUrl] = await Promise.all([getPublishedProducts(), Promise.resolve(getSiteUrl())]);
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  const message = productOrderMessage({
    name: product.name,
    price: formatRupiah(product.price),
    url: siteUrl ? `${siteUrl}/produk/${product.slug}` : undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-12 lg:py-16">
      <Link
        href="/#koleksi-produk"
        className="mb-6 inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali ke katalog
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {product.eyebrow ? (
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                {product.eyebrow}
              </span>
            ) : null}
            {product.badge ? <Badge tone={product.badge_tone}>{product.badge}</Badge> : null}
            {product.hook_size ? (
              <Badge tone="neutral">{product.hook_size}</Badge>
            ) : null}
          </div>

          <h1 className="font-display text-3xl leading-tight font-semibold text-on-surface lg:text-[40px]">
            {product.name}
          </h1>

          <div className="flex items-end gap-3">
            <span className="font-display text-3xl font-bold text-primary">
              {formatRupiah(product.price)}
            </span>
            <span className="pb-1 text-xs text-on-surface-variant">harga mulai</span>
          </div>

          {product.short_description ? (
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {product.short_description}
            </p>
          ) : null}

          {product.description ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-on-surface-variant">
              {product.description}
            </p>
          ) : null}

          <div className="mt-2 flex flex-col gap-2">
            <WhatsAppLink
              phones={[settings.whatsapp_number, settings.whatsapp_number_2]}
              message={message}
              label={`Pesan ${product.name} via WhatsApp`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-on-primary shadow-[0_12px_28px_-4px_rgba(177,14,107,0.28)] transition-all hover:bg-tertiary active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              Pesan via WhatsApp
            </WhatsAppLink>
            {settings.shopee_url ? (
              <a
                href={settings.shopee_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#EE4D2D] py-3 text-sm font-semibold text-[#EE4D2D] transition-all hover:bg-[#EE4D2D] hover:text-white active:scale-95"
              >
                <ShoppingBag className="h-4 w-4" />
                Beli di Shopee
              </a>
            ) : null}
          </div>

          <p className="text-center text-[11px] text-on-surface-variant">
            Kamu juga bisa request warna, ukuran, atau inisial nama di chat.
          </p>

          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="flex flex-col items-center rounded-xl bg-surface-container-low p-3 text-center"
              >
                <perk.icon className="mb-1 h-5 w-5 text-primary" />
                <span className="text-[11px] font-bold text-on-surface">{perk.title}</span>
                <span className="text-[10px] leading-tight text-on-surface-variant">
                  {perk.caption}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-5 font-display text-2xl font-semibold text-on-surface">
            Produk lain dari Puff Hook
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                whatsappNumbers={[settings.whatsapp_number, settings.whatsapp_number_2]}
                siteUrl={siteUrl}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
