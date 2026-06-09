import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError } from "@/lib/utils";
import { startOfDay, parseISO } from "date-fns";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const holidays = await prisma.holiday.findMany({
      orderBy: { date: "asc" },
    });
    return apiSuccess(holidays);
  } catch (error) {
    console.error("GET /api/admin/holidays error:", error);
    return apiError("Failed to fetch holidays", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { date: dateStr, reason } = body;

    if (!dateStr) {
      return apiError("date is required");
    }

    const date = startOfDay(parseISO(dateStr));

    const holiday = await prisma.holiday.create({
      data: {
        date,
        reason: reason || null,
      },
    });

    return apiSuccess(holiday);
  } catch (error) {
    console.error("POST /api/admin/holidays error:", error);
    return apiError("Failed to create holiday", 500);
  }
}
