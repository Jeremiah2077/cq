"use client";

import { useEffect } from "react";
import Link from "next/link";

export function ClearSessionAndRedirect() {
  useEffect(() => {
    // Clear all Supabase auth cookies
    document.cookie.split(";").forEach((c) => {
      const name = c.trim().split("=")[0];
      if (name.startsWith("sb-")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  }, []);

  return (
    <Link href="/" className="btn-primary w-full text-center block">
      Go to homepage
    </Link>
  );
}
