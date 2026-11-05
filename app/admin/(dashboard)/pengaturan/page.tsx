import type { Metadata } from "next";
import { getAdminSettings } from "@/lib/admin-data";
import { FALLBACK_SETTINGS } from "@/lib/data";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Pengaturan" };
export const instant = false;

export default async function SettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-on-surface lg:text-3xl">
          Pengaturan
        </h1>
        <p className="text-sm text-on-surface-variant">
          Nomor WhatsApp, sosial media, dan teks utama di halaman depan.
        </p>
      </div>
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-pillow lg:p-6">
        <SettingsForm settings={settings ?? FALLBACK_SETTINGS} />
      </div>
    </div>
  );
}
