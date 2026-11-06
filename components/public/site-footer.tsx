import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Logo } from "@/components/logo";
import { getCurrentYear } from "@/lib/year";
import type { SiteSettings } from "@/lib/types";

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = await getCurrentYear();

  return (
    <footer className="bg-surface-container-low pt-14 pb-8 shadow-pillow">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 text-center lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold text-primary">Puff Hook</span>
        </Link>

        <p className="max-w-xs text-xs leading-relaxed text-on-surface-variant">
          Merajut kehangatan benang susu dan cinta dalam setiap helai simpul crochet artisanal.
        </p>

        <div className="flex flex-wrap justify-center gap-1.5">
          <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-[10px] font-semibold text-primary">
            100% Milk Cotton
          </span>
          <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-[10px] font-semibold text-primary">
            Handmade
          </span>
        </div>

        <div className="flex items-center justify-center gap-5 text-xs font-semibold text-on-surface-variant">
          {settings.instagram_url ? (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
          ) : null}
          {settings.tiktok_url ? (
            <a
              href={settings.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              TikTok
            </a>
          ) : null}
          {settings.shopee_url ? (
            <a
              href={settings.shopee_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <ShoppingBag className="h-4 w-4" />
              Shopee
            </a>
          ) : null}
          <Link href="/#custom-order" className="transition-colors hover:text-primary">
            Custom Order
          </Link>
        </div>

        <p className="w-full border-t border-outline-variant/30 pt-4 text-[10px] text-on-surface-variant">
          © {year} Puff Hook Crochet. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}
