import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WhatsAppLink } from "@/components/public/whatsapp-link";
import { formatRupiah } from "@/lib/format";
import { productOrderMessage } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  whatsappNumbers,
  siteUrl,
}: {
  product: Product;
  whatsappNumbers: string[];
  siteUrl: string;
}) {
  const image = product.images[0];
  const url = siteUrl ? `${siteUrl}/produk/${product.slug}` : undefined;
  const message = productOrderMessage({
    name: product.name,
    price: formatRupiah(product.price),
    url,
  });

  return (
    <article className="group flex flex-col rounded-[2rem] bg-surface-container-lowest p-4 shadow-pillow transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        href={`/produk/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-[1.5rem] bg-surface-container-low"
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🧶</div>
        )}
        {product.badge ? (
          <Badge tone={product.badge_tone} className="absolute top-3 left-3 shadow-sm">
            {product.badge}
          </Badge>
        ) : null}
        {product.hook_size ? (
          <span className="absolute right-3 bottom-3 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 text-xs font-medium text-primary backdrop-blur-sm">
            {product.hook_size}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        {product.eyebrow ? (
          <span className="text-[11px] font-semibold text-secondary">{product.eyebrow}</span>
        ) : null}

        <Link href={`/produk/${product.slug}`}>
          <h3 className="text-base font-semibold text-on-surface transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {product.short_description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
            {product.short_description}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <span className="block text-[11px] text-on-surface-variant">Harga</span>
            <span className="text-base font-bold text-primary">{formatRupiah(product.price)}</span>
          </div>
          <WhatsAppLink
            phones={whatsappNumbers}
            message={message}
            label={`Pesan ${product.name} via WhatsApp`}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            Pesan WA
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
}
