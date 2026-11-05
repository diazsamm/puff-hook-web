"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Settings } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createBrowserSupabase().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 border-t border-outline-variant/40 p-3 lg:border-t-0">
      <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
        {links.map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden flex-col gap-2 border-t border-outline-variant/40 pt-3 lg:flex">
        <span className="truncate px-3 text-[11px] text-on-surface-variant">{email}</span>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}
