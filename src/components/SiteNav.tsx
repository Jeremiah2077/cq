import Link from "next/link";

export function SiteNav({
  rightSlot,
}: {
  rightSlot?: React.ReactNode;
}) {
  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-white/95 backdrop-blur border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-8 h-[72px] flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-[1.6rem] leading-none text-[var(--ink)]"
          >
            China Quest
          </Link>
          <div className="flex items-center gap-6 text-[0.9rem] text-[var(--gray-600)]">
            {rightSlot}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[var(--ink)] text-white/65 mt-auto border-t border-white/[0.08]" style={{ padding: "64px 0 32px" }}>
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <div className="font-display text-[1.35rem] text-white mb-4">China Quest</div>
            <p className="text-[0.88rem] leading-[1.8] max-w-[300px]">A structured educational journey across modern China. Designed for Irish and international schools by Miles Minds Limited, Ireland. Founded 2005.</p>
          </div>
          <div>
            <h5 className="text-white text-[0.85rem] font-semibold uppercase tracking-[1.5px] mb-5">Programmes</h5>
            <ul className="space-y-2.5 text-[0.88rem]">
              <li><a href="/roots.html" className="hover:text-white transition-colors">Roots — History &amp; Culture</a></li>
              <li><a href="/pulse.html" className="hover:text-white transition-colors">Pulse — STEM &amp; Innovation</a></li>
              <li><a href="/horizon.html" className="hover:text-white transition-colors">Horizon — Nature &amp; Landscapes</a></li>
              <li><a href="/tailored.html" className="hover:text-white transition-colors">Custom Programmes</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white text-[0.85rem] font-semibold uppercase tracking-[1.5px] mb-5">For Schools</h5>
            <ul className="space-y-2.5 text-[0.88rem]">
              <li><a href="/why.html" className="hover:text-white transition-colors">Why China Quest</a></li>
              <li><a href="/safety.html" className="hover:text-white transition-colors">Safety &amp; Support</a></li>
              <li><a href="/contact.html" className="hover:text-white transition-colors">Contact / TY Show</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Download Brochure</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white text-[0.85rem] font-semibold uppercase tracking-[1.5px] mb-5">Contact</h5>
            <ul className="space-y-2.5 text-[0.88rem]">
              <li><a href="mailto:info@milesminds.com" className="hover:text-white transition-colors">info@milesminds.com</a></li>
              <li><a href="tel:+353873752491" className="hover:text-white transition-colors">+353 87 375 2491</a></li>
              <li className="mt-4 text-[0.82rem] text-white/35">Miles Minds Limited<br />Company No. 802673<br />Ireland</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.78rem]">
          <span>© {new Date().getFullYear()} China Quest / Miles Minds Limited. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="/privacy.html" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="/terms.html" className="hover:text-white/70 transition-colors">Terms</a>
            <a href="/cookies.html" className="hover:text-white/70 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
