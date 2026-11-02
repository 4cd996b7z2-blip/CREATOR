import { initials } from "@/lib/utils";

const PALETTES = [
  "bg-marigold text-ink",
  "bg-rani text-white",
  "bg-leaf text-white",
  "bg-[#3b4bb5] text-white",
  "bg-[#7a2fa8] text-white",
];

export function Avatar({ name, seed, size = "md" }: { name: string; seed: string; size?: "md" | "lg" }) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const dim = size === "lg" ? "h-20 w-20 text-3xl" : "h-14 w-14 text-xl";
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-extrabold ${dim} ${PALETTES[h % PALETTES.length]}`}
    >
      {initials(name)}
    </span>
  );
}
