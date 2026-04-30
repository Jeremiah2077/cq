"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SUPABASE_URL = "https://eetjeyfyrwwoeeujxvmo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldGpleWZ5cnd3b2VldWp4dm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODQwMjQsImV4cCI6MjA5MjM2MDAyNH0.VZIxzI0X1g7p1GgV-AyMTRRTaGpT1mxb_kwP91lfcEs";

function getSessionId() {
  let sid = sessionStorage.getItem("cq_sid");
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("cq_sid", sid);
  }
  return sid;
}

function track(pathname: string, eventType: string, eventTarget?: string) {
  fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      screen_width: screen.width,
      session_id: getSessionId(),
      event_type: eventType,
      event_target: eventTarget || null,
    }),
  }).catch(() => {});
}

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track(pathname, "pageview");

    // Scroll depth tracking
    const scrollMarks: Record<number, boolean> = {};
    function onScroll() {
      const scrollPct = Math.round(
        ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100
      );
      [25, 50, 75, 100].forEach((mark) => {
        if (scrollPct >= mark && !scrollMarks[mark]) {
          scrollMarks[mark] = true;
          track(pathname, "scroll", mark + "%");
        }
      });
    }
    window.addEventListener("scroll", onScroll);

    // Click tracking
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement).closest("a, button");
      if (!el) return;
      const text = el.textContent?.trim().slice(0, 60) || "";
      const href = el.getAttribute("href") || "";

      if (
        el.classList.contains("btn-primary") ||
        el.classList.contains("nav-cta") ||
        el.tagName === "BUTTON"
      ) {
        track(pathname, "click", text);
      }

      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        track(pathname, "click", href);
      }
    }
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  return null;
}
