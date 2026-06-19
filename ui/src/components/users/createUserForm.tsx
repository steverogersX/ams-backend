"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, UserPlus } from "lucide-react";
import type { RoleResponse } from "@shared/index";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { listRolesRequest } from "@/lib/roleApi";
import { ApiClientError } from "@/lib/apiClient";
import type { VehicleDetail } from "@/lib/usersMockData";

type FormState = {
  name: string;
  email: string;
  phone: string;
  flatNumber: string;
  occupation: string;
  parkingSlot: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  flatNumber: "",
  occupation: "",
  parkingSlot: "",
};

const EMPTY_VEHICLE: VehicleDetail = {
  registrationNumber: "",
  type: "car",
  make: "",
  model: "",
  color: "",
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
  const { token, activeSociety } = useAuth();
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [roles, setRoles] = React.useState<RoleResponse[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<Set<string>>(new Set());
  const [rolesError, setRolesError] = React.useState<string | undefined>();
  const [vehicles, setVehicles] = React.useState<VehicleDetail[]>([]);
  const [formError, setFormError] = React.useState<string | undefined>();
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!token || !activeSociety) return;
    listRolesRequest(token, activeSociety.societyToken, activeSociety.societyId)
      .then(setRoles)
      .catch((err) =>
        setRolesError(err instanceof ApiClientError ? err.message : "Failed to load roles"),
      );
  }, [token, activeSociety]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleRole(roleId: string, checked: boolean) {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(roleId);
      else next.delete(roleId);
      return next;
    });
  }

  function addVehicle() {
    setVehicles((prev) => [...prev, { ...EMPTY_VEHICLE }]);
  }

  function removeVehicle(index: number) {
    setVehicles((prev) => prev.filter((_, i) => i !== index));
  }

  function setVehicleField<K extends keyof VehicleDetail>(
    index: number,
    key: K,
    value: VehicleDetail[K],
  ) {
    setVehicles((prev) => prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (selectedRoleIds.size === 0) {
      setFormError("Select at least one role");
      return;
    }

    setFormError(undefined);
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    router.push("/dashboard/users");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>User details</CardTitle>
          <CardDescription>Basic contact information for the invite.</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="user-flat">Flat number (optional)</Label>
              <Input
                id="user-flat"
                placeholder="304"
                value={form.flatNumber}
                onChange={(e) => setField("flatNumber", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Not linked to a flat record yet — owner/tenant assignment needs a flats lookup.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-occupation">Occupation (optional)</Label>
              <Input
                id="user-occupation"
                placeholder="Software Engineer"
                value={form.occupation}
                onChange={(e) => setField("occupation", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-parking">Assigned parking slot (optional)</Label>
              <Input
                id="user-parking"
                placeholder="B-12"
                value={form.parkingSlot}
                onChange={(e) => setField("parkingSlot", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vehicles</CardTitle>
              <CardDescription>Vehicles owned by this user (optional).</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addVehicle}>
              <Plus className="size-3.5" />
              Add vehicle
            </Button>
          </div>
        </CardHeader>
        {vehicles.length > 0 && (
          <CardContent className="flex flex-col gap-4">
            {vehicles.map((vehicle, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Vehicle {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => removeVehicle(index)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label>Registration number</Label>
                    <Input
                      placeholder="TS09 AB 1234"
                      value={vehicle.registrationNumber}
                      onChange={(e) => setVehicleField(index, "registrationNumber", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Type</Label>
                    <Select
                      value={vehicle.type}
                      onValueChange={(v) =>
                        setVehicleField(index, "type", (v as VehicleDetail["type"]) ?? "car")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(value: string) => (value === "car" ? "Car" : "Two-wheeler")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="two_wheeler">Two-wheeler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Make</Label>
                    <Input
                      placeholder="Hyundai"
                      value={vehicle.make}
                      onChange={(e) => setVehicleField(index, "make", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Model</Label>
                    <Input
                      placeholder="Creta"
                      value={vehicle.model}
                      onChange={(e) => setVehicleField(index, "model", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Color</Label>
                    <Input
                      placeholder="White"
                      value={vehicle.color}
                      onChange={(e) => setVehicleField(index, "color", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            {selectedRoleIds.size} of {roles.length} roles selected. A user can hold more than one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rolesError ? (
            <p className="text-sm text-destructive">{rolesError}</p>
          ) : roles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading roles…</p>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-start gap-2.5 rounded-md p-1.5 text-sm hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selectedRoleIds.has(role.id)}
                    onCheckedChange={(checked) => toggleRole(role.id, checked === true)}
                    className="mt-0.5"
                  />
                  <span className="flex flex-col">
                    <span className="font-medium text-foreground">{role.name}</span>
                    {role.description && (
                      <span className="text-xs text-muted-foreground">{role.description}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
        {formError ? <p className="text-xs text-destructive">{formError}</p> : <span />}
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/users")}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="gap-1.5">
            <UserPlus className="size-3.5" />
            {submitting ? "Sending invite…" : "Send invite"}
          </Button>
        </div>
      </div>
    </form>
  );
}
