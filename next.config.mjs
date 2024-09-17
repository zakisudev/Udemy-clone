/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'sea1.ingest.uploadthing.com' },
      { hostname: 'utfs.io' },
      { hostname: 'img.clerk.com' },
    ],
  },
};

export default nextConfig;
