"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedShowcase({ products }: { products: any[] }) {
  // â”€â”€ Desktop: scroll-driven horizontal pan â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  // â”€â”€ Mobile: touch-swipe carousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [current, setCurrent]   = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const total = products?.length ?? 0;
  const goTo  = useCallback((idx: number) => setCurrent(Math.max(0, Math.min(idx, total - 1))), [total]);
  const prev  = () => goTo(current - 1);
  const next  = () => goTo(current + 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setDragging(false);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(touchDeltaX.current) > 8) setDragging(true);
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      touchDeltaX.current < 0 ? next() : prev();
    }
    setDragging(false);
  };

  if (!products || total === 0) return null;

  return (
    <>
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MOBILE  â€” carrusel tÃ¡ctil (visible solo en < md)
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="block md:hidden bg-maestro-carbon overflow-hidden select-none">

        {/* Encabezado */}
        <div className="px-6 pt-12 pb-6 flex items-end justify-between">
          <div>
            <h2 className="text-5xl text-editorial text-maestro-bone leading-none">NEW<br/>DROP</h2>
            <p className="text-maestro-gold tracking-[0.3em] uppercase text-[10px] mt-3">Explora la colecciÃ³n</p>
          </div>
          {/* PaginaciÃ³n numÃ©rica */}
          <span className="text-maestro-bone/40 text-sm tracking-widest">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Ãrea de la tarjeta con swipe */}
        <div
          className="relative px-6 pb-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Track animado */}
          <div
            className="flex transition-transform duration-500 ease-out gap-4"
            style={{ transform: `translateX(calc(-${current * 100}% - ${current * 16}px))` }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={dragging ? "#" : `/${product.category_id}/${product.slug}`}
                onClick={e => dragging && e.preventDefault()}
                className="group relative w-full flex-shrink-0 overflow-hidden bg-maestro-dark"
                style={{ height: "65vw", minHeight: 260, maxHeight: 480 }}
              >
                <img
                  src={product.image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] text-maestro-gold tracking-widest uppercase mb-1 block">
                      Ref: {product.reference}
                    </span>
                    <h3 className="text-xl text-editorial text-white">{product.name}</h3>
                  </div>
                  <div className="w-9 h-9 border border-white/30 rounded-full flex items-center justify-center text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Controles inferiores */}
        <div className="flex items-center justify-between px-6 pb-10 pt-2">
          {/* Dots */}
          <div className="flex gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-6 h-1.5 bg-maestro-gold"
                    : "w-1.5 h-1.5 bg-maestro-bone/30"
                }`}
              />
            ))}
          </div>

          {/* Flechas */}
          <div className="flex gap-3">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50 disabled:opacity-20 hover:border-maestro-gold hover:text-maestro-gold transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={current === total - 1}
              className="w-10 h-10 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50 disabled:opacity-20 hover:border-maestro-gold hover:text-maestro-gold transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          DESKTOP â€” scroll-driven horizontal pan (sin cambios)
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section ref={targetRef} className="hidden md:block relative h-[250vh] bg-maestro-carbon">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">

          <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20 pointer-events-none mix-blend-difference">
            <h2 className="text-8xl text-editorial text-maestro-bone opacity-90 leading-none">
              NEW <br /> DROP
            </h2>
            <p className="text-maestro-gold tracking-[0.3em] uppercase text-xs mt-4">Explora la colecciÃ³n</p>
          </div>

          <motion.div style={{ x }} className="flex gap-12 px-[30vw]">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/${product.category_id}/${product.slug}`}
                className="group relative w-[35vw] lg:w-[25vw] h-[70vh] flex-shrink-0 cursor-pointer overflow-hidden bg-maestro-dark"
              >
                <img
                  src={product.image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6"}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maestro-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-maestro-gold tracking-widest uppercase mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                      Ref: {product.reference}
                    </span>
                    <h3 className="text-2xl text-editorial text-maestro-bone">{product.name}</h3>
                  </div>
                  <div className="w-10 h-10 border border-maestro-bone/30 rounded-full flex items-center justify-center text-maestro-bone group-hover:bg-maestro-gold group-hover:border-maestro-gold group-hover:text-maestro-dark transition-colors duration-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
