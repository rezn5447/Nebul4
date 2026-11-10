import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root so a lockfile higher up (e.g. ~/pnpm-lock.yaml) is not mistaken for it.
  outputFileTracingRoot: import.meta.dirname,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
