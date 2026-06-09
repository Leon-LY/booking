import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return apiSuccess(services);
  } catch (error) {
    console.error("GET /api/services error:", error);
    return apiError("Failed to fetch services", 500);
  }
}
