/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3dk884ndgorz5gwq.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
