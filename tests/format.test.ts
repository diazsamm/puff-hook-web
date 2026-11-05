import { describe, expect, it } from "vitest";
import { formatRupiah, slugify } from "@/lib/format";

describe("formatRupiah", () => {
  it("formats rupiah without decimals", () => {
    expect(formatRupiah(145000)).toBe("Rp 145.000");
  });
});

describe("slugify", () => {
  it("lowercases and joins words", () => {
    expect(slugify("Blushing Bunny Amigurumi")).toBe("blushing-bunny-amigurumi");
  });

  it("strips punctuation and trims dashes", () => {
    expect(slugify("  Puff Flower & Bouquet!  ")).toBe("puff-flower-bouquet");
  });

  it("falls back for empty input", () => {
    expect(slugify("***")).toBe("produk");
  });
});
