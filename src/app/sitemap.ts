import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

const DOMAIN = 'https://www.maestrodeninmluxury.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rutas estáticas principales
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${DOMAIN}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/journal`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Páginas de categoría
    ...[
      'pantalones', 'chaquetas', 'gabardinas', 'blusas-y-corset',
      'chalecos', 'faldas', 'vestidos', 'enterizo',
    ].map(cat => ({
      url: `${DOMAIN}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ];

  // Obtener productos activos
  try {
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, slug, category_id, updated_at')
      .eq('status', 'Activo');

    if (products) {
      products.forEach((product) => {
        routes.push({
          url: `${DOMAIN}/${product.category_id}/${product.slug}`,
          lastModified: new Date(product.updated_at || new Date()),
          changeFrequency: 'daily',
          priority: 0.9,
        });
      });
    }
  } catch (e) {
    console.error("Error fetching products for sitemap", e);
  }

  // Obtener artículos del journal
  try {
    const { data: posts } = await supabaseAdmin
      .from('journal')
      .select('slug, created_at')
      .eq('status', 'Publicado');

    if (posts) {
      posts.forEach((post) => {
        routes.push({
          url: `${DOMAIN}/journal/${post.slug}`,
          lastModified: new Date(post.created_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      });
    }
  } catch (e) {
    console.error("Error fetching journal for sitemap", e);
  }

  return routes;
}
