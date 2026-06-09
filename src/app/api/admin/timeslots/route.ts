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
    return apiError("获取时段列表失败", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return apiError("星期、开始时间和结束时间不能为空");
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
    return apiError("创建时段失败", 500);
  }
}
