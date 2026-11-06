"use client";

import { useActionState } from "react";
import { CircleCheck, Loader2, Save } from "lucide-react";
import { Input, Label } from "@/components/ui/field";
import type { SiteSettings } from "@/lib/types";
import { saveSettings, type SettingsFormState } from "./actions";

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(saveSettings, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error ? (
        <div className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          <p className="font-semibold">{state.error}</p>
          {Object.entries(fieldErrors).length > 0 ? (
            <ul className="mt-1 list-inside list-disc text-xs">
              {Object.entries(fieldErrors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {state.success ? (
        <p className="flex items-center gap-2 rounded-xl bg-secondary-fixed px-4 py-3 text-xs font-semibold text-primary">
          <CircleCheck className="h-4 w-4" />
          Pengaturan berhasil disimpan. Halaman publik langsung diperbarui.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whatsapp_number">Nomor WhatsApp 1</Label>
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number}
            placeholder="6281234567890"
            inputMode="tel"
          />
          <p className="text-[11px] text-on-surface-variant">
            Format bebas. Contoh 0812-3456-7890 otomatis menjadi 6281234567890. Pembeli memilih
            Admin 1 atau Admin 2 saat menekan tombol pesan.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whatsapp_number_2">Nomor WhatsApp 2 (opsional)</Label>
          <Input
            id="whatsapp_number_2"
            name="whatsapp_number_2"
            defaultValue={settings.whatsapp_number_2 ?? ""}
            placeholder="6281298765432"
            inputMode="tel"
          />
          <p className="text-[11px] text-on-surface-variant">
            Kosongkan jika hanya ada satu admin. Jika diisi, pembeli melihat pilihan Admin 1 dan
            Admin 2.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="instagram_url">Link Instagram</Label>
          <Input
            id="instagram_url"
            name="instagram_url"
            defaultValue={settings.instagram_url}
            placeholder="https://www.instagram.com/puffhook.crochet_"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tiktok_url">Link TikTok</Label>
          <Input
            id="tiktok_url"
            name="tiktok_url"
            defaultValue={settings.tiktok_url}
            placeholder="https://www.tiktok.com/@puffhook"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="shopee_url">Link Shopee</Label>
          <Input
            id="shopee_url"
            name="shopee_url"
            defaultValue={settings.shopee_url}
            placeholder="https://shopee.co.id/puffhook"
          />
          <p className="text-[11px] text-on-surface-variant">
            Kosongkan untuk menyembunyikan tombol Shopee. Link ini tampil di footer dan halaman
            produk.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero_badge">Teks badge hero</Label>
          <Input
            id="hero_badge"
            name="hero_badge"
            defaultValue={settings.hero_badge}
            maxLength={80}
          />
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <Label htmlFor="orders_badge">Teks badge jumlah pesanan</Label>
          <Input
            id="orders_badge"
            name="orders_badge"
            defaultValue={settings.orders_badge}
            maxLength={80}
          />
        </div>
      </div>

      <div className="border-t border-outline-variant/40 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-all hover:bg-tertiary active:scale-95 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {pending ? "Menyimpan..." : "Simpan pengaturan"}
        </button>
      </div>
    </form>
  );
}
