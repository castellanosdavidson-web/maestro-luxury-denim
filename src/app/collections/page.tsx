import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

import { supabaseAdmin } from "@/lib/supabase";

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

  return (
    <main className="min-h-screen bg-maestro-dark pt-28 pb-20">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl text-editorial text-maestro-bone mb-12">Colección Completa</h1>

        {products.length === 0 ? (
          <p className="text-maestro-bone/60">No hay productos disponibles por ahora.</p>
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
