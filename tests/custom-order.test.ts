import { describe, expect, it } from "vitest";
import { calcCustomPrice, customOrderAddons, customOrderTypes } from "@/lib/custom-order";

describe("calcCustomPrice", () => {
  it("returns base price without addons", () => {
    expect(calcCustomPrice({ typeId: "amigurumi-mini", addonIds: [] })).toBe(120000);
  });

  it("adds selected addons", () => {
    expect(calcCustomPrice({ typeId: "bouquet", addonIds: ["gift-box", "initial"] })).toBe(
      175000 + 15000 + 10000
    );
  });

  it("ignores unknown ids", () => {
    expect(calcCustomPrice({ typeId: "unknown", addonIds: ["unknown"] })).toBe(0);
  });

  it("exposes typed config", () => {
    expect(customOrderTypes[0].id).toBe("amigurumi-mini");
    expect(customOrderAddons.length).toBeGreaterThan(0);
  });
});
