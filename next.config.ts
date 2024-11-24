import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: "/music-analysis",
  output: "export",  // <=== enables static exports
  reactStrictMode: true,

};

module.exports = nextConfig;
