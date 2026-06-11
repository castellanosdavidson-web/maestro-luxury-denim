import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/journal/gu-a-definitiva-de-denim-las-tendencias-en-jeans-2026-que-reinar-n-en-el-asfalto-09ee',
        destination: '/journal/guia-tendencias-denim',
        permanent: true,
      },
      {
        source: '/journal/el-denim-como-lenguaje-est-tico-m-s-que-una-tela-un-c-digo-5aa8',
        destination: '/journal/denim-lenguaje-estetico',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hjlfezbramtijwajkchn.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
