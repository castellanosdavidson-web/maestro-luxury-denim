"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

function toLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// Tarjeta de producto animada al scroll
function AnimatedCard({ p, i }: { p: any; i: number }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${p.id}`} className="group block cursor-pointer">
        <div className="relative overflow-hidden aspect-[3/4] bg-maestro-carbon mb-4">
          <img
            src={p.image || ""}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-maestro-gold group-hover:w-full transition-all duration-500" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
            <span className="text-[9px] uppercase tracking-[0.3em] text-maestro-gold">Ver producto →</span>
          </div>
        </div>
        <h3 className="text-sm tracking-widest uppercase text-maestro-bone group-hover:text-maestro-gold transition-colors">
          {p.name}
        </h3>
        <p className="text-maestro-gold text-sm mt-1">${Number(p.price).toLocaleString("es-CO")}</p>
      </Link>
    </motion.div>
  );
}

// ── Carrusel Hero Cinematográfico ──
function HeroCarousel({
  slides,
  categoryName,
  totalProducts,
}: {
  slides: { image: string; name: string; id: string }[];
  categoryName: string;
  totalProducts: number;
}) {
  const [current, setCurrent] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY  = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Auto-advance cada 4.5s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section ref={heroRef} className="relative h-[80vh] overflow-hidden">
      {/* Imágenes con crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {slides[current]?.image ? (
            <img
              src={slides[current].image}
              alt={slides[current].name}
              className="w-full h-full object-cover"
              style={{ imageRendering: "auto" }}
            />
          ) : (
            <div className="w-full h-full bg-maestro-carbon" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradientes */}
      <div className="absolute inset-0 bg-gradient-to-t from-maestro-dark via-maestro-dark/40 to-black/20 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-maestro-dark/50 via-transparent to-transparent z-10" />

      {/* Contenido con parallax */}
      <motion.div
        style={{ y: textY, opacity }}
        className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-16 z-20"
      >
        {/* Breadcrumb */}
        <div className="flex items-center text-[10px] text-white/40 uppercase tracking-[0.3em] mb-6">
          <Link href="/" className="hover:text-maestro-gold transition-colors">Inicio</Link>
          <span className="mx-3">/</span>
          <span className="text-white">{categoryName}</span>
        </div>

        {/* Número watermark */}
        <div className="absolute top-28 right-8 md:right-16 text-[120px] md:text-[200px] font-light text-white/[0.04] select-none leading-none pointer-events-none">
          {String(totalProducts).padStart(2, "0")}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="h-px w-8 bg-maestro-gold" />
          <p className="text-[9px] text-maestro-gold tracking-[0.4em] uppercase">
            {totalProducts} piezas
          </p>
        </motion.div>

        {/* Título principal */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-6xl md:text-9xl font-light text-white leading-[0.9] tracking-tight"
          >
            {categoryName}
          </motion.h1>
        </div>

        {/* Nombre del producto actual en el carrusel */}
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.4em] text-white/50 mt-2"
          >
            {slides[current]?.name}
          </motion.p>
        </AnimatePresence>

        {/* Dots del carrusel */}
        {slides.length > 1 && (
          <div className="flex gap-2 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-500 h-[2px] rounded-full ${
                  i === current ? "w-8 bg-maestro-gold" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

export default function CategoryClient({
  categoryName,
  products,
  heroSlides,
}: {
  categoryName: string;
  products: any[];
  heroSlides: { image: string; name: string; id: string }[];
}) {
  const gridRef    = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-40px" });

  return (
    <main className="min-h-screen bg-maestro-dark">
      <Navbar />

      {/* ── Carrusel Hero ── */}
      <HeroCarousel
        slides={heroSlides}
        categoryName={categoryName}
        totalProducts={products.length}
      />

      {/* ── Grid de productos ── */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-32">
        <motion.div
          ref={gridRef}
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
        >
          {products.length === 0 ? (
            <p className="text-maestro-bone/60 text-center py-24 tracking-widest uppercase text-sm">
              No hay productos en esta categoría por ahora.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((p: any, i: number) => (
                <AnimatedCard key={p.id} p={p} i={i} />
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
}
