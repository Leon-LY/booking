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
    const { name, description, summary, price, duration, imageUrl, category, isActive, sortOrder } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(summary !== undefined && { summary }),
        ...(price !== undefined && { price }),
        ...(duration !== undefined && { duration }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return apiSuccess(service);
  } catch (error) {
    console.error("PUT /api/admin/services/[id] error:", error);
    return apiError("Failed to update service", 500);
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

    // Check if service has bookings
    const bookingCount = await prisma.booking.count({
      where: { serviceId: id },
    });

    if (bookingCount > 0) {
      // Soft delete: deactivate instead
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });
      return apiSuccess({ message: "Service deactivated (has existing bookings)" });
    }

    await prisma.service.delete({ where: { id } });
    return apiSuccess({ message: "Service deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/services/[id] error:", error);
    return apiError("Failed to delete service", 500);
  }
}
