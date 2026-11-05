import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Masuk Admin" };
export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const target = next && next.startsWith("/admin") ? next : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-surface-container-low via-surface to-surface px-5 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-7 shadow-pillow">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="font-display text-2xl font-semibold text-on-surface">Masuk Admin</h1>
          <p className="text-xs text-on-surface-variant">
            Kelola produk dan pengaturan website Puff Hook.
          </p>
        </div>

        <LoginForm next={target} />
      </div>
    </div>
  );
}
