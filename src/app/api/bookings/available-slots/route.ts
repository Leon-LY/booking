import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, generateTimeSlots, hasOverlap } from "@/lib/utils";
import { startOfDay, endOfDay, format, getDay, parseISO } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");

    if (!dateStr || !serviceId) {
      return apiError("缺少必要参数：date 和 serviceId");
    }

    const date = parseISO(dateStr);
    const today = startOfDay(new Date());

    // Can't book in the past
    if (startOfDay(date) < today) {
      return apiSuccess([]);
    }

    // Check holiday
    const holiday = await prisma.holiday.findUnique({
      where: { date: startOfDay(date) },
    });

    if (holiday) {
      return apiSuccess([]);
    }

    // Get service duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return apiError("服务未找到", 404);
    }

    // Get day of week
    const dayOfWeek = getDay(date);

    // Get active time slots for this day
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        dayOfWeek,
        isActive: true,
      },
      orderBy: { startTime: "asc" },
    });

    if (timeSlots.length === 0) {
      return apiSuccess([]);
    }

    // Generate candidate slots from time slots
    const candidates: Array<{ startTime: string; endTime: string }> = [];
    for (const slot of timeSlots) {
      const generated = generateTimeSlots(
        slot.startTime,
        slot.endTime,
        service.duration
      );
      candidates.push(...generated);
    }

    // Get existing bookings for this date
    const existingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Filter out slots that overlap with existing bookings
    const availableSlots = candidates.filter((candidate) => {
      return !existingBookings.some((booking) =>
        hasOverlap(
          candidate.startTime,
          candidate.endTime,
          booking.startTime,
          booking.endTime
        )
      );
    });

    return apiSuccess(availableSlots);
  } catch (error) {
    console.error("GET /api/bookings/available-slots error:", error);
    return apiError("获取可用时段失败", 500);
  }
}
