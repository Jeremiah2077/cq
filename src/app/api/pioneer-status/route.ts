import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ applied: false });
  }

  const { data } = await supabase
    .from("applications")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ applied: !!data, status: data?.status ?? null });
}
