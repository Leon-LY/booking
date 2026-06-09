import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNote } = body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNote !== undefined && { adminNote }),
      },
      include: {
        service: {
          select: { id: true, name: true, duration: true, price: true },
        },
        client: {
          select: { id: true, name: true, phone: true, email: true },
        },
      },
    });

    return apiSuccess(booking);
  } catch (error) {
    console.error("PATCH /api/admin/bookings/[id] error:", error);
    return apiError("更新预约失败", 500);
  }
}
