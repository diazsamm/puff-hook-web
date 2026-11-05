"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/whatsapp";

export type SettingsFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

const settingsSchema = z.object({
  whatsapp_number: z.string().trim().max(20),
  whatsapp_number_2: z.string().trim().max(20),
  instagram_url: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https?:\/\//i.test(value), "URL harus diawali http:// atau https://"),
  tiktok_url: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https?:\/\//i.test(value), "URL harus diawali http:// atau https://"),
  hero_badge: z.string().trim().min(1, "Teks badge wajib diisi.").max(80, "Maksimal 80 karakter."),
  orders_badge: z.string().trim().min(1, "Teks badge wajib diisi.").max(80, "Maksimal 80 karakter."),
});

export async function saveSettings(
  _previousState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const parsed = settingsSchema.safeParse({
    whatsapp_number: formData.get("whatsapp_number") ?? "",
    whatsapp_number_2: formData.get("whatsapp_number_2") ?? "",
    instagram_url: formData.get("instagram_url") ?? "",
    tiktok_url: formData.get("tiktok_url") ?? "",
    hero_badge: formData.get("hero_badge") ?? "",
    orders_badge: formData.get("orders_badge") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Periksa kembali pengaturan.", fieldErrors };
  }

  const phone = parsed.data.whatsapp_number;
  const normalizedPhone = phone ? normalizePhone(phone) : "";
  const phone2 = parsed.data.whatsapp_number_2;
  const normalizedPhone2 = phone2 ? normalizePhone(phone2) : "";

  const phoneErrors: Record<string, string> = {};
  if (phone && normalizedPhone.length < 10) {
    phoneErrors.whatsapp_number = "Nomor WhatsApp minimal 10 digit.";
  }
  if (phone2 && normalizedPhone2.length < 10) {
    phoneErrors.whatsapp_number_2 = "Nomor WhatsApp minimal 10 digit.";
  }

  if (Object.keys(phoneErrors).length > 0) {
    return { error: "Periksa kembali pengaturan.", fieldErrors: phoneErrors };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Supabase belum dikonfigurasi." };
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sesi admin tidak valid. Silakan login ulang." };

  const { error } = await supabase
    .from("site_settings")
    .update({
      whatsapp_number: normalizedPhone,
      whatsapp_number_2: normalizedPhone2,
      instagram_url: parsed.data.instagram_url,
      tiktok_url: parsed.data.tiktok_url,
      hero_badge: parsed.data.hero_badge,
      orders_badge: parsed.data.orders_badge,
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  updateTag("settings");
  return { success: true };
}
