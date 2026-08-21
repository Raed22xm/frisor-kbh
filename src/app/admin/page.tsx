import { CalendarDays, DollarSign, Users, TrendingUp } from "lucide-react";
import { Scorecard } from "@/components/admin/Scorecard";
import { BookingTrendsChart } from "@/components/admin/BookingTrendsChart";
import { ServicePopularityChart } from "@/components/admin/ServicePopularityChart";
import { UpcomingAppointmentsTable } from "@/components/admin/UpcomingAppointmentsTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of today's business and upcoming appointments.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Scorecard
          title="Total Bookings (Today)"
          value="18"
          trend={{ value: "12%", positive: true }}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <Scorecard
          title="Revenue (Est. Today)"
          value="6,450 kr"
          trend={{ value: "8%", positive: true }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <Scorecard
          title="New Clients"
          value="4"
          trend={{ value: "2", positive: true }}
          icon={<Users className="h-5 w-5" />}
        />
        <Scorecard
          title="Utilization Rate"
          value="85%"
          trend={{ value: "5%", positive: false }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingTrendsChart />
        </div>
        <div>
          <ServicePopularityChart />
        </div>
      </div>

      {/* Table Row */}
      <div>
        <UpcomingAppointmentsTable />
      </div>
    </div>
  );
}
