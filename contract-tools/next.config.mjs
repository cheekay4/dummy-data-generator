/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // pdfjs-dist requires canvas — mark as optional
    config.resolve.alias.canvas = false;
    return config;
  },
};
export default nextConfig;
