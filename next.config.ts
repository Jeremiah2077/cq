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
  "beijing",
  "shanghai",
  "xian",
  "index-b",
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
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
