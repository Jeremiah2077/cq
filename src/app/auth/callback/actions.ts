"use server";

import { createClient } from "@/lib/supabase/server";
import { bootstrapProfileFromUser } from "@/lib/profile";

export async function bootstrapAfterCallback() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await bootstrapProfileFromUser(supabase, user);
  }
}
