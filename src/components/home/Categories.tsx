"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Normaliza cualquier ID o nombre de categoría a un slug con guiones
const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

interface Category {
  id: string;
  name: string;
  image: string;
  focal_x?: number;
  focal_y?: number;
  status?: string;
}

export default function Categories({ categories }: { categories?: Category[] }) {
  const cats = (categories || []).filter(c => c.status !== "Inactiva");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (cats.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 380 : -380, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  // Split into featured (first 2) + rest for horizontal scroll
  const featured = cats.slice(0, 2);
  const rest      = cats.slice(2);

  return (
    <section className="py-24 bg-maestro-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-maestro-gold mb-3">Editorial</p>
            <h2 className="text-4xl md:text-6xl font-light text-maestro-bone leading-none tracking-tight">
              Colecciones
            </h2>
          </div>
          <Link
            href="/collections"
            className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-maestro-bone/50 hover:text-maestro-gold transition-colors group"
          >
            Ver Todo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Hero Grid — first 2 categories */}
        {featured.length > 0 && (
          <div className={`grid gap-3 mb-3 ${featured.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {featured.map((cat, i) => {
              const isLarge = i === 0 && featured.length === 2;
              const focalX  = cat.focal_x ?? 50;
              const focalY  = cat.focal_y ?? 50;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${toSlug(cat.id)}`}
                  className={`group relative overflow-hidden block ${isLarge ? "md:row-span-1" : ""}`}
                  style={{ height: isLarge ? "520px" : "380px" }}
                  onMouseEnter={() => setHoveredId(cat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Background image */}
                  <div className="absolute inset-0">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                        style={{ objectPosition: `${focalX}% ${focalY}%` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5" />
                    )}
                  </div>

                  {/* Grain overlay for premium feel */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    {/* Category number */}
                    <span className="text-[10px] tracking-[0.3em] uppercase text-maestro-gold/60 mb-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-4 transition-transform duration-500 group-hover:-translate-y-1">
                      {cat.name}
                    </h3>
                    {/* Hover CTA */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`h-px bg-maestro-gold transition-all duration-500 ${hoveredId === cat.id ? "w-8" : "w-0"}`} />
                      <span className={`text-[10px] tracking-[0.25em] uppercase text-maestro-gold transition-all duration-500 ${hoveredId === cat.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                        Explorar colección
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Horizontal scroll strip — remaining categories */}
        {rest.length > 0 && (
          <div className="relative">
            {/* Scroll arrows */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-maestro-dark/90 border border-white/10 flex items-center justify-center text-white/50 hover:text-maestro-gold hover:border-maestro-gold transition-all"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollRight && rest.length > 3 && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-maestro-dark/90 border border-white/10 flex items-center justify-center text-white/50 hover:text-maestro-gold hover:border-maestro-gold transition-all"
              >
                <ChevronRight size={18} />
              </button>
            )}

            {/* Scrollable container */}
            <div
              ref={scrollRef}
              onScroll={onScroll}
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {rest.map((cat, i) => {
                const focalX = cat.focal_x ?? 50;
                const focalY = cat.focal_y ?? 50;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${toSlug(cat.id)}`}
                    className="group relative flex-none overflow-hidden snap-start"
                    style={{ width: "280px", height: "360px" }}
                    onMouseEnter={() => setHoveredId(cat.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Image */}
                    <div className="absolute inset-0">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
                          style={{ objectPosition: `${focalX}% ${focalY}%` }}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-maestro-gold/50 mb-2">
                        {String(i + 3).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-light text-white tracking-wide mb-3 transition-transform duration-500 group-hover:-translate-y-1">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className={`h-px bg-maestro-gold transition-all duration-500 ${hoveredId === cat.id ? "w-6" : "w-0"}`} />
                        <span className={`text-[9px] tracking-[0.25em] uppercase text-maestro-gold transition-all duration-500 ${hoveredId === cat.id ? "opacity-100" : "opacity-0"}`}>
                          Ver más
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="flex md:hidden justify-center mt-10">
          <Link href="/collections" className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-maestro-bone/50 hover:text-maestro-gold border border-maestro-bone/20 hover:border-maestro-gold px-6 py-3 transition-all">
            Ver Todas las Colecciones <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </section>
  );
}
