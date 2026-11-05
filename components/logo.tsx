import Image from "next/image";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Puff Hook"
      width={72}
      height={72}
      className={className}
      unoptimized
      priority
    />
  );
}
