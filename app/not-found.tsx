import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-5 text-center">
      <span className="text-5xl">🧶</span>
      <h1 className="font-display text-3xl font-semibold text-on-surface">Halaman tidak ditemukan</h1>
      <p className="text-sm text-on-surface-variant">
        Produk atau halaman yang kamu cari sudah tidak tersedia.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
