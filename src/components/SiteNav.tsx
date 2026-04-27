"use client";

import Link from "next/link";
import { useState } from "react";

const destinations = [
  { name: "Beijing", href: "/beijing.html" },
  { name: "Shanghai", href: "/shanghai.html" },
  { name: "Xi'an", href: "/xian.html" },
  { name: "Hangzhou", href: "/hangzhou.html" },
  { name: "Shenzhen", href: "/shenzhen.html" },
  { name: "Chengdu", href: "/chengdu.html" },
  { name: "Guilin", href: "/guilin.html" },
  { name: "Zhangjiajie", href: "/zhangjiajie.html" },
];

export function SiteNav({
  rightSlot,
}: {
  rightSlot?: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes pioneer-rainbow {
          0%   { background-position: 300% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pioneer-sweep {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-dot {
          0%   { box-shadow: 0 0 0 0 rgba(196, 104, 60, 0.55); }
          70%  { box-shadow: 0 0 0 12px rgba(196, 104, 60, 0); }
          100% { box-shadow: 0 0 0 0 rgba(196, 104, 60, 0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.6); opacity: 0.8; }
          70%  { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .pioneer-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-weight: 700;
          letter-spacing: 0.3px;
          position: relative;
          background: linear-gradient(90deg, #c4683c, #d4884e, #e6a855, #d4884e, #c4683c);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pioneer-rainbow 5s linear infinite;
          transition: transform 0.25s ease;
        }
        .pioneer-link:hover { transform: translateY(-1px); }
        .pioneer-link::before {
          content: '';
          position: absolute;
          inset: -4px -6px;
          border-radius: 8px;
          background: linear-gradient(90deg, transparent, rgba(196,104,60,0.06), transparent);
          background-size: 200% 100%;
          animation: pioneer-sweep 3.6s linear infinite;
          z-index: -1;
          opacity: 0.75;
          pointer-events: none;
        }
        .pioneer-dot {
          position: relative;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c4683c;
          flex-shrink: 0;
          animation: pulse-dot 1.8s ease-out infinite;
        }
        .pioneer-dot::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid currentColor;
          color: #c4683c;
          animation: pulse-ring 1.8s ease-out infinite;
        }
        .dest-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid var(--gray-100);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          padding: 32px 0;
          opacity: 0;
          visibility: hidden;
          transform: perspective(400px) rotateX(-8deg);
          transform-origin: top center;
          transition: opacity 0.35s ease, visibility 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          display: flex;
          justify-content: center;
          gap: 0;
        }
        .dest-trigger-wrap:hover .dest-dropdown {
          opacity: 1;
          visibility: visible;
          transform: perspective(400px) rotateX(0deg);
        }
        .dest-dropdown a {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 48px;
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--gray-600);
          position: relative;
          transition: color 0.2s ease;
        }
        .dest-dropdown a::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 48px;
          right: 48px;
          height: 2px;
          background: var(--accent);
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dest-dropdown a:hover { color: var(--ink); }
        .dest-dropdown a:hover::after { transform: scaleX(1); }
        @media (prefers-reduced-motion: reduce) {
          .pioneer-link, .pioneer-link::before, .pioneer-dot, .pioneer-dot::before { animation: none; }
        }
      `}</style>

      <nav className="sticky top-0 z-50">
        {/* Top bar */}
        <div className="bg-[var(--ink)] text-white/70 text-[0.78rem] hidden md:block">
          <div className="max-w-[1200px] mx-auto px-8 py-1.5 flex justify-between items-center">
            <div className="flex gap-5 items-center">
              <a href="mailto:info@milesminds.com" className="hover:text-white transition-colors">info@milesminds.com</a>
              <a href="tel:+353894841019" className="hover:text-white transition-colors">+353 89 484 1019</a>
            </div>
            <div className="flex gap-4 items-center">
              <span>Ireland-based since 2025</span>
              {rightSlot}
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="bg-white/95 backdrop-blur border-b border-black/5">
          <div className="max-w-[1200px] mx-auto px-8 h-[72px] flex items-center justify-between">
            <Link href="/" className="font-display text-[1.6rem] leading-none text-[var(--ink)]">
              China Quest
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7 text-[0.9rem] text-[var(--gray-600)]">
              <a href="/pioneer" className="pioneer-link">
                <span className="pioneer-dot" />
                Pioneer Programme
              </a>
              <a href="/index.html#programmes" className="hover:text-[var(--ink)] transition-colors">Programmes</a>
              <div className="dest-trigger-wrap" style={{ position: "static" }}>
                <button className="hover:text-[var(--ink)] transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer text-[0.9rem] text-[var(--gray-600)] font-[inherit]">
                  Destinations
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginLeft: 2 }}><path d="M1 1l4 4 4-4" /></svg>
                </button>
                <div className="dest-dropdown">
                  {destinations.map((d, i) => (
                    <a key={d.name} href={d.href} style={{ opacity: 0, animation: `fadeIn 0.3s ease ${0.05 * (i + 1)}s forwards` }}>{d.name}</a>
                  ))}
                </div>
              </div>
              <a href="/why.html" className="hover:text-[var(--ink)] transition-colors">Why Us</a>
              <a href="/safety.html" className="hover:text-[var(--ink)] transition-colors">Safety</a>
              <a href="/contact.html" className="hover:text-[var(--ink)] transition-colors">Contact</a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden bg-transparent border-none cursor-pointer p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-[var(--gray-100)] flex flex-col px-5 pb-5 pt-1 gap-1">
            <a href="/pioneer" className="pioneer-link py-3 text-[0.92rem]">
              <span className="pioneer-dot" />
              Pioneer Programme
            </a>
            <a href="/index.html#programmes" className="py-3 text-[0.92rem] text-[var(--gray-600)] border-b border-[var(--gray-100)]">Programmes</a>
            <div>
              <button
                onClick={() => setDestOpen(!destOpen)}
                className="py-3 text-[0.92rem] text-[var(--gray-600)] border-b border-[var(--gray-100)] w-full text-left bg-transparent border-x-0 border-t-0 cursor-pointer font-[inherit] flex items-center"
              >
                Destinations
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginLeft: 6 }}><path d="M1 1l4 4 4-4" /></svg>
              </button>
              {destOpen && (
                <div className="flex flex-col pl-4">
                  {destinations.map((d) => (
                    <a key={d.name} href={d.href} className="py-2.5 text-[0.88rem] text-[var(--gray-500)] border-b border-[var(--gray-50)]">{d.name}</a>
                  ))}
                </div>
              )}
            </div>
            <a href="/why.html" className="py-3 text-[0.92rem] text-[var(--gray-600)] border-b border-[var(--gray-100)]">Why China Quest</a>
            <a href="/safety.html" className="py-3 text-[0.92rem] text-[var(--gray-600)] border-b border-[var(--gray-100)]">Safety</a>
            <a href="/contact.html" className="py-3 text-[0.92rem] text-[var(--gray-600)] border-b border-[var(--gray-100)]">Contact</a>
            {rightSlot && <div className="pt-3">{rightSlot}</div>}
          </div>
        )}
      </nav>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[var(--ink)] text-white/65 mt-auto border-t border-white/[0.08]" style={{ padding: "64px 0 32px" }}>
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <div className="font-display text-[1.35rem] text-white mb-4">China Quest</div>
            <p className="text-[0.88rem] leading-[1.8] max-w-[300px]">A structured educational journey across modern China. Designed for Irish and international schools by Miles Minds Limited, Ireland. Founded 2025.</p>
          </div>
          <div>
            <h5 className="text-white text-[0.85rem] font-semibold uppercase tracking-[1.5px] mb-5">Programmes</h5>
            <ul className="space-y-2.5 text-[0.88rem]">
              <li><a href="/roots.html" className="hover:text-white transition-colors">Roots — Heritage &amp; Culture</a></li>
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
            </ul>
          </div>
          <div>
            <h5 className="text-white text-[0.85rem] font-semibold uppercase tracking-[1.5px] mb-5">Contact</h5>
            <ul className="space-y-2.5 text-[0.88rem]">
              <li><a href="mailto:info@milesminds.com" className="hover:text-white transition-colors">info@milesminds.com</a></li>
              <li><a href="tel:+353894841019" className="hover:text-white transition-colors">+353 89 484 1019</a></li>
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
