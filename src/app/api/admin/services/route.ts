import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
    return apiSuccess(services);
  } catch (error) {
    console.error("GET /api/admin/services error:", error);
    return apiError("Failed to fetch services", 500);
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { name, description, summary, price, duration, imageUrl, category, sortOrder } = body;

    if (!name || !description || !summary) {
      return apiError("name, description, and summary are required");
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        summary,
        price: price || 0,
        duration: duration || 60,
        imageUrl: imageUrl || null,
        category: category || "general",
        sortOrder: sortOrder || 0,
      },
    });

    return apiSuccess(service);
  } catch (error) {
    console.error("POST /api/admin/services error:", error);
    return apiError("Failed to create service", 500);
  }
}
