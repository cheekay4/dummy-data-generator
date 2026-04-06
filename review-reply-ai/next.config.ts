import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'review-reply-ai-nu.vercel.app' }],
        destination: 'https://myreplytone.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
