/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // barcha domenlar uchun ruxsat
      },
    ],
  },
};

export default nextConfig;
