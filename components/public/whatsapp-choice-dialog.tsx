"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import type { WhatsAppOption } from "@/lib/whatsapp";

export function WhatsAppChoiceDialog({
  open,
  options,
  onClose,
}: {
  open: boolean;
  options: WhatsAppOption[];
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-on-surface/40 p-4 backdrop-blur-sm sm:items-center"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-choice-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-5 shadow-lift"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="whatsapp-choice-title"
              className="font-display text-lg font-semibold text-on-surface"
            >
              Pilih admin
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
              Pesan akan dikirim ke salah satu nomor WhatsApp berikut.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <a
              key={option.phone}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant/60 bg-surface-container-low px-4 py-3 transition-colors hover:border-primary hover:bg-secondary-fixed"
            >
              <span className="flex flex-col">
                <span className="text-sm font-bold text-on-surface">{option.label}</span>
                <span className="text-[11px] text-on-surface-variant">{option.display}</span>
              </span>
              <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-full bg-surface-container-high py-2.5 text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary"
        >
          Batal
        </button>
      </div>
    </div>,
    document.body
  );
}
