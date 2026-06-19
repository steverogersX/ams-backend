"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { occupancyTypeOptions, roleOptions, type FlatOccupancyType } from "@/lib/usersMockData";

type FormState = {
  name: string;
  email: string;
  phone: string;
  role: string;
  flatNumber: string;
  occupancyType: FlatOccupancyType | "";
  vehicleNumber: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  role: roleOptions[0],
  flatNumber: "",
  occupancyType: "",
  vehicleNumber: "",
};

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email";
  return errors;
}

export function CreateUserForm() {
  const router = useRouter();
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    router.push("/dashboard/users");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="user-name">Full name</Label>
          <Input
            id="user-name"
            placeholder="Priya Sharma"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="user-email">Email</Label>
          <Input
            id="user-email"
            type="email"
            placeholder="priya@society.com"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="user-phone">Phone (optional)</Label>
          <Input
            id="user-phone"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Role</Label>
          <Select value={form.role} onValueChange={(v) => setField("role", v ?? roleOptions[0])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="user-flat">Flat number (optional)</Label>
          <Input
            id="user-flat"
            placeholder="304"
            value={form.flatNumber}
            onChange={(e) => setField("flatNumber", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Relationship to flat</Label>
          <Select
            value={form.occupancyType}
            onValueChange={(v) => setField("occupancyType", (v as FlatOccupancyType | "") ?? "")}
            disabled={!form.flatNumber}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Owner or tenant" />
            </SelectTrigger>
            <SelectContent>
              {occupancyTypeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="user-vehicle">Vehicle number (optional)</Label>
          <Input
            id="user-vehicle"
            placeholder="TS09 AB 1234"
            value={form.vehicleNumber}
            onChange={(e) => setField("vehicleNumber", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Not stored yet — vehicle records aren't part of the database schema.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/users")}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="gap-1.5">
          <UserPlus className="size-3.5" />
          {submitting ? "Sending invite…" : "Send invite"}
        </Button>
      </div>
    </form>
  );
}
