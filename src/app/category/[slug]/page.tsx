import CategoryClient from "./CategoryClient";
import { supabaseAdmin } from "@/lib/supabase";

const categoryMap: Record<string, string> = {
  "blusas-y-corset": "Blusas y Corset",
  "chaquetas":       "Chaquetas",
  "gabardinas":      "Gabardinas",
  "chalecos":        "Chalecos",
  "faldas":          "Faldas",
  "vestidos":        "Vestidos",
  "pantalones":      "Pantalones",
  "enterizo":        "Enterizo",
};

export const dynamic  = 'force-dynamic';
export const revalidate = 0;

async function getProductsByCategory(categoryId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('status', 'Activo')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error("Error fetching products by category:", e);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/\s+/g, '-');
  const categoryName   = categoryMap[normalizedSlug] || normalizedSlug;
  const products       = await getProductsByCategory(normalizedSlug);

  // Últimos 5 de la lista (los más antiguos) para no repetir con los primeros del grid
  // products ya viene ordenado: newest first → los últimos de la lista son los más antiguos
  const heroSlides = products.slice(-5).map((p: any) => ({
    id:    p.id,
    name:  p.name || p.reference,
    image: p.image || "",
  }));

  return (
    <CategoryClient
      categoryName={categoryName}
      products={products}
      heroSlides={heroSlides}
    />
  );
}
