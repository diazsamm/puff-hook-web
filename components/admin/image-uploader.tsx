"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { compressImage } from "@/lib/image";
import { createBrowserSupabase } from "@/lib/supabase/client";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const MARKER = "/storage/v1/object/public/products/";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    if (!configured) {
      setError("Supabase belum dikonfigurasi. Isi kredensial di .env.local terlebih dahulu.");
      return;
    }

    setError(null);
    setUploading(true);
    const supabase = createBrowserSupabase();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        setError(`${file.name}: format harus JPG, PNG, atau WebP.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError(`${file.name}: ukuran maksimal 5MB.`);
        continue;
      }

      try {
        const blob = await compressImage(file);
        const path = `${crypto.randomUUID()}/${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("products").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      } catch {
        setError(`${file.name}: gagal diunggah.`);
      }
    }

    if (uploaded.length > 0) onChange([...value, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function removeImage(url: string) {
    onChange(value.filter((item) => item !== url));

    if (!configured || !url.includes(MARKER)) return;

    const supabase = createBrowserSupabase();
    const path = decodeURIComponent(url.split(MARKER)[1] ?? "");
    if (path) await supabase.storage.from("products").remove([path]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container-low">
            <Image src={url} alt="Foto produk" fill sizes="160px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              aria-label="Hapus foto"
              className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-on-surface/70 text-white transition-colors hover:bg-error"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <span className="text-[11px] font-semibold">
            {uploading ? "Mengunggah..." : "Tambah foto"}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <p className="text-[11px] text-on-surface-variant">
        JPG, PNG, atau WebP. Maks 5MB per foto. Foto otomatis dikompres ke WebP 1600px.
      </p>

      {error ? <p className="text-xs font-semibold text-error">{error}</p> : null}
    </div>
  );
}
