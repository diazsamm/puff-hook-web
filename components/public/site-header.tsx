"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { WhatsAppLink } from "@/components/public/whatsapp-link";
import type { SiteSettings } from "@/lib/types";

const links = [
  { href: "/#koleksi-produk", label: "Katalog" },
  { href: "/#tentang-kami", label: "Tentang" },
  { href: "/#custom-order", label: "Custom Order" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-surface/85 shadow-pillow backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold tracking-tight text-primary">
              Puff Hook
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
              Artisan Crochet
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-on-surface-variant lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppLink
            phones={[settings.whatsapp_number, settings.whatsapp_number_2]}
            message="Halo Puff Hook! Saya ingin bertanya tentang produk rajutan."
            label="Hubungi Puff Hook via WhatsApp"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-sm transition-all hover:bg-tertiary active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </WhatsAppLink>
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-primary transition-transform active:scale-95 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-outline-variant/40 bg-surface px-5 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
