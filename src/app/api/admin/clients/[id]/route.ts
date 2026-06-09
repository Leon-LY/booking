import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            service: {
              select: { id: true, name: true },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!client) {
      return apiError("Client not found", 404);
    }

    return apiSuccess(client);
  } catch (error) {
    console.error("GET /api/admin/clients/[id] error:", error);
    return apiError("Failed to fetch client", 500);
  }
}
