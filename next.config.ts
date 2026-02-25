import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for static file serving in WebView
  trailingSlash: true,
};

export default nextConfig;
