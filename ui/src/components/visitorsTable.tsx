"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  CalendarDays,
  CircleCheck,
  CircleDot,
  CircleSlash,
  CircleX,
  Clock,
  DoorOpen,
  ListFilter,
  QrCode,
  Search,
  Ticket,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/dataTableColumnHeader";
import { DataTablePagination } from "@/components/dataTablePagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VisitorPass } from "@/components/visitorPass";
import { Visitor, VisitorStatus, visitors_log } from "@/lib/mockData";

const STATUS_META: Record<
  VisitorStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  expected: { label: "Expected", color: "text-blue-600 dark:text-blue-400", icon: Clock },
  entered: { label: "Inside", color: "text-amber-600 dark:text-amber-400", icon: DoorOpen },
  completed: {
    label: "Completed",
    color: "text-emerald-600 dark:text-emerald-400",
    icon: CircleCheck,
  },
  denied: { label: "Denied", color: "text-red-600 dark:text-red-400", icon: CircleX },
  expired: { label: "Expired", color: "text-muted-foreground", icon: CircleSlash },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
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

const columns: ColumnDef<Visitor>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        icon={UserRound}
        label="Visitor"
        sorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UserRound className="size-3.5" />
        </span>
        <span className="truncate font-medium text-foreground">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader
        icon={CalendarDays}
        label="Date"
        sorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
        {formatDate(row.original.date)}
      </span>
    ),
  },
  {
    accessorKey: "time",
    header: () => <DataTableColumnHeader icon={Clock} label="Time" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap tabular-nums text-muted-foreground">
        {formatTime(row.original.time)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <DataTableColumnHeader icon={CircleDot} label="Status" />,
    cell: ({ row }) => {
      const meta = STATUS_META[row.original.status];
      const Icon = meta.icon;
      return (
        <div className={cn("flex items-center gap-1.5 font-medium", meta.color)}>
          <Icon className="size-3.5" />
          <span className="whitespace-nowrap">{meta.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "passCode",
    header: () => <DataTableColumnHeader icon={Ticket} label="Pass" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">{row.original.passCode}</span>
    ),
  },
  {
    id: "action",
    header: () => null,
    cell: () => (
      <div className="flex justify-end">
        <span className="flex items-center gap-1 text-xs text-muted-foreground/70 transition-colors group-hover/row:text-foreground">
          <QrCode className="size-4" />
        </span>
      </div>
    ),
  },
];

const STATUS_FILTERS: { label: string; value: VisitorStatus | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "Expected", value: "expected" },
  { label: "Inside", value: "entered" },
  { label: "Completed", value: "completed" },
  { label: "Denied", value: "denied" },
  { label: "Expired", value: "expired" },
];

export function VisitorsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
  const [statusFilter, setStatusFilter] = React.useState<VisitorStatus | "all">("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Visitor | null>(null);

  const data = React.useMemo(() => {
    return visitors_log.filter((v) => {
      const matchesStatus = statusFilter === "all" || v.status === statusFilter;
      const matchesSearch = v.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, search]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const activeFilterLabel =
    STATUS_FILTERS.find((f) => f.value === statusFilter)?.label ?? "All statuses";

  return (
    <>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="flex flex-col gap-2.5 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-foreground">Visitor log</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search visitors…"
                className="h-8 w-44 pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" className="gap-1.5" />}
              >
                <ListFilter className="size-3.5" />
                {activeFilterLabel}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {STATUS_FILTERS.map((f) => (
                  <DropdownMenuItem key={f.value} onClick={() => setStatusFilter(f.value)}>
                    {f.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-9 bg-muted/40 px-4 text-xs">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setSelected(row.original)}
                  className="group/row cursor-pointer border-border hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 align-middle text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No visitors match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DataTablePagination table={table} itemLabel="visitor" showPageSize />
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Visitor pass</DialogTitle>
            <DialogDescription>Entry pass details for this visitor.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="my-1">
              <VisitorPass
                name={selected.name}
                date={selected.date}
                time={selected.time}
                code={selected.passCode}
                status={selected.status}
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button type="button" />}>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
