import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { RolePermissionForm } from "@/components/roles/rolePermissionForm";
import { SetBreadcrumbTitle } from "@/components/breadcrumbs";
import { roles } from "@/lib/rolesMockData";

export default async function EditRolePage({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  const role = roles.find((r) => r.id === roleId);
  if (!role) notFound();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <SetBreadcrumbTitle title={role.name} />
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/roles"
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to roles
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{role.name}</h1>
          <p className="text-sm text-muted-foreground">
            {role.isSystem
              ? "System roles are fixed and cannot be edited."
              : "Update the name, description, and permissions for this role."}
          </p>
        </div>
      </div>

      <RolePermissionForm role={role} />
    </div>
  );
}
