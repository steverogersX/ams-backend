import { cn } from "@/lib/utils";

// Deterministic gradient avatars for societies without an uploaded logo —
// the same name always maps to the same gradient (Slack/Notion-style defaults).
const LOGO_PALETTE: [string, string][] = [
  ["#f43f5e", "#fb923c"],
  ["#8b5cf6", "#d946ef"],
  ["#3b82f6", "#22d3ee"],
  ["#10b981", "#2dd4bf"],
  ["#6366f1", "#38bdf8"],
  ["#ec4899", "#fb7185"],
  ["#f59e0b", "#facc15"],
  ["#22c55e", "#a3e635"],
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function SocietyLogo({
  name,
  initials,
  className,
}: {
  name: string;
  initials: string;
  className?: string;
}) {
  const [from, to] = LOGO_PALETTE[hashString(name) % LOGO_PALETTE.length];
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </span>
  );
}
