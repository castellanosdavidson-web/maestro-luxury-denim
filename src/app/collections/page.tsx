import Navbar from "@/components/layout/Navbar";
import { readDb } from "@/lib/localDb";
import Link from "next/link";

export default async function CollectionsPage() {
  const db = await readDb();
  const products = db.products;

  return (
    <main className="min-h-screen bg-maestro-dark pt-28 pb-20">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl text-editorial text-maestro-bone mb-12">Colección Completa</h1>
        
        {products.length === 0 ? (
          <p className="text-maestro-bone/60">No hay productos disponibles por ahora.</p>
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
