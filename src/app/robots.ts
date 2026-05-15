import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const DOMAIN = 'https://maestrodeninmluxury.com';

  return {
    rules: [
      {
        userAgent: ['facebookexternalhit', 'Facebot'],
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
