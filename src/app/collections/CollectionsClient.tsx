"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ArrowUpDown, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  reference: string;
  price: number;
  image: string;
  category_id: string;
  status: string;
}

const PAGE_SIZE = 14; // múltiplo del patrón de 7

const SORT_OPTIONS = [
  { label: "Más recientes",  value: "newest" },
  { label: "Precio: menor", value: "price_asc" },
  { label: "Precio: mayor", value: "price_desc" },
  { label: "Nombre A-Z",    value: "name_asc" },
];

function toLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Patrón de layout editorial que se repite cada 7 productos:
 *
 * [  HERO grande  ] [ sm ] [ sm ]
 * [ med ] [ med ] [ med ]
 * [ sm ] [ sm ] [  HERO grande  ]
 * … (se repite)
 */
function getLayout(index: number) {
  const pos = index % 7;
  // Posiciones 0-6 dentro de un bloque:
  if (pos === 0) return { col: "md:col-span-2", size: "hero"   }; // grande
  if (pos === 1) return { col: "md:col-span-1", size: "small"  }; // pequeña arriba-dcha
  if (pos === 2) return { col: "md:col-span-1", size: "small"  }; // pequeña abajo-dcha
  if (pos === 3) return { col: "md:col-span-1", size: "medium" }; // fila de 3 medias
  if (pos === 4) return { col: "md:col-span-1", size: "medium" };
  if (pos === 5) return { col: "md:col-span-1", size: "medium" };
  if (pos === 6) return { col: "md:col-span-2", size: "hero"   }; // grande al final del bloque
  return { col: "md:col-span-1", size: "medium" };
}

function heightClass(size: string) {
  if (size === "hero")   return "h-[75vw] md:h-[65vh]";
  if (size === "small")  return "h-[45vw] md:h-[30vh]";
  return                        "h-[60vw] md:h-[45vh]";
}

export default function CollectionsClient({ products }: { products: Product[] }) {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category_id))).filter(Boolean);
    return cats.sort();
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort]   = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const [page, setPage]   = useState(1);

  const filtered = useMemo(() => {
    let list = activeCategory ? products.filter(p => p.category_id === activeCategory) : products;
    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name_asc")   list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, activeCategory, sort]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore   = paginated.length < filtered.length;

  return (
    <main className="min-h-screen bg-maestro-dark pb-32">
      <Navbar />

      {/* ── Header ── */}
      <div className="pt-32 pb-10 border-b border-maestro-bone/10">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-maestro-gold mb-3">MAESTRO Denim</p>
            <h1 className="text-5xl md:text-7xl font-light text-maestro-bone leading-none">Colección</h1>
            <h2 className="text-5xl md:text-7xl font-light text-maestro-bone/20 leading-none italic">Completa</h2>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-maestro-bone/40">
            {filtered.length} piezas
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-10">

        {/* ── Filters ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-maestro-bone/5">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCategory(null); setPage(1); }}
              className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border transition-all ${!activeCategory ? "border-maestro-gold text-maestro-gold bg-maestro-gold/10" : "border-maestro-bone/20 text-maestro-bone/50 hover:border-maestro-bone/50"}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border transition-all ${activeCategory === cat ? "border-maestro-gold text-maestro-gold bg-maestro-gold/10" : "border-maestro-bone/20 text-maestro-bone/50 hover:border-maestro-bone/50"}`}
              >
                {toLabel(cat)}
              </button>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setShowSort(s => !s)}
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-maestro-bone/50 hover:text-maestro-bone border border-maestro-bone/20 hover:border-maestro-bone/40 px-4 py-1.5 transition-all">
              <ArrowUpDown size={11} />
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-maestro-carbon border border-maestro-bone/10 z-20 min-w-[160px]">
                {SORT_OPTIONS.map(o => (
                  <button key={o.value}
                    onClick={() => { setSort(o.value); setShowSort(false); setPage(1); }}
                    className={`block w-full text-left px-4 py-3 text-[10px] tracking-widest uppercase hover:bg-maestro-bone/5 ${sort === o.value ? "text-maestro-gold" : "text-maestro-bone/60"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeCategory && (
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] tracking-widest uppercase text-maestro-bone/40">Filtrando:</span>
            <button onClick={() => { setActiveCategory(null); setPage(1); }}
              className="flex items-center gap-1.5 px-3 py-1 bg-maestro-gold/10 border border-maestro-gold/30 text-maestro-gold text-[10px] tracking-widest uppercase">
              {toLabel(activeCategory)} <X size={10} />
            </button>
          </div>
        )}

        {/* ── Editorial Grid ── */}
        {paginated.length === 0 ? (
          <p className="text-center text-maestro-bone/40 py-24 text-sm tracking-widest uppercase">
            No hay productos en esta categoría
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-auto">
            {paginated.map((p, i) => {
              const { col, size } = getLayout(i);
              const hClass = heightClass(size);
              const isHero = size === "hero";
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className={`group relative overflow-hidden block ${col}`}
                >
                  {/* Image */}
                  <div className={`relative w-full overflow-hidden bg-maestro-carbon ${hClass}`}>
                    <img
                      src={p.image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6?q=80&w=800"}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Info on hover — for hero cards show inline */}
                    <div className={`absolute inset-0 flex flex-col justify-end p-4 md:p-6 transition-all duration-500 ${isHero ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-maestro-gold/80 mb-1">{toLabel(p.category_id)}</p>
                      <h3 className={`font-light text-white leading-tight ${isHero ? "text-xl md:text-3xl" : "text-sm md:text-base"}`}>
                        {p.name}
                      </h3>
                      <p className="text-white/60 text-xs md:text-sm mt-1 tracking-wide">
                        ${Number(p.price).toLocaleString("es-CO")}
                      </p>
                    </div>

                    {/* Reference number watermark on hero */}
                    {isHero && (
                      <div className="absolute top-4 right-5 text-[60px] md:text-[100px] font-light leading-none text-white/5 select-none pointer-events-none">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    )}
                  </div>

                  {/* Below-image info — always visible on small cards */}
                  {!isHero && (
                    <div className="pt-3 pb-1">
                      <p className="text-[9px] uppercase tracking-[0.15em] text-maestro-bone/30 mb-0.5">{toLabel(p.category_id)}</p>
                      <h3 className="text-xs md:text-sm text-maestro-bone group-hover:text-maestro-gold transition-colors leading-snug">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-maestro-bone/50 mt-0.5">
                        ${Number(p.price).toLocaleString("es-CO")}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Load more ── */}
        {hasMore && (
          <div className="flex flex-col items-center mt-20 gap-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-maestro-bone/30">
              Mostrando {paginated.length} de {filtered.length}
            </p>
            <div className="w-full bg-maestro-bone/10 h-px relative">
              <div
                className="absolute left-0 top-0 h-px bg-maestro-gold transition-all duration-500"
                style={{ width: `${(paginated.length / filtered.length) * 100}%` }}
              />
            </div>
            <button
              onClick={() => setPage(p => p + 1)}
              className="mt-4 border border-maestro-bone/20 hover:border-maestro-gold text-maestro-bone/60 hover:text-maestro-gold px-12 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
            >
              Cargar más
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
