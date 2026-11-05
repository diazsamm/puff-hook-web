export function normalizePhone(value: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const normalized = normalizePhone(phone);
  if (normalized.length < 10) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export type WhatsAppOption = {
  phone: string;
  href: string;
  label: string;
  display: string;
};

export function formatPhoneDisplay(value: string): string {
  const normalized = normalizePhone(value);
  if (normalized.length < 10) return value;
  const rest = normalized.slice(2);
  return `+62 ${rest.replace(/^(\d{3})(\d{4})(\d+)$/, "$1-$2-$3")}`;
}

export function getWhatsAppOptions(phones: string[], message: string): WhatsAppOption[] {
  return phones
    .map((phone) => ({ phone, href: buildWhatsAppUrl(phone, message) }))
    .filter((option): option is { phone: string; href: string } => option.href !== null)
    .map((option, index) => ({
      ...option,
      label: `Admin ${index + 1}`,
      display: formatPhoneDisplay(option.phone),
    }));
}

export function productOrderMessage(input: {
  name: string;
  price: string;
  url?: string;
}): string {
  const base = `Halo Puff Hook! Saya tertarik dengan ${input.name} (${input.price}).`;
  return input.url ? `${base} ${input.url}` : base;
}
