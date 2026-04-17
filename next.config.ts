import type { NextConfig } from "next";

const isPages = process.env.DEPLOY_TARGET === "pages";
const repo = "portfo";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
};

export default nextConfig;
