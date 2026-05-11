import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

import { supabaseAdmin } from "@/lib/supabase";

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

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  return <ProductClient product={product} />;
}
