"use client";

import { useState } from "react";
import { Send, SlidersHorizontal } from "lucide-react";
import { WhatsAppChoiceDialog } from "@/components/public/whatsapp-choice-dialog";
import { Select, Textarea } from "@/components/ui/field";
import {
  calcCustomPrice,
  customOrderAddons,
  customOrderColorSchemes,
  customOrderTypes,
} from "@/lib/custom-order";
import { formatRupiah } from "@/lib/format";
import { getWhatsAppOptions, type WhatsAppOption } from "@/lib/whatsapp";

export function CustomOrderCalculator({ whatsappNumbers }: { whatsappNumbers: string[] }) {
  const [typeId, setTypeId] = useState<string>("amigurumi-medium");
  const [colorScheme, setColorScheme] = useState<string>(customOrderColorSchemes[0]);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [choices, setChoices] = useState<WhatsAppOption[] | null>(null);

  const total = calcCustomPrice({ typeId, addonIds });

  function toggleAddon(id: string) {
    setAddonIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const typeLabel = customOrderTypes.find((item) => item.id === typeId)?.label ?? "-";
    const addonLabels = addonIds.flatMap((id) => {
      const addon = customOrderAddons.find((item) => item.id === id);
      return addon ? [addon.label] : [];
    });

    const message = [
      "Halo Puff Hook! Saya ingin custom order:",
      `- Jenis: ${typeLabel}`,
      `- Tema Warna: ${colorScheme}`,
      `- Tambahan: ${addonLabels.length ? addonLabels.join(", ") : "Tidak ada"}`,
      `- Catatan: ${notes.trim() || "Tidak ada catatan tambahan"}`,
      `- Estimasi: ${formatRupiah(total)}`,
    ].join("\n");

    const options = getWhatsAppOptions(whatsappNumbers, message);

    if (options.length === 0) {
      window.alert("Nomor WhatsApp belum diatur oleh admin.");
      return;
    }

    if (options.length === 1) {
      window.open(options[0].href, "_blank", "noopener,noreferrer");
      return;
    }

    setChoices(options);
  }

  return (
    <section id="custom-order" className="bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-12 lg:py-24">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Kustomisasi
          </span>
          <h2 className="mt-1 font-display text-3xl font-semibold text-on-surface lg:text-[40px]">
            Custom Rajutan Impianmu
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Punya foto karakter atau referensi warna? Wujudkan sekarang!
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {["Konsultasi", "Rajut (3-7 hari)", "QC & Gift Box"].map((step, index) => (
            <div
              key={step}
              className="flex flex-col items-center rounded-2xl bg-surface-container-low p-3 text-center"
            >
              <div
                className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  index === 2
                    ? "bg-surface-container-high text-primary"
                    : "bg-primary text-on-primary"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-[11px] leading-tight font-bold text-on-surface">{step}</span>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-4 rounded-3xl bg-surface-container-lowest p-5 shadow-pillow lg:p-7"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-on-surface">Kalkulator Estimasi Custom</h3>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="custom-type" className="text-xs font-semibold text-on-surface">
              Jenis Rajutan:
            </label>
            <Select
              id="custom-type"
              value={typeId}
              onChange={(event) => setTypeId(event.target.value)}
            >
              {customOrderTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label} — {formatRupiah(type.price)}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="custom-color" className="text-xs font-semibold text-on-surface">
              Tema Palet Warna:
            </label>
            <Select
              id="custom-color"
              value={colorScheme}
              onChange={(event) => setColorScheme(event.target.value)}
            >
              {customOrderColorSchemes.map((scheme) => (
                <option key={scheme} value={scheme}>
                  {scheme}
                </option>
              ))}
            </Select>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-xs font-semibold text-on-surface">Tambahan:</legend>
            {customOrderAddons.map((addon) => (
              <label
                key={addon.id}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-surface-container-low p-2.5"
              >
                <input
                  type="checkbox"
                  checked={addonIds.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-xs text-on-surface">
                  {addon.label} (+{formatRupiah(addon.price).replace("Rp ", "").replace(".000", "k")})
                </span>
              </label>
            ))}
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="custom-notes" className="text-xs font-semibold text-on-surface">
              Catatan Khusus:
            </label>
            <Textarea
              id="custom-notes"
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Contoh: Telinga kelinci floppy, warna benang lebih muda..."
            />
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-surface-container-high/80 p-4 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">Estimasi Biaya:</span>
              <span className="font-display text-xl font-bold text-primary">
                {formatRupiah(total)}
              </span>
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-tertiary active:scale-95"
            >
              <Send className="h-4 w-4" />
              Kirim ke WhatsApp
            </button>
          </div>
        </form>
      </div>

      <WhatsAppChoiceDialog
        open={choices !== null}
        options={choices ?? []}
        onClose={() => setChoices(null)}
      />
    </section>
  );
}
