import type { NextConfig } from "next";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/s/:code",
        destination: `${apiBase}/s/:code/`,
      },
    ];
  },
};

export default nextConfig;
