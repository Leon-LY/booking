import { auth } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: apiError("请先登录", 401) };
  }
  return { session, error: null };
}
