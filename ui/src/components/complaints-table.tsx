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
import { ArrowDown, ArrowRight, ArrowUp, ListFilter } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTablePagination } from "@/components/data-table-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Complaint, ComplaintPriority, ComplaintStatus, complaints } from "@/lib/mock-data";

const STATUS_DOT: Record<ComplaintStatus, string> = {
  open: "bg-blue-500",
  in_progress: "bg-amber-500",
  resolved: "bg-emerald-500",
  escalated: "bg-red-500",
};

const STATUS_LABEL: Record<ComplaintStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  escalated: "Escalated",
};

const PRIORITY_META: Record<
  ComplaintPriority,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  high: { label: "High", color: "text-red-600 dark:text-red-400", icon: ArrowUp },
  medium: { label: "Medium", color: "text-amber-600 dark:text-amber-400", icon: ArrowRight },
  low: { label: "Low", color: "text-muted-foreground", icon: ArrowDown },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const columns: ColumnDef<Complaint>[] = [
  {
    accessorKey: "ticketNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Ticket"
        sorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium tabular-nums text-foreground">
        {row.original.ticketNumber}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: () => <DataTableColumnHeader label="Issue" />,
    cell: ({ row }) => (
      <div className="flex min-w-0 max-w-[240px] flex-col">
        <span className="truncate font-medium text-foreground">{row.original.title}</span>
        <span className="truncate text-xs text-muted-foreground">{row.original.category}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <DataTableColumnHeader label="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2">
          <span className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[status])} />
          <span className="whitespace-nowrap text-foreground">{STATUS_LABEL[status]}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: () => <DataTableColumnHeader label="Priority" />,
    cell: ({ row }) => {
      const meta = PRIORITY_META[row.original.priority];
      const Icon = meta.icon;
      return (
        <div className={cn("flex items-center gap-1.5 font-medium", meta.color)}>
          <Icon className="size-3.5" />
          {meta.label}
        </div>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Raised"
        sorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "assignedTo",
    accessorKey: "assignedTo",
    header: () => <DataTableColumnHeader label="Assigned to" />,
    cell: ({ row }) => {
      const assignee = row.original.assignedTo;
      if (!assignee) {
        return <span className="whitespace-nowrap text-muted-foreground">Unassigned</span>;
      }
      return (
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback className="text-[10px]">{assignee.initials}</AvatarFallback>
          </Avatar>
          <span className="whitespace-nowrap text-foreground">{assignee.name}</span>
        </div>
      );
    },
  },
];

const STATUS_FILTERS: { label: string; value: ComplaintStatus | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Escalated", value: "escalated" },
];

export function ComplaintsTable({ compact = false }: { compact?: boolean }) {
  const [sorting, setSorting] = React.useState<SortingState>(
    compact ? [] : [{ id: "createdAt", desc: true }],
  );
  const [statusFilter, setStatusFilter] = React.useState<ComplaintStatus | "all">("all");

  const data = React.useMemo(
    () =>
      statusFilter === "all" ? complaints : complaints.filter((c) => c.status === statusFilter),
    [statusFilter],
  );

  const visibleColumns = React.useMemo(
    () => (compact ? columns.filter((c) => c.id !== "createdAt" && c.id !== "assignedTo") : columns),
    [compact],
  );

  const table = useReactTable({
    data,
    columns: visibleColumns,
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
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Recent complaints</h3>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
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

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-9 bg-muted/40 px-4 text-xs first:pl-4 last:pr-4"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer border-border hover:bg-muted/50">
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
                No complaints match this filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} itemLabel="complaint" />
    </div>
  );
}
