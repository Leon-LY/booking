import { auth } from "@/lib/auth";
import { apiError } from "@/lib/utils";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: apiError("Unauthorized", 401) };
  }
  return { session, error: null };
}
