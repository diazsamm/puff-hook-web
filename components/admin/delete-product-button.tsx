"use client";

import { Trash2 } from "lucide-react";

export function DeleteProductButton({ name }: { name: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(`Hapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`)) {
          event.preventDefault();
        }
      }}
      className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1.5 text-[11px] font-semibold text-error transition-colors hover:bg-error hover:text-on-primary"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Hapus
    </button>
  );
}
