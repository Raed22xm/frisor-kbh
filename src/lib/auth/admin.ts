import "server-only";

import { cache } from "react";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getCurrentAdmin = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const [admin] = await getDb()
    .select({
      id: adminUsers.id,
      authUserId: adminUsers.authUserId,
      email: adminUsers.email,
      fullName: adminUsers.fullName,
      role: adminUsers.role,
    })
    .from(adminUsers)
    .where(and(eq(adminUsers.authUserId, data.user.id), eq(adminUsers.isActive, true)))
    .limit(1);

  return admin ?? null;
});

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");
  return admin;
}
