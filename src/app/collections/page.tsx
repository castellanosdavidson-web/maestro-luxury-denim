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
    <main className="min-h-screen bg-maestro-dark pt-32 pb-32">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12">
        <header className="mb-20 md:mb-32 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6 border-b border-maestro-bone/10 pb-8">
          <div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-editorial text-maestro-bone uppercase leading-none">
              Colección
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-editorial text-maestro-bone/40 uppercase leading-none italic mt-2">
              Completa
            </h1>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-maestro-bone/60 max-w-xs text-right hidden md:block">
            {products.length} PIEZAS EXCLUSIVAS DE DENIM PREMIUM COLOMBIANO
          </p>
        </header>

        {products.length === 0 ? (
          <p className="text-maestro-bone/60 text-center py-20 text-sm tracking-widest uppercase">No hay productos disponibles por ahora.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-24 lg:gap-y-32">
            {products.map((p: any, idx: number) => {
              // Diseño asimétrico: Algunos toman la fila completa, otros no, y tienen distintos márgenes.
              const isFullWidth = idx % 5 === 0; // Cada 5to producto es enorme
              const isPushedDown = idx % 2 !== 0 && !isFullWidth; // Desfasar los elementos de la segunda columna
              
              return (
                <Link 
                  href={`/product/${p.id}`} 
                  key={p.id} 
                  className={`group cursor-pointer block ${isFullWidth ? 'md:col-span-2' : ''} ${isPushedDown ? 'md:mt-32' : ''}`}
                >
                  <div className={`w-full overflow-hidden bg-maestro-carbon mb-6 relative ${isFullWidth ? 'h-[70vh] md:h-[120vh]' : 'h-[60vh] md:h-[80vh]'}`}>
                    <img 
                      src={p.image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6?q=80"} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] text-maestro-bone/40 uppercase tracking-[0.3em] mb-2">Ref. {p.reference}</p>
                      <h3 className="text-xl md:text-2xl text-editorial text-maestro-bone group-hover:text-maestro-gold transition-colors">{p.name}</h3>
                    </div>
                    <p className="text-maestro-bone tracking-widest text-sm">${Number(p.price).toLocaleString("es-CO")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
