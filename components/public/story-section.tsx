import { CircleDashed, Gift, Leaf, SprayCan } from "lucide-react";

const stats = [
  { value: "3+", label: "Tahun Pengalaman" },
  { value: "150+", label: "Desain Orisinal" },
  { value: "99.4%", label: "Kepuasan Pembeli" },
];

const pillars = [
  {
    icon: Leaf,
    title: "Milk Cotton & Chenille",
    description:
      "Hanya memakai benang impor bersertifikat bebas alergi yang lembut saat disentuh kulit sensitif.",
  },
  {
    icon: CircleDashed,
    title: "Signature Puff Stitch",
    description:
      "Bentuk gelembung rajut montok dan simetris yang menjadi identitas visual unik Puff Hook.",
  },
  {
    icon: SprayCan,
    title: "Higienis & UV Sanitized",
    description:
      "Setiap item disterilisasi sebelum dikemas dalam wadah bersegel kedap debu.",
  },
  {
    icon: Gift,
    title: "Gift Box & Kartu Pesan",
    description:
      "Kemasan kotak berpita pastel estetik dengan kartu ucapan custom gratis.",
  },
];

export function StorySection() {
  return (
    <section id="tentang-kami" className="bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-12 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-6">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Cerita Pengrajin
              </span>
            </div>
            <h2 className="font-display text-3xl leading-snug font-semibold text-on-surface lg:text-[40px]">
              Sentuhan Lambat, Makna Mendalam di Tiap Tarikan Kait.
            </h2>
            <p className="text-sm leading-relaxed text-on-surface-variant lg:text-base">
              Berawal dari secangkir teh hangat dan kegemaran merajut di sudut ruang tamu,{" "}
              <strong className="text-on-surface">Puff Hook</strong> lahir dari apresiasi terhadap{" "}
              <em>slow crafting</em>. Kami percaya bahwa barang buatan tangan membawa vibrasi
              kehangatan emosional yang tak bisa ditiru mesin pabrik massal.
            </p>
            <p className="text-sm leading-relaxed text-on-surface-variant lg:text-base">
              Setiap kelopak bunga amigurumi dan jinjingan tas dirajut helai demi helai menggunakan
              teknik <em>puff stitch</em> padat agar bertekstur empuk, awet, dan tetap menawan
              sepanjang waktu.
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-surface-container-low p-3 text-center">
                  <span className="font-display text-2xl font-bold text-primary">{stat.value}</span>
                  <p className="mt-1 text-[11px] leading-tight text-on-surface-variant">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex flex-col gap-2 rounded-2xl bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(177,14,107,0.04)] transition-transform hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-primary">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-on-surface">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
