import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full gap-2 overflow-hidden bg-muted/40 p-2">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
