import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://agilis-technical-test-lumi.runasp.net/api/:path*",
      },
    ];
  },
};

export default nextConfig;