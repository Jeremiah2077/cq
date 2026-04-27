import path from "node:path";
import type { NextConfig } from "next";

const STATIC_PAGES = [
  "roots",
  "pioneer",
  "horizon",
  "pulse",
  "tailored",
  "why",
  "safety",
  "contact",
  "privacy",
  "terms",
  "cookies",
  "beijing",
  "shanghai",
  "xian",
  "hangzhou",
  "shenzhen",
  "chengdu",
  "guilin",
  "zhangjiajie",
  "survey-student",
  "survey-teacher",
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        ...STATIC_PAGES.map((p) => ({
          source: `/${p}`,
          destination: `/${p}.html`,
        })),
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
