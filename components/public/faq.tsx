import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Cara mencuci agar tidak melar?",
    answer:
      "Rendam dengan detergen cair lembut atau sampo bayi di air dingin 10-15 menit. Keringkan mendatar (flat dry) beralaskan handuk bersih.",
  },
  {
    question: "Lama proses pesanan custom?",
    answer:
      "Amigurumi & buket: 3-5 hari. Tas & cardigan: 5-7 hari kerja tergantung antrean studio.",
  },
  {
    question: "Apakah aman dikirim ke luar pulau?",
    answer:
      "Sangat aman! Hard box karton tebal berpita & bubble wrap tebal 3 lapis menjaga bentuk agar tidak penyok.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-surface-container-low/30 pb-16 lg:pb-20">
      <div className="mx-auto max-w-3xl px-5 lg:px-12">
        <h2 className="mb-4 text-center font-display text-xl font-semibold text-on-surface">
          Petunjuk Perawatan &amp; FAQ
        </h2>
        <div className="flex flex-col gap-2.5">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-on-surface">
                <span>{faq.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 border-t border-outline-variant/30 pt-2 text-xs leading-relaxed text-on-surface-variant">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
