/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hmzkztyc4aewyunk.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
