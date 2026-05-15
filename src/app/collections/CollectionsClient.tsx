"use client";

import { useState, useRef, startTransition } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ArrowUpDown, X } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface Product {
  id: string;
  name: string;
  reference: string;
  price: number;
  image: string;
  category_id: string;
  status: string;
}

const PAGE_SIZE = 14;

const SORT_OPTIONS = [
  { label: "Más recientes",  value: "newest" },
  { label: "Precio: menor", value: "price_asc" },
  { label: "Precio: mayor", value: "price_desc" },
  { label: "Nombre A-Z",    value: "name_asc" },
];

function toLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function getLayout(index: number) {
  const pos = index % 7;
  // En mobile (grid-cols-2), md:col-span-2 se convierte en col-span-2 para destacar productos
  if (pos === 0) return { col: "col-span-2 md:col-span-2", size: "hero" };
  if (pos === 1) return { col: "col-span-1 md:col-span-1", size: "small" };
  if (pos === 2) return { col: "col-span-1 md:col-span-1", size: "small" };
  if (pos === 3) return { col: "col-span-1 md:col-span-1", size: "medium" };
  if (pos === 4) return { col: "col-span-1 md:col-span-1", size: "medium" };
  if (pos === 5) return { col: "col-span-1 md:col-span-1", size: "medium" };
  if (pos === 6) return { col: "col-span-2 md:col-span-2", size: "hero" };
  return { col: "col-span-1 md:col-span-1", size: "medium" };
}

function heightClass(size: string) {
  if (size === "hero")   return "h-[85vw] md:h-[65vh]";
  if (size === "small")  return "h-[55vw] md:h-[35vh]";
  return                        "h-[65vw] md:h-[45vh]";
}

// ── Tarjeta de Producto Optimizado ──
function AnimatedProductCard({ p, i }: { p: Product; i: number }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { col, size } = getLayout(i);
  const hClass  = heightClass(size);
  const isHero  = size === "hero";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={col}
    >
      <Link href={`/product/${p.id}`} className="group block">
        <div className={`relative w-full overflow-hidden bg-maestro-carbon ${hClass}`}>
          <img
            src={p.image || "/og-default.jpg"}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay gradiente (Desktop: visible al hover | Mobile: sutil siempre) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

          {/* Info FLOTANTE (Desktop hover) */}
          <div className="hidden md:flex absolute inset-0 flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <p className="text-[8px] uppercase tracking-[0.3em] text-maestro-gold mb-1">{toLabel(p.category_id)}</p>
            <h3 className={`font-light text-white leading-tight ${isHero ? "text-3xl" : "text-base"}`}>
              {p.name}
            </h3>
            <p className="text-white/60 text-sm mt-2">
              ${Number(p.price).toLocaleString("es-CO")}
            </p>
          </div>
        </div>

        {/* Info SIEMPRE VISIBLE (Mobile y fallback debajo de imagen) */}
        <div className="pt-4 pb-2 md:group-hover:opacity-0 transition-opacity duration-300">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <p className="text-[9px] uppercase tracking-[0.2em] text-maestro-bone/30 mb-1">{toLabel(p.category_id)}</p>
              <h3 className="text-xs md:text-sm text-maestro-bone group-hover:text-maestro-gold transition-colors leading-snug font-light">
                {p.name}
              </h3>
            </div>
            <p className="text-xs text-maestro-bone/60 font-light">
              ${Number(p.price).toLocaleString("es-CO")}
            </p>
          </div>
          {/* Referencia pequeña */}
          <p className="text-[8px] text-maestro-bone/20 mt-1 uppercase tracking-widest">{p.reference}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CollectionsClient({ products }: { products: Product[] }) {
  const categories = Array.from(new Set(products.map(p => p.category_id))).filter(Boolean).sort();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort]   = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const [page, setPage]   = useState(1);

  const filtered = (() => {
    let list = activeCategory ? products.filter(p => p.category_id === activeCategory) : products;
    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name_asc")   list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  })();

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore   = paginated.length < filtered.length;

  const headerRef    = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <main className="min-h-screen bg-maestro-dark pb-32">
      <Navbar />

      <div ref={headerRef} className="pt-32 pb-10 border-b border-maestro-bone/10 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[10px] tracking-[0.4em] uppercase text-maestro-gold mb-3"
            >
              MAESTRO Denim
            </motion.p>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={headerInView ? { y: "0%" } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-light text-maestro-bone leading-none"
              >
                Catálogo
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                animate={headerInView ? { y: "0%" } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-light text-maestro-bone/20 leading-none italic"
              >
                Premium
              </motion.h2>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[10px] tracking-[0.3em] uppercase text-maestro-bone/40"
          >
            {filtered.length} piezas únicas
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-maestro-bone/5">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { startTransition(() => { setActiveCategory(null); setPage(1); }); }}
              className={`px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase border transition-all ${!activeCategory ? "border-maestro-gold text-maestro-gold bg-maestro-gold/10" : "border-maestro-bone/10 text-maestro-bone/40"}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button key={cat}
                onClick={() => { startTransition(() => { setActiveCategory(cat); setPage(1); }); }}
                className={`px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase border transition-all ${activeCategory === cat ? "border-maestro-gold text-maestro-gold bg-maestro-gold/10" : "border-maestro-bone/10 text-maestro-bone/40"}`}
              >
                {toLabel(cat)}
              </button>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setShowSort(s => !s)}
              className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-maestro-bone/40 border border-maestro-bone/10 px-4 py-1.5">
              <ArrowUpDown size={10} />
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-maestro-carbon border border-maestro-bone/10 z-[100] min-w-[160px]">
                {SORT_OPTIONS.map(o => (
                  <button key={o.value}
                    onClick={() => { startTransition(() => { setSort(o.value); setShowSort(false); setPage(1); }); }}
                    className={`block w-full text-left px-4 py-3 text-[9px] tracking-widest uppercase hover:bg-maestro-bone/5 ${sort === o.value ? "text-maestro-gold" : "text-maestro-bone/60"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid Principal */}
        {paginated.length === 0 ? (
          <p className="text-center text-maestro-bone/20 py-24 text-[10px] tracking-[0.4em] uppercase">
            No se encontraron productos
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-16">
            {paginated.map((p, i) => (
              <AnimatedProductCard key={p.id} p={p} i={i} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="flex flex-col items-center mt-24 gap-4">
            <button
              onClick={() => setPage(p => p + 1)}
              className="border border-maestro-bone/20 hover:border-maestro-gold text-maestro-bone/40 hover:text-maestro-gold px-16 py-4 text-[10px] tracking-[0.4em] uppercase transition-all duration-500"
            >
              Cargar más piezas
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
