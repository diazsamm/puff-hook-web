export const customOrderTypes = [
  { id: "amigurumi-mini", label: "Amigurumi Mini (~10cm)", price: 120000 },
  { id: "amigurumi-medium", label: "Amigurumi Sedang (~18cm)", price: 180000 },
  { id: "bouquet", label: "Buket Bunga Lengkap", price: 175000 },
  { id: "bag", label: "Tas / Pouch Custom", price: 220000 },
  { id: "cardigan", label: "Cardigan Rajut", price: 390000 },
] as const;

export const customOrderColorSchemes = [
  "Sakura Pastel (Pink & Cream)",
  "Berry Shortcake (Dusty Pink)",
  "Matcha Latte (Sage Green)",
  "Baby Blue Sky (Blue & White)",
  "Custom Bebas",
] as const;

export const customOrderAddons = [
  { id: "gift-box", label: "Gift Box & Pita", price: 15000 },
  { id: "initial", label: "Inisial Huruf", price: 10000 },
  { id: "greeting-card", label: "Kartu Ucapan", price: 5000 },
] as const;

export type CustomOrderType = (typeof customOrderTypes)[number];
export type CustomOrderAddon = (typeof customOrderAddons)[number];

export function calcCustomPrice(input: { typeId: string; addonIds: string[] }): number {
  const type = customOrderTypes.find((item) => item.id === input.typeId);
  if (!type) return 0;
  const addonTotal = input.addonIds.reduce((total, id) => {
    const addon = customOrderAddons.find((item) => item.id === id);
    return total + (addon?.price ?? 0);
  }, 0);
  return type.price + addonTotal;
}
