import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ExternalLink } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/logo";
import { createServerSupabase } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection();

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!configured) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-5 py-16 text-center">
        <Logo className="h-14 w-14" />
        <h1 className="font-display text-3xl font-semibold text-on-surface">
          Supabase belum dikonfigurasi
        </h1>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Isi <code className="rounded bg-surface-container-high px-1.5 py-0.5">.env.local</code>{" "}
          dengan <strong>NEXT_PUBLIC_SUPABASE_URL</strong> dan{" "}
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong>, lalu jalankan migrasi{" "}
          <code className="rounded bg-surface-container-high px-1.5 py-0.5">
            supabase/migrations/0001_init.sql
          </code>
          .
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary"
        >
          Kembali ke situs
        </Link>
      </div>
    );
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-surface-container-low/40 lg:flex">
      <aside className="border-b border-outline-variant/40 bg-surface lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center gap-2.5 px-5 py-4">
          <Logo className="h-9 w-9" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold text-primary">Puff Hook</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
              Admin Panel
            </span>
          </div>
        </div>
        <AdminNav email={user.email ?? ""} />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-outline-variant/40 bg-surface px-5 py-3 lg:px-8">
          <span className="text-sm font-semibold text-on-surface">Panel Admin</span>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-tertiary"
          >
            Lihat situs
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </header>
        <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
