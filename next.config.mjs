/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/download',
        destination: '/api/download.js',
      },
    ];
  }
};

export default nextConfig;
