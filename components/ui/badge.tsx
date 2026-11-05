import type { ComponentProps } from "react";

export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: ComponentProps<"span"> & { tone?: "primary" | "neutral" }) {
  const tones = {
    primary: "bg-primary text-on-primary",
    neutral: "bg-surface-container-high text-primary",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
