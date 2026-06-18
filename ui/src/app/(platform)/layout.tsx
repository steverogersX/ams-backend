"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { PlatformTopbar } from "@/components/platformTopbar";
import { useAuth } from "@/hooks/useAuth";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    else if (status === "authenticated" && !user?.isSuperAdmin) router.replace("/dashboard");
  }, [status, user, router]);

  if (status !== "authenticated" || !user?.isSuperAdmin) return null;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <PlatformTopbar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
