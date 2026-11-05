import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { WhatsAppLink } from "@/components/public/whatsapp-link";
import type { SiteSettings } from "@/lib/types";

export function FinalCta({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-5 py-12 text-center lg:px-12">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-on-primary/10 text-xl">
          🧶
        </div>
        <h2 className="font-display text-2xl font-semibold leading-tight text-on-primary lg:text-3xl">
          Bawa Pulang Kelembutan Puff Hook Hari Ini
        </h2>
        <p className="text-sm text-on-primary/90">
          Pilih kreasi rajutan ready stock favoritmu atau pesan kustom.
        </p>
        <div className="flex w-full max-w-md flex-col gap-2 pt-1">
          <WhatsAppLink
            phones={[settings.whatsapp_number, settings.whatsapp_number_2]}
            message="Halo Puff Hook! Saya ingin konsultasi rajutan."
            label="Konsultasi via WhatsApp"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-surface-container-lowest py-3 text-xs font-bold text-primary shadow-md transition-all hover:bg-surface-container-high active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Official
          </WhatsAppLink>
          <Link
            href="/#koleksi-produk"
            className="inline-flex w-full items-center justify-center rounded-full bg-on-primary/10 py-3 text-xs font-bold text-on-primary"
          >
            Lihat Katalog Produk
          </Link>
        </div>
      </div>
    </section>
  );
}
