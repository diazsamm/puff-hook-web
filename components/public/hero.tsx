import Image from "next/image";
import { ArrowDown, BadgeCheck, Leaf, Palette, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { YarnAnimation } from "@/components/public/yarn-animation";
import type { SiteSettings } from "@/lib/types";

const values = [
  { icon: Leaf, title: "Milk Cotton", caption: "Serat halus & adem" },
  { icon: BadgeCheck, title: "Presisi Tinggi", caption: "Jahitan rapi rapat" },
  { icon: Palette, title: "Bebas Custom", caption: "Warna & inisial nama" },
];

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low/60 via-surface to-surface">
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-secondary-fixed/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-80 w-80 rounded-full bg-secondary-fixed/40 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 lg:grid-cols-12 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-high px-3 py-1 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">{settings.hero_badge}</span>
          </div>

          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] font-semibold tracking-tight text-on-surface lg:text-[56px]">
            Kehangatan Rajutan <span className="italic text-primary">Lembut</span> di Setiap
            Puff Stitch.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-on-surface-variant lg:text-lg">
            Puff Hook menghadirkan aneka kreasi crochet premium mulai dari amigurumi gemas, puff
            flower bouquet, cardigan, hingga tote bag estetik bernuansa pastel pink &amp; warm
            cream.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <ButtonLink href="/#koleksi-produk" className="group">
              Jelajahi Produk Pilihan
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </ButtonLink>
            <ButtonLink href="/#custom-order" variant="secondary">
              Pesan Custom Rajutan
              <span aria-hidden="true">🧶</span>
            </ButtonLink>
          </div>

          <div className="grid max-w-lg grid-cols-3 gap-2.5 pt-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex items-center gap-2 rounded-xl bg-surface-container-lowest/80 p-2.5 shadow-sm"
              >
                <value.icon className="h-5 w-5 shrink-0 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">{value.title}</span>
                  <span className="text-[11px] leading-tight text-on-surface-variant">
                    {value.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col items-center lg:col-span-5">
          <div className="absolute -top-5 left-2 z-20 flex items-center gap-2 rounded-full bg-surface-container-lowest/95 px-4 py-1.5 shadow-pillow backdrop-blur-md sm:left-6">
            <span aria-hidden="true">✨</span>
            <span className="text-xs font-bold text-primary">{settings.orders_badge}</span>
          </div>

          <div className="w-full max-w-md rounded-[2.5rem] bg-surface-container-lowest p-3 shadow-[0_20px_48px_-8px_rgba(177,14,107,0.18)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-surface-container-high">
              <Image
                src="/seed/hero.jpg"
                alt="Koleksi rajutan pastel Puff Hook"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
            </div>

            <div className="mt-3 flex flex-col items-center rounded-2xl bg-surface-container-low/70 p-3">
              <div className="h-44 w-full overflow-hidden rounded-xl bg-surface-container-lowest">
                <YarnAnimation className="h-full w-full" />
              </div>
              <div className="flex w-full items-center justify-between px-2 pt-2">
                <span className="text-[11px] font-semibold text-secondary">
                  Tonton Irama Benang Bergerak
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                  <span className="h-2 w-2 animate-ping rounded-full bg-primary" />
                  Live Crafting
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
