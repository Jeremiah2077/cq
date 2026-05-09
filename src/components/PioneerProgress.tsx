"use client";

import { useState } from "react";

type MilestoneItem = {
  phase: string;
  title: string;
  detail: string;
  target: string;
  status: "done" | "active" | "upcoming";
};

export function PioneerProgress({
  statusLabel,
  completion,
  hint,
  steps,
  milestones,
}: {
  statusLabel: string;
  completion: number;
  hint: string;
  steps: string[];
  milestones: MilestoneItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left text-[0.85rem] font-semibold text-[var(--accent)] cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
      >
        View status
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-[var(--gray-200)] space-y-5 animate-[fadeIn_0.2s_ease]">
          {/* Status + progress bar */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[0.7rem] tracking-[2px] uppercase font-semibold text-[var(--gray-500)]">
                {statusLabel}
              </span>
              <span className="font-display text-[1.1rem] text-[var(--accent)]">
                {completion}%
              </span>
            </div>
            <div className="h-[3px] w-full bg-[var(--gray-100)] overflow-hidden rounded-full">
              <div
                className="h-full bg-[var(--accent)] transition-[width] duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          {/* Current hint */}
          <p className="text-[0.88rem] text-[var(--gray-600)] leading-[1.65]">
            {hint}
          </p>

          {/* Next steps */}
          <div>
            <div className="text-[0.7rem] tracking-[2px] uppercase font-semibold text-[var(--accent)] mb-2">
              Next steps
            </div>
            <ul className="space-y-2">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-[0.85rem] text-[var(--gray-600)] leading-[1.6]">
                  <span className="mt-[8px] inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini milestones */}
          <div className="pt-2">
            <div className="text-[0.7rem] tracking-[2px] uppercase font-semibold text-[var(--gray-400)] mb-3">
              Milestones
            </div>
            <div className="space-y-2.5">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      background:
                        m.status === "done" ? "#1b3a5c" : m.status === "active" ? "#c4683c" : "#c8c4bd",
                    }}
                  />
                  <span className={`text-[0.82rem] ${m.status === "active" ? "text-[var(--ink)] font-semibold" : "text-[var(--gray-500)]"}`}>
                    {m.title}
                  </span>
                  <span className="ml-auto text-[0.72rem] text-[var(--gray-400)]">
                    {m.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
