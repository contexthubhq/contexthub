import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/data-sources',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
