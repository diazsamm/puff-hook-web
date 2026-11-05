"use client";

import { useState, type ReactNode } from "react";
import { WhatsAppChoiceDialog } from "@/components/public/whatsapp-choice-dialog";
import { getWhatsAppOptions } from "@/lib/whatsapp";

export function WhatsAppLink({
  phones,
  message,
  className = "",
  children,
  label,
}: {
  phones: string[];
  message: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const options = getWhatsAppOptions(phones, message);

  if (options.length === 0) {
    return (
      <button
        type="button"
        aria-label={label}
        className={className}
        onClick={() => window.alert("Nomor WhatsApp belum diatur oleh admin.")}
      >
        {children}
      </button>
    );
  }

  if (options.length === 1) {
    return (
      <a
        href={options[0].href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      <WhatsAppChoiceDialog open={open} options={options} onClose={() => setOpen(false)} />
    </>
  );
}
