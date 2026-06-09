import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return apiError("服务未找到", 404);
    }

    return apiSuccess(service);
  } catch (error) {
    console.error("GET /api/services/[id] error:", error);
    return apiError("获取服务详情失败", 500);
  }
}
