import { describe, expect, it } from "vitest";
import {
  buildWhatsAppUrl,
  formatPhoneDisplay,
  getWhatsAppOptions,
  normalizePhone,
  productOrderMessage,
} from "@/lib/whatsapp";

describe("normalizePhone", () => {
  it("converts local 08 to 628", () => {
    expect(normalizePhone("0812-3456-7890")).toBe("6281234567890");
  });

  it("keeps 62 prefix", () => {
    expect(normalizePhone("+62 812 3456 7890")).toBe("6281234567890");
  });
});

describe("buildWhatsAppUrl", () => {
  it("encodes the message", () => {
    expect(buildWhatsAppUrl("081234567890", "Halo Puff Hook!")).toBe(
      "https://wa.me/6281234567890?text=Halo%20Puff%20Hook!"
    );
  });

  it("returns null when the number is too short", () => {
    expect(buildWhatsAppUrl("123", "Halo")).toBeNull();
  });
});

describe("getWhatsAppOptions", () => {
  it("skips empty or invalid numbers", () => {
    const options = getWhatsAppOptions(["081234567890", "", "123"], "Halo");
    expect(options).toHaveLength(1);
    expect(options[0].label).toBe("Admin 1");
  });

  it("labels two numbers as Admin 1 and Admin 2", () => {
    const options = getWhatsAppOptions(["081234567890", "089876543210"], "Halo");
    expect(options.map((option) => option.label)).toEqual(["Admin 1", "Admin 2"]);
    expect(options[1].href).toContain("wa.me/6289876543210");
  });

  it("returns no options when both numbers are empty", () => {
    expect(getWhatsAppOptions(["", ""], "Halo")).toHaveLength(0);
  });
});

describe("formatPhoneDisplay", () => {
  it("formats an Indonesian number for display", () => {
    expect(formatPhoneDisplay("0812-3456-7890")).toBe("+62 812-3456-7890");
  });
});

describe("productOrderMessage", () => {
  it("includes name, price, and url when provided", () => {
    expect(
      productOrderMessage({
        name: "Blushing Bunny",
        price: "Rp 145.000",
        url: "https://puffhook.test/produk/blushing-bunny",
      })
    ).toBe(
      "Halo Puff Hook! Saya tertarik dengan Blushing Bunny (Rp 145.000). https://puffhook.test/produk/blushing-bunny"
    );
  });
});
