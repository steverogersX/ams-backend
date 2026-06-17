"use client";

import * as React from "react";
import { format } from "date-fns";
import { UserPlus, CalendarDays, Clock, Copy, Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisitorPass, type VisitorPassData } from "@/components/visitor-pass";

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 ? 30 : 0;
  const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const label = `${hour}:${String(m).padStart(2, "0")} ${period}`;
  return { value, label };
});

function timeLabel(value: string) {
  return TIME_SLOTS.find((t) => t.value === value)?.label ?? value;
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `GVR-${out}`;
}

export function InviteVisitorDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [time, setTime] = React.useState("");
  const [pass, setPass] = React.useState<VisitorPassData | null>(null);
  const [copied, setCopied] = React.useState(false);

  const reset = () => {
    setName("");
    setDate(undefined);
    setTime("");
    setPass(null);
    setCopied(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setTimeout(reset, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !time) return;
    setPass({
      name: name.trim(),
      date: format(date, "yyyy-MM-dd"),
      time,
      code: generateCode(),
      status: "expected",
    });
  };

  const copyCode = () => {
    if (!pass) return;
    navigator.clipboard?.writeText(pass.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <UserPlus className="size-4" />
        Invite visitor
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {!pass ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Invite a visitor</DialogTitle>
              <DialogDescription>
                Generate a digital entry pass with a QR code for the gate.
              </DialogDescription>
            </DialogHeader>

            <div className="my-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="visitor-name">Visitor name</Label>
                <Input
                  id="visitor-name"
                  placeholder="e.g. Ramesh (Amazon delivery)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Date</Label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2 px-2.5 font-normal"
                        />
                      }
                    >
                      <CalendarDays className="size-4 text-muted-foreground" />
                      {date ? (
                        format(date, "d MMM yyyy")
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        defaultMonth={date}
                        disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                        onSelect={(d) => {
                          setDate(d);
                          setDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Time</Label>
                  <Select value={time} onValueChange={(v) => setTime(v as string)}>
                    <SelectTrigger className="w-full">
                      <Clock className="size-4 text-muted-foreground" />
                      <SelectValue placeholder="Pick a time">
                        {(value: string) =>
                          value ? (
                            timeLabel(value)
                          ) : (
                            <span className="text-muted-foreground">Pick a time</span>
                          )
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
              <Button type="submit" disabled={!name.trim() || !date || !time}>
                Generate pass
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Visitor pass ready</DialogTitle>
              <DialogDescription>Share this QR — the guard scans it at the gate.</DialogDescription>
            </DialogHeader>

            <div className="my-1">
              <VisitorPass {...pass} />
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {pass.code}
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" className="gap-1.5" onClick={reset}>
                <Plus className="size-4" />
                Invite another
              </Button>
              <DialogClose render={<Button type="button" />}>Done</DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
