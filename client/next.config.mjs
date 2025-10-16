/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '**', // Allows any path under localhost:8000
      },
    ],
  },
};

export default nextConfig;
