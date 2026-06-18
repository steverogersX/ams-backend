"use client";

import * as React from "react";
import { Bell, Check, ChevronDown, Menu } from "lucide-react";

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
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/sidebar";
import { SocietyLogo } from "@/components/society-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { memberSocieties, society } from "@/lib/mock-data";

export function Topbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="sm" className="h-9 gap-2 pl-1.5 font-semibold" />}
          >
            <SocietyLogo
              name={society.name}
              initials={society.initials}
              className="size-6 text-[11px]"
            />
            {society.name}
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Your societies</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {memberSocieties.map((s) => {
                const active = s.name === society.name;
                return (
                  <DropdownMenuItem key={s.name} className="gap-2.5 py-1.5">
                    <SocietyLogo name={s.name} initials={s.initials} className="size-7 text-xs" />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">{s.name}</span>
                      <span className="truncate text-[11px] text-muted-foreground">{s.role}</span>
                    </span>
                    {active && <Check className="ml-auto size-4 shrink-0 text-foreground" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1.5">
        <ModeToggle />

        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="ml-1 rounded-full" />}>
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">PK</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">Padma Konkonapala</span>
                  <span className="text-xs text-muted-foreground">Flat 304 · Owner</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile settings</DropdownMenuItem>
            <DropdownMenuItem>Switch account</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
