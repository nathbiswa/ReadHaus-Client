/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // reactCompiler: true,
  // experimental: {
  //   serverComponentsExternalPackages: ['@better-auth/kysely-adapter'],
  // },
};

export default nextConfig;


