import { cn, gradientForName } from "@/lib/utils";

export function SocietyLogo({
  name,
  initials,
  className,
}: {
  name: string;
  initials: string;
  className?: string;
}) {
  const [from, to] = gradientForName(name);
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
