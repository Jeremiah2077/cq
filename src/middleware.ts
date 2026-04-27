import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*", "/onboarding", "/forgot-password", "/reset-password", "/verify"],
};
