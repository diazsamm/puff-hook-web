import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Amigurumi bunny-nya fluffy banget, lebih gemas daripada foto! Benang lembut ga rontok.",
    initials: "NS",
    name: "Nadira S.",
    city: "Surabaya",
  },
  {
    quote:
      "Buket bunganya aku pesan buat wisuda sahabatku. Dipajang permanen tanpa layu!",
    initials: "CP",
    name: "Clarissa P.",
    city: "Bandung",
  },
  {
    quote:
      "Tote bag super kokoh, furing dalam rapi banget. Sering ditanyain beli di mana.",
    initials: "FK",
    name: "Fania K.",
    city: "Jakarta",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-container-low/30">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-12 lg:py-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Love Notes
          </span>
          <h2 className="mt-1 font-display text-3xl font-semibold text-on-surface lg:text-[40px]">
            Kata Mereka
          </h2>
          <p className="text-sm text-on-surface-variant">
            Testimoni kehangatan benang rajut Puff Hook.
          </p>
        </div>

        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="flex min-w-[280px] snap-center flex-col justify-between gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm lg:min-w-0"
            >
              <div className="flex flex-col gap-3">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm italic leading-relaxed text-on-surface">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed text-xs font-bold text-primary">
                  {item.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">{item.name}</span>
                  <span className="text-[10px] text-on-surface-variant">{item.city}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
