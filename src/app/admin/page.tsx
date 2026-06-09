import { StatsCards } from "@/components/admin/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDisplayDate } from "@/lib/utils";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getDashboardData() {
  const today = new Date();

  const [
    todayBookings,
    pendingBookings,
    completedBookings,
    totalClients,
    recentBookingsRaw,
    completedBookingsData,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          lte: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        },
      },
    }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.client.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true } },
        client: { select: { name: true, phone: true } },
      },
    }),
    prisma.booking.findMany({
      where: { status: "COMPLETED" },
      select: {
        service: { select: { price: true } },
      },
    }),
  ]);

  const totalRevenue = completedBookingsData.reduce(
    (sum, b) => sum + Number(b.service.price),
    0
  );

  const recentBookings = recentBookingsRaw.map((b) => ({
    ...b,
    date: b.date.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));

  return {
    stats: { todayBookings, pendingBookings, completedBookings, totalClients, totalRevenue },
    recentBookings,
  };
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "default",
  CONFIRMED: "secondary",
  COMPLETED: "outline",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

export default async function AdminDashboardPage() {
  const { stats, recentBookings } = await getDashboardData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <StatsCards stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No bookings yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Client</th>
                    <th className="pb-3 font-medium text-muted-foreground">Service</th>
                    <th className="pb-3 font-medium text-muted-foreground">Date</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="font-medium">{booking.client.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.client.phone}
                        </div>
                      </td>
                      <td className="py-3">{booking.service.name}</td>
                      <td className="py-3">
                        {formatDisplayDate(booking.date)} {booking.startTime}
                      </td>
                      <td className="py-3">
                        <Badge variant={statusVariant[booking.status]}>
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
