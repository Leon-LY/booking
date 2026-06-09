import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError } from "@/lib/utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.holiday.delete({ where: { id: parseInt(id) } });
    return apiSuccess({ message: "Holiday deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/holidays/[id] error:", error);
    return apiError("Failed to delete holiday", 500);
  }
}
