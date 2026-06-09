import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const timeslots = await prisma.timeSlot.findMany({
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return apiSuccess(timeslots);
  } catch (error) {
    console.error("GET /api/admin/timeslots error:", error);
    return apiError("Failed to fetch time slots", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return apiError("dayOfWeek, startTime, and endTime are required");
    }

    const timeslot = await prisma.timeSlot.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
      },
    });

    return apiSuccess(timeslot);
  } catch (error) {
    console.error("POST /api/admin/timeslots error:", error);
    return apiError("Failed to create time slot", 500);
  }
}
