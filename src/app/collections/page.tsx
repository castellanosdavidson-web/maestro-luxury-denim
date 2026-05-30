import CollectionsClient from "./CollectionsClient";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'Activo')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error("Error fetching products:", e);
    return [];
  }
}

export default async function CollectionsPage() {
  const products = await getProducts();
  return <CollectionsClient products={products} />;
}
