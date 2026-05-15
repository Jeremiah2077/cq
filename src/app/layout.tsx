import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Noto_Serif_SC } from "next/font/google";
import { PageTracker } from "@/components/PageTracker";
import { TawkWidget } from "@/components/TawkWidget";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const notoSerifSc = Noto_Serif_SC({
  variable: "--font-cn",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "China Quest · Pioneer Portal",
  description: "Pioneer Programme applicant portal — Miles Minds / China Quest",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable} ${notoSerifSc.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageTracker />
        {children}
        <TawkWidget />
      </body>
    </html>
  );
}
