"use client";

import * as React from "react";
import { Sun, Sunrise, Sunset, Moon } from "lucide-react";

function resolveGreeting(hour: number) {
  if (hour < 5) return { text: "Good night", icon: Moon };
  if (hour < 12) return { text: "Good morning", icon: Sunrise };
  if (hour < 17) return { text: "Good afternoon", icon: Sun };
  if (hour < 21) return { text: "Good evening", icon: Sunset };
  return { text: "Good night", icon: Moon };
}

export function Greeting({
  name,
  subtitle,
}: {
  name: string;
  subtitle: string;
}) {
  const [greeting, setGreeting] = React.useState(() => resolveGreeting(new Date().getHours()));

  React.useEffect(() => {
    setGreeting(resolveGreeting(new Date().getHours()));
  }, []);

  const Icon = greeting.icon;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon className="size-[18px] text-muted-foreground" />
        <h1 className="text-xl font-semibold tracking-tight text-foreground" suppressHydrationWarning>
          {greeting.text}, {name}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
