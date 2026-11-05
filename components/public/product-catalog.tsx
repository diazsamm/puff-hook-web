"use client";

import { useState } from "react";
import { ProductCard } from "@/components/public/product-card";
import { CATEGORY_LABELS, type Product, type ProductCategory } from "@/lib/types";

type Filter = "all" | ProductCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Semua Produk" },
  { id: "amigurumi", label: CATEGORY_LABELS.amigurumi },
  { id: "flower", label: CATEGORY_LABELS.flower },
  { id: "bag", label: CATEGORY_LABELS.bag },
  { id: "acc", label: CATEGORY_LABELS.acc },
];

export function ProductCatalog({
  products,
  whatsappNumbers,
  siteUrl,
}: {
  products: Product[];
  whatsappNumbers: string[];
  siteUrl: string;
}) {
  const [active, setActive] = useState<Filter>("all");
  const visible = active === "all" ? products : products.filter((item) => item.category === active);

  return (
    <section id="koleksi-produk" className="bg-surface-container-low/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-16 lg:px-12 lg:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Katalog Kerajinan
            </span>
            <h2 className="mt-1 font-display text-3xl font-semibold text-on-surface lg:text-[40px]">
              Koleksi Rajutan Pilihan
            </h2>
            <p className="text-sm text-on-surface-variant lg:text-base">
              Dibuat satu per satu dengan tangan, menghasilkan tekstur yang khas dan istimewa.
            </p>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
            {filters.map((filter) => {
              const isActive = filter.id === active;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActive(filter.id)}
                  aria-pressed={isActive}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-outline-variant/70 bg-surface-container-lowest p-12 text-center">
            <p className="text-sm text-on-surface-variant">
              Belum ada produk di kategori ini. Silakan hubungi kami untuk membuat custom order.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumbers={whatsappNumbers}
                siteUrl={siteUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
