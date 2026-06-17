"use client";

import { QRCodeSVG } from "qrcode.react";
import { CalendarDays, Clock, Home, ShieldCheck, Ticket, UserCheck, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { SocietyLogo } from "@/components/society-logo";
import { currentFlat, society, type VisitorStatus } from "@/lib/mock-data";

const STATUS_DOT: Record<VisitorStatus, string> = {
  expected: "bg-blue-400",
  entered: "bg-amber-400",
  completed: "bg-emerald-400",
  denied: "bg-red-400",
  expired: "bg-zinc-400",
};

const STATUS_LABEL: Record<VisitorStatus, string> = {
  expected: "Expected",
  entered: "Inside",
  completed: "Completed",
  denied: "Denied",
  expired: "Expired",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function Detail({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-3.5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span
          className={cn(
            "truncate text-sm font-medium text-foreground",
            mono && "font-mono text-[13px]",
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export type VisitorPassData = {
  name: string;
  date: string;
  time: string;
  code: string;
  status: VisitorStatus;
};

export function VisitorPass({ name, date, time, code, status }: VisitorPassData) {
  const qrValue = `ROOSTER-PASS|${code}|${name}|${date} ${time}|${society.name}`;
  const host = currentFlat.ownerName.split(" ")[0];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 bg-foreground px-5 py-4 text-background">
        <SocietyLogo name={society.name} initials={society.initials} className="size-9 text-sm" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{society.name}</div>
          <div className="truncate text-xs text-background/60">{society.location}</div>
        </div>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-background/15 px-2.5 py-1 text-[11px] font-medium">
          <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2.5 px-5 pb-5 pt-6">
        <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
          <QRCodeSVG value={qrValue} size={150} level="M" />
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Show this QR at the gate
        </p>
      </div>

      <div className="relative">
        <div className="border-t border-dashed border-border" />
        <span className="absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-popover" />
        <span className="absolute right-0 top-0 size-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-popover" />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-5 py-5">
        <Detail icon={UserRound} label="Guest" value={name} />
        <Detail
          icon={Home}
          label="Visiting"
          value={`Flat ${currentFlat.flatNumber} · ${currentFlat.apartmentName}`}
        />
        <Detail icon={CalendarDays} label="Date" value={formatDate(date)} />
        <Detail icon={Clock} label="Time" value={formatTime(time)} />
        <Detail icon={UserCheck} label="Host" value={host} />
        <Detail icon={Ticket} label="Pass code" value={code} mono />
      </div>
    </div>
  );
}
