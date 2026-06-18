"use client";

import { useRouter } from "next/navigation";
import { Bird } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/modeToggle";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function PlatformTopbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const displayName = user?.displayName ?? user?.email ?? "Platform admin";

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <Bird className="size-4" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">Rooster</span>
        <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Platform
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="ml-1 rounded-full" />}>
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{displayName}</span>
                  <span className="text-xs text-muted-foreground">Super admin</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
