import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProduct(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data;
  } catch (e) {
    console.error("Error fetching product:", e);
    return null;
  }
}

async function getRelatedProducts(categoryId: string, currentId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id, name, price, image, category_id, reference')
      .eq('status', 'Activo')
      .neq('id', currentId)
      .order('created_at', { ascending: false })
      .limit(40);

    if (error || !data) return [];

    // Filtrar primero los que NO son de la misma categoría (categoría "complementaria")
    // Si el producto actual es una chaqueta, recomendar jeans/pantalones, etc.
    const complementaryCategories: Record<string, string[]> = {
      'chaquetas':      ['pantalones', 'faldas', 'blusas-y-corset'],
      'gabardinas':     ['pantalones', 'faldas', 'blusas-y-corset'],
      'chalecos':       ['pantalones', 'blusas-y-corset'],
      'blusas-y-corset':['pantalones', 'faldas', 'chaquetas'],
      'faldas':         ['blusas-y-corset', 'chaquetas', 'chalecos'],
      'vestidos':       ['chaquetas', 'gabardinas', 'chalecos'],
      'pantalones':     ['blusas-y-corset', 'chaquetas', 'chalecos'],
      'enterizo':       ['chaquetas', 'gabardinas'],
    };

    const preferred = complementaryCategories[categoryId] || [];

    // Priorizar categorías complementarias, luego cualquier otra
    const complementary = data.filter(p => preferred.includes(p.category_id));
    const others        = data.filter(p => !preferred.includes(p.category_id));
    const sorted        = [...complementary, ...others];

    // Mezclar los 3 primeros del resultado ordenado aleatoriamente
    const pool = sorted.slice(0, Math.min(sorted.length, 9));
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  } catch (e) {
    console.error("Error fetching related products:", e);
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  const related = await getRelatedProducts(product.category_id, product.id);

  return <ProductClient product={product} related={related} />;
}
