import type { ReactNode } from "react";
import { SiteNav, SiteFooter } from "./SiteNav";

export function AuthShell({
  eyebrow = "Pioneer Programme",
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <SiteNav />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[460px]">
          <div className="mb-6 flex justify-center">
            <span className="eyebrow eyebrow-accent">{eyebrow}</span>
          </div>
          <h1 className="font-display text-[2.2rem] leading-[1.15] text-[var(--ink)] text-center mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-center text-[var(--gray-500)] text-[0.95rem] leading-[1.7] mb-8 max-w-sm mx-auto">
              {subtitle}
            </p>
          )}

          <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-8 shadow-[0_4px_30px_rgba(15,25,35,0.04)]">
            {children}
          </div>

          {footer && (
            <div className="mt-6 text-center text-[0.88rem] text-[var(--gray-500)]">
              {footer}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
