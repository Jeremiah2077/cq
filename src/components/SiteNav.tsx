"use client";

import Link from "next/link";

export function SiteNav({
  rightSlot,
}: {
  rightSlot?: React.ReactNode;
}) {
  return (
    <nav className="nav" id="nav">
      <div className="nav-top">
        <div className="container">
          <div className="nav-top-left">
            <a href="mailto:info@milesminds.com">info@milesminds.com</a>
            <a href="tel:+353873752491">+353 87 375 2491</a>
          </div>
          <div className="nav-top-right">
            <span>Ireland-based since 2005</span>
            {rightSlot}
          </div>
        </div>
      </div>
      <div className="nav-main">
        <div className="container">
          <Link href="/" className="logo">
            China Quest
          </Link>
          <ul className="nav-links">
            <li><a href="/pioneer" className="nav-pioneer"><span className="nav-pulse"></span>Pioneer Programme</a></li>
            <li><a href="/index.html#programmes">Programmes</a></li>
            <li className="nav-dropdown">
              <a href="#" className="nav-dropdown-trigger" onClick={(e) => e.preventDefault()}>
                Destinations <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" style={{marginLeft:4,verticalAlign:"middle"}}><path d="M1 1l4 4 4-4"/></svg>
              </a>
              <div className="nav-dropdown-menu">
                <a href="/beijing.html">Beijing</a>
                <a href="/shanghai.html">Shanghai</a>
                <a href="/xian.html">Xi&apos;an</a>
                <a href="/hangzhou.html">Hangzhou</a>
                <a href="/shenzhen.html">Shenzhen</a>
                <a href="/chengdu.html">Chengdu</a>
                <a href="/guilin.html">Guilin</a>
                <a href="/zhangjiajie.html">Zhangjiajie</a>
              </div>
            </li>
            <li><a href="/why.html">Why Us</a></li>
            <li><a href="/safety.html">Safety</a></li>
            <li><a href="/contact.html">Contact</a></li>
          </ul>
          <button
            className="mobile-menu-btn"
            onClick={() => document.querySelector(".mobile-menu")?.classList.toggle("open")}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
      <div className="mobile-menu">
        <a href="/pioneer" className="nav-pioneer"><span className="nav-pulse"></span>Pioneer Programme</a>
        <a href="/index.html#programmes">Programmes</a>
        <div className="mobile-dropdown">
          <a href="#" onClick={(e) => { e.preventDefault(); (e.currentTarget.parentElement as HTMLElement)?.classList.toggle("open"); }}>
            Destinations <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" style={{marginLeft:4,verticalAlign:"middle"}}><path d="M1 1l4 4 4-4"/></svg>
          </a>
          <div className="mobile-dropdown-menu">
            <a href="/beijing.html">Beijing</a>
            <a href="/shanghai.html">Shanghai</a>
            <a href="/xian.html">Xi&apos;an</a>
            <a href="/hangzhou.html">Hangzhou</a>
            <a href="/shenzhen.html">Shenzhen</a>
            <a href="/chengdu.html">Chengdu</a>
            <a href="/guilin.html">Guilin</a>
            <a href="/zhangjiajie.html">Zhangjiajie</a>
          </div>
        </div>
        <a href="/why.html">Why China Quest</a>
        <a href="/safety.html">Safety</a>
        <a href="/contact.html">Contact</a>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">China Quest</div>
            <p>A structured educational journey across modern China. Designed for Irish and international schools by Miles Minds Limited, Ireland. Founded 2005.</p>
          </div>
          <div>
            <h5>Programmes</h5>
            <ul>
              <li><a href="/roots.html">Roots — History &amp; Culture</a></li>
              <li><a href="/pulse.html">Pulse — STEM &amp; Innovation</a></li>
              <li><a href="/horizon.html">Horizon — Nature &amp; Landscapes</a></li>
              <li><a href="/tailored.html">Custom Programmes</a></li>
            </ul>
          </div>
          <div>
            <h5>For Schools</h5>
            <ul>
              <li><a href="/why.html">Why China Quest</a></li>
              <li><a href="/safety.html">Safety &amp; Support</a></li>
              <li><a href="/contact.html">Contact / TY Show</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li><a href="mailto:info@milesminds.com">info@milesminds.com</a></li>
              <li><a href="tel:+353873752491">+353 87 375 2491</a></li>
              <li style={{marginTop:16,fontSize:"0.82rem",color:"rgba(255,255,255,0.35)"}}>Miles Minds Limited<br/>Company No. 802673<br/>Ireland</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} China Quest / Miles Minds Limited. All rights reserved.</span>
          <div className="footer-legal">
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms</a>
            <a href="/cookies.html">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
