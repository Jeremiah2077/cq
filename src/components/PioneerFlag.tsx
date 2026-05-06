"use client";

import { useEffect } from "react";

export function PioneerFlag({ applied }: { applied: boolean }) {
  useEffect(() => {
    if (applied) {
      localStorage.setItem("cq_pioneer", "1");
    }
  }, [applied]);
  return null;
}
