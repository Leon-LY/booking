import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }
    return apiSuccess(settingsMap);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return apiError("获取站点设置失败", 500);
  }
}
