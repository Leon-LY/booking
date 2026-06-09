import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError } from "@/lib/utils";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { dayOfWeek, startTime, endTime, isActive } = body;

    const timeslot = await prisma.timeSlot.update({
      where: { id: parseInt(id) },
      data: {
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return apiSuccess(timeslot);
  } catch (error) {
    console.error("PUT /api/admin/timeslots/[id] error:", error);
    return apiError("更新时段失败", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.timeSlot.delete({ where: { id: parseInt(id) } });
    return apiSuccess({ message: "Time slot deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/timeslots/[id] error:", error);
    return apiError("删除时段失败", 500);
  }
}
