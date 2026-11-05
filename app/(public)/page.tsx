import { CustomOrderCalculator } from "@/components/public/custom-order-calculator";
import { Faq } from "@/components/public/faq";
import { FinalCta } from "@/components/public/final-cta";
import { Hero } from "@/components/public/hero";
import { ProductCatalog } from "@/components/public/product-catalog";
import { PuffSimulator } from "@/components/public/puff-simulator";
import { StorySection } from "@/components/public/story-section";
import { Testimonials } from "@/components/public/testimonials";
import { getPublishedProducts, getSiteSettings, getSiteUrl } from "@/lib/data";

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSiteSettings(), getPublishedProducts()]);
  const siteUrl = getSiteUrl();

  return (
    <>
      <Hero settings={settings} />
      <PuffSimulator />
      <StorySection />
      <ProductCatalog
        products={products}
        whatsappNumbers={[settings.whatsapp_number, settings.whatsapp_number_2]}
        siteUrl={siteUrl}
      />
      <CustomOrderCalculator
        whatsappNumbers={[settings.whatsapp_number, settings.whatsapp_number_2]}
      />
      <Testimonials />
      <Faq />
      <FinalCta settings={settings} />
    </>
  );
}
