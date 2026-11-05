import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminProduct } from "@/lib/admin-data";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "Edit Produk" };
export const instant = false;

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProduct(id);

  if (!product) notFound();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-on-surface lg:text-3xl">
          Edit Produk
        </h1>
        <p className="text-sm text-on-surface-variant">{product.name}</p>
      </div>
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-pillow lg:p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
