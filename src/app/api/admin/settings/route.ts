import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }
    return apiSuccess(settingsMap);
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return apiError("获取设置失败", 500);
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { settings } = body as { settings: Record<string, string> };

    if (!settings || typeof settings !== "object") {
      return apiError("settings 对象不能为空");
    }

    // Upsert each setting
    const promises = Object.entries(settings).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await Promise.all(promises);

    return apiSuccess({ message: "Settings updated" });
  } catch (error) {
    console.error("PUT /api/admin/settings error:", error);
    return apiError("更新设置失败", 500);
  }
}
