import Link from "next/link";
import { CircleCheck, Package, PenLine, Plus, Sparkles } from "lucide-react";
import { getAdminProducts } from "@/lib/admin-data";
import { formatRupiah } from "@/lib/format";

export const instant = false;

export default async function AdminDashboardPage() {
  const products = await getAdminProducts();
  const published = products.filter((product) => product.published).length;
  const drafts = products.length - published;
  const featured = products.filter((product) => product.featured).length;

  const stats = [
    { label: "Produk terbit", value: published, icon: CircleCheck },
    { label: "Draf", value: drafts, icon: PenLine },
    { label: "Unggulan", value: featured, icon: Sparkles },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-on-surface lg:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant">
            Ringkasan katalog Puff Hook saat ini.
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

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-pillow">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed text-primary">
              <stat.icon className="h-4 w-4" />
            </div>
            <p className="font-display text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-surface-container-lowest shadow-pillow">
        <div className="flex items-center justify-between border-b border-outline-variant/40 px-5 py-4">
          <h2 className="text-sm font-bold text-on-surface">Produk terbaru</h2>
          <Link href="/admin/produk" className="text-xs font-semibold text-primary">
            Lihat semua
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
            <Package className="h-8 w-8 text-on-surface-variant" />
            <p className="text-sm text-on-surface-variant">
              Belum ada produk. Tambahkan produk pertamamu.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant/30">
            {products.slice(0, 5).map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-on-surface">{product.name}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    {product.published ? "Terbit" : "Draf"} · {formatRupiah(product.price)}
                  </p>
                </div>
                <Link
                  href={`/admin/produk/${product.id}`}
                  className="shrink-0 text-xs font-semibold text-primary"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
