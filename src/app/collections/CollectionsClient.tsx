"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  reference: string;
  price: number;
  image: string;
  category_id: string;
  status: string;
}

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { label: "Más recientes",   value: "newest" },
  { label: "Precio: menor",  value: "price_asc" },
  { label: "Precio: mayor",  value: "price_desc" },
  { label: "Nombre A-Z",     value: "name_asc" },
];

function toLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function CollectionsClient({ products }: { products: Product[] }) {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category_id))).filter(Boolean);
    return cats.sort();
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = activeCategory ? products.filter(p => p.category_id === activeCategory) : products;
    if (sort === "price_asc")  list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a,b) => b.price - a.price);
    if (sort === "name_asc")   list = [...list].sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }, [products, activeCategory, sort]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <main className="min-h-screen bg-maestro-dark pb-32">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-10 border-b border-maestro-bone/10">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-maestro-gold mb-3">MAESTRO Denim</p>
            <h1 className="text-5xl md:text-7xl font-light text-maestro-bone leading-none">
              Colección
            </h1>
            <h1 className="text-5xl md:text-7xl font-light text-maestro-bone/25 leading-none italic">
              Completa
            </h1>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-maestro-bone/40">
            {filtered.length} piezas
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-10">

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-maestro-bone/5">

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCategory(null); setPage(1); }}
              className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border transition-all ${!activeCategory ? 'border-maestro-gold text-maestro-gold bg-maestro-gold/10' : 'border-maestro-bone/20 text-maestro-bone/50 hover:border-maestro-bone/50'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase border transition-all ${activeCategory === cat ? 'border-maestro-gold text-maestro-gold bg-maestro-gold/10' : 'border-maestro-bone/20 text-maestro-bone/50 hover:border-maestro-bone/50'}`}
              >
                {toLabel(cat)}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(s => !s)}
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-maestro-bone/50 hover:text-maestro-bone border border-maestro-bone/20 hover:border-maestro-bone/40 px-4 py-1.5 transition-all"
            >
              <ArrowUpDown size={11} />
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-maestro-carbon border border-maestro-bone/10 z-20 min-w-[160px]">
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    onClick={() => { setSort(o.value); setShowSort(false); setPage(1); }}
                    className={`block w-full text-left px-4 py-3 text-[10px] tracking-widest uppercase hover:bg-maestro-bone/5 transition-colors ${sort === o.value ? 'text-maestro-gold' : 'text-maestro-bone/60'}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active filter badge */}
        {activeCategory && (
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] tracking-widest uppercase text-maestro-bone/40">Filtrando por:</span>
            <button
              onClick={() => { setActiveCategory(null); setPage(1); }}
              className="flex items-center gap-1.5 px-3 py-1 bg-maestro-gold/10 border border-maestro-gold/30 text-maestro-gold text-[10px] tracking-widest uppercase"
            >
              {toLabel(activeCategory)} <X size={10} />
            </button>
          </div>
        )}

        {/* Grid */}
        {paginated.length === 0 ? (
          <p className="text-center text-maestro-bone/40 py-24 text-sm tracking-widest uppercase">
            No hay productos en esta categoría
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
            {paginated.map((p, i) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="group block"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-maestro-carbon mb-4" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6?q=80&w=600"}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  {/* Quick view pill on hover */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                    <span className="bg-black/70 backdrop-blur-sm text-white text-[9px] tracking-[0.25em] uppercase px-4 py-2 border border-white/10">
                      Ver Detalle
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <p className="text-[9px] text-maestro-bone/30 uppercase tracking-[0.2em]">
                    {toLabel(p.category_id)}
                  </p>
                  <h3 className="text-sm text-maestro-bone group-hover:text-maestro-gold transition-colors leading-snug">
                    {p.name}
                  </h3>
                  <p className="text-sm text-maestro-bone/60 tracking-wide">
                    ${Number(p.price).toLocaleString("es-CO")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-3 border border-maestro-bone/20 hover:border-maestro-gold text-maestro-bone/60 hover:text-maestro-gold px-10 py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
            >
              <SlidersHorizontal size={12} />
              Cargar más — {filtered.length - paginated.length} piezas restantes
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
