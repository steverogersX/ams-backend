import { Greeting } from "@/components/greeting";
import { ActivityFeed } from "@/components/activity-feed";
import { BillsChart } from "@/components/bills-chart";
import { ComplaintStatusChart } from "@/components/complaint-status-chart";
import { ComplaintsTable } from "@/components/complaints-table";
import { NoticesFeed } from "@/components/notices-feed";
import { currentFlat } from "@/lib/mock-data";

export default function DashboardPage() {
  const firstName = currentFlat.ownerName.split(" ")[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Greeting
        name={firstName}
        subtitle={`Here's what's happening at Flat ${currentFlat.flatNumber}, ${currentFlat.apartmentName} today.`}
      />

      <ActivityFeed />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <BillsChart />
        <ComplaintStatusChart />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ComplaintsTable compact />
        </div>
        <NoticesFeed />
      </div>
    </div>
  );
}
