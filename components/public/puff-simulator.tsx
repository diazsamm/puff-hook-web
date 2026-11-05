"use client";

import { useState } from "react";
import { RotateCcw, Wand2 } from "lucide-react";

const yarnColors = [
  { hex: "#F472B6", name: "Blush Pink" },
  { hex: "#FDF4E3", name: "Cream Milk" },
  { hex: "#BE185D", name: "Baby Berry" },
  { hex: "#E8D5C4", name: "Vanilla Mist" },
];

type Stitch = { id: number; hex: string };

export function PuffSimulator() {
  const [color, setColor] = useState(yarnColors[0]);
  const [stitches, setStitches] = useState<Stitch[]>([]);

  function addStitch() {
    setStitches((current) => [...current, { id: Date.now() + current.length, hex: color.hex }]);
  }

  return (
    <section className="bg-surface-container-low/50">
      <div className="mx-auto max-w-4xl px-5 py-16 lg:px-12 lg:py-20">
        <div className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-[0_12px_36px_-6px_rgba(177,14,107,0.08)] lg:p-10">
          <div className="mx-auto mb-6 max-w-xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Mini Interaktif
            </span>
            <h2 className="mt-1 font-display text-2xl font-semibold text-on-surface lg:text-[28px]">
              Coba Rangkai Motif Crochet Kamu
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Pilih warna benang favoritmu dan klik tombol rajut untuk melihat jalinan puff stitch
              bertambah!
            </p>
          </div>

          <div className="grid items-center gap-4 md:grid-cols-12">
            <div className="flex flex-col gap-3 rounded-2xl bg-surface-container-low p-4 md:col-span-5">
              <span className="text-sm font-bold text-on-surface">1. Pilih Warna Benang:</span>
              <div className="grid grid-cols-2 gap-2">
                {yarnColors.map((item) => {
                  const active = item.hex === color.hex;
                  return (
                    <button
                      key={item.hex}
                      type="button"
                      onClick={() => setColor(item)}
                      aria-pressed={active}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-left shadow-sm transition-all active:scale-95 ${
                        active
                          ? "bg-secondary-fixed"
                          : "bg-surface-container-lowest hover:bg-secondary-fixed"
                      }`}
                    >
                      <span
                        className={`h-5 w-5 shrink-0 rounded-full shadow-inner ${
                          item.hex === "#FDF4E3" ? "border border-outline-variant" : ""
                        }`}
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="text-xs font-semibold text-on-surface">{item.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pt-1 text-sm">
                <span className="text-on-surface-variant">Warna terpilih: </span>
                <span className="font-bold text-primary">{color.name}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-lowest p-4 md:col-span-7">
              <div className="mb-3 flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-on-surface-variant">
                  Simpul Rajutan Terpasang:
                </span>
                <span className="font-display text-2xl font-bold text-primary">
                  {stitches.length}
                </span>
              </div>

              <div className="no-scrollbar flex h-24 w-full items-center justify-center gap-1.5 overflow-x-auto rounded-2xl bg-surface-container-low p-3">
                {stitches.length === 0 ? (
                  <span className="text-sm italic text-on-surface-variant">
                    Klik tombol di bawah untuk membuat simpul pertama! ✨
                  </span>
                ) : (
                  stitches.map((stitch) => (
                    <div
                      key={stitch.id}
                      className="h-9 w-6 shrink-0 animate-pop rounded-full shadow-sm"
                      style={{ backgroundColor: stitch.hex }}
                    />
                  ))
                )}
              </div>

              <div className="mt-4 flex w-full items-center gap-2">
                <button
                  type="button"
                  onClick={addStitch}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-on-primary shadow-[0_8px_20px_rgba(177,14,107,0.2)] transition-all hover:bg-tertiary active:scale-95"
                >
                  <Wand2 className="h-4 w-4" />
                  Hook a Puff Stitch! (+1 Simpul)
                </button>
                <button
                  type="button"
                  onClick={() => setStitches([])}
                  aria-label="Reset simpul"
                  className="rounded-full bg-surface-container-high p-3 text-on-surface transition-colors hover:text-error"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
