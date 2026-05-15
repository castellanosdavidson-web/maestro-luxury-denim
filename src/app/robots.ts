import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const DOMAIN = 'https://maestrodeninmluxury.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Evitar que indexen el panel de control o las APIs
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
