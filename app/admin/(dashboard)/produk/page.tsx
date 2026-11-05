import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Badge } from "@/components/ui/badge";
import { getAdminProducts } from "@/lib/admin-data";
import { formatRupiah } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/types";
import { deleteProduct } from "./actions";

export const instant = false;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, products] = await Promise.all([searchParams, getAdminProducts()]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-on-surface lg:text-3xl">
            Produk
          </h1>
          <p className="text-sm text-on-surface-variant">
            {products.length} produk tersimpan di katalog.
          </p>
        </div>
        <Link
          href="/admin/produk/baru"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary transition-colors hover:bg-tertiary"
        >
          <Plus className="h-4 w-4" />
          Tambah produk
        </Link>
      </div>

      {saved ? (
        <p className="rounded-xl bg-secondary-fixed px-4 py-3 text-xs font-semibold text-primary">
          Produk berhasil disimpan.
        </p>
      ) : null}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
          <p className="text-sm text-on-surface-variant">
            Belum ada produk. Klik &ldquo;Tambah produk&rdquo; untuk memulai.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-pillow">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-outline-variant/40 text-[11px] uppercase tracking-wider text-on-surface-variant">
                <th className="px-4 py-3 font-semibold">Produk</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Harga</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {products.map((product) => (
                <tr key={product.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-lg">🧶</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-on-surface">
                          {product.name}
                        </p>
                        <p className="truncate text-[11px] text-on-surface-variant">
                          /produk/{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">
                    {CATEGORY_LABELS[product.category]}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-on-surface">
                    {formatRupiah(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge tone={product.published ? "primary" : "neutral"}>
                        {product.published ? "Terbit" : "Draf"}
                      </Badge>
                      {product.featured ? <Badge tone="neutral">Unggulan</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/produk/${product.id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-secondary-fixed"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <input
                          type="hidden"
                          name="images"
                          value={JSON.stringify(product.images)}
                        />
                        <DeleteProductButton name={product.name} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
