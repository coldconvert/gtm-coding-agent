import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker/Fly.io deployment — produces a self-contained server.js
  output: "standalone",
};

export default nextConfig;
