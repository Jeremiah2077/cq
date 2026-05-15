import Script from "next/script";

// Tawk.to live-chat embed. Property/Widget IDs are public (exposed in the
// browser by design), so they live in code rather than env — this also keeps
// the portal and the static marketing site (public/script.js) in sync.
const TAWK_EMBED_SRC =
  "https://embed.tawk.to/6a07971ba62ba71c346b8e4f/1jomqcgoo";

export function TawkWidget() {
  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='${TAWK_EMBED_SRC}';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
      `}
    </Script>
  );
}
