import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const categoryMap: Record<string, string> = {
  "blusas-y-corset": "Blusas y Corset",
  "chaquetas": "Chaquetas",
  "gabardinas": "Gabardinas",
  "chalecos": "Chalecos",
  "faldas": "Faldas",
  "vestidos": "Vestidos",
  "pantalones": "Pantalones",
  "enterizo": "Enterizo",
};

import { supabaseAdmin } from "@/lib/supabase";

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
  const categoryName = categoryMap[slug] || slug;
  const products = await getProductsByCategory(slug);

  return (
    <main className="min-h-screen bg-maestro-dark pt-28 pb-20">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center text-xs text-maestro-bone/40 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-maestro-bone">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-maestro-bone">{categoryName}</span>
        </div>

        <h1 className="text-4xl text-editorial text-maestro-bone mb-12">{categoryName}</h1>

        {products.length === 0 ? (
          <p className="text-maestro-bone/60">No hay productos en esta categoría por ahora.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p: any) => (
              <Link href={`/product/${p.id}`} key={p.id} className="group cursor-pointer">
                <div className="h-96 bg-maestro-carbon mb-4 overflow-hidden">
                  <img src={p.image || ""} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-sm tracking-widest uppercase text-maestro-bone">{p.name}</h3>
                <p className="text-maestro-gold text-sm mt-1">${Number(p.price).toLocaleString("es-CO")}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
