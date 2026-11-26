import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/e-commerce",
  env: { NEXT_PUBLIC_BASE_PATH: "/e-commerce" },
  experimental: {
    agentFeedback: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "scontent.fcai19-1.fna.fbcdn.net" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withFlowbiteReact(nextConfig);
