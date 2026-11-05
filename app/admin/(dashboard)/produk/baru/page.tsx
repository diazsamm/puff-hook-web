import type { Metadata } from "next";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "Tambah Produk" };
export const instant = false;

export default function NewProductPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-on-surface lg:text-3xl">
          Tambah Produk
        </h1>
        <p className="text-sm text-on-surface-variant">
          Lengkapi detail produk dan unggah foto terbaiknya.
        </p>
      </div>
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-pillow lg:p-6">
        <ProductForm />
      </div>
    </div>
  );
}
