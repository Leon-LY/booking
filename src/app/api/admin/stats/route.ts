import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess } from "@/lib/utils";
import { startOfDay, endOfDay } from "date-fns";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const today = new Date();

    const [todayBookings, pendingBookings, completedBookings, totalClients] =
      await Promise.all([
        prisma.booking.count({
          where: {
            date: {
              gte: startOfDay(today),
              lte: endOfDay(today),
            },
          },
        }),
        prisma.booking.count({
          where: { status: "PENDING" },
        }),
        prisma.booking.count({
          where: { status: "COMPLETED" },
        }),
        prisma.client.count(),
      ]);

    // Calculate revenue from completed bookings
    const completedBookingsData = await prisma.booking.findMany({
      where: { status: "COMPLETED" },
      select: {
        service: {
          select: { price: true },
        },
      },
    });

    const totalRevenue = completedBookingsData.reduce(
      (sum, b) => sum + Number(b.service.price),
      0
    );

    return apiSuccess({
      todayBookings,
      pendingBookings,
      completedBookings,
      totalClients,
      totalRevenue,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return apiSuccess({
      todayBookings: 0,
      pendingBookings: 0,
      completedBookings: 0,
      totalClients: 0,
      totalRevenue: 0,
    });
  }
}
