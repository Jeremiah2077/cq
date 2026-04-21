import Link from "next/link";

export function SiteNav({
  rightSlot,
}: {
  rightSlot?: React.ReactNode;
}) {
  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-[var(--ink)] text-white/70 text-[0.78rem]">
        <div className="max-w-[1200px] mx-auto px-8 py-1.5 flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <a href="mailto:info@milesminds.com" className="hover:text-white">
              info@milesminds.com
            </a>
            <a href="tel:+353873752491" className="hover:text-white">
              +353 87 375 2491
            </a>
          </div>
          <div className="flex gap-4 items-center">
            <span>Ireland-based since 2005</span>
          </div>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-8 h-[72px] flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-[1.6rem] leading-none text-[var(--ink)]"
          >
            China Quest
          </Link>
          <div className="flex items-center gap-6 text-[0.9rem] text-[var(--gray-600)]">
            <span className="eyebrow">Pioneer Portal</span>
            {rightSlot}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[var(--ink)] text-white/50 text-[0.78rem] mt-auto">
      <div className="max-w-[1200px] mx-auto px-8 py-6 flex justify-between items-center">
        <span>© {new Date().getFullYear()} Miles Minds Limited · China Quest</span>
        <span className="tracking-[2px] uppercase text-[0.68rem]">
          Pioneer Portal · Confidential
        </span>
      </div>
    </footer>
  );
}
