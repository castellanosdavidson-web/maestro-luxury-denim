import Navbar from "@/components/layout/Navbar";
import { readDb } from "@/lib/localDb";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await readDb();
  
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
  
  const categoryName = categoryMap[slug] || slug;
  const products = db.products.filter(p => p.categoryId === slug);

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
            {products.map(p => (
              <Link href={`/product/${p.id}`} key={p.id} className="group cursor-pointer">
                <div className="h-96 bg-maestro-carbon mb-4 overflow-hidden">
                  <img src={p.images?.[0] || ""} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-sm tracking-widest uppercase text-maestro-bone">{p.name}</h3>
                <p className="text-maestro-gold text-sm mt-1">${p.price.toLocaleString("es-CO")}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
