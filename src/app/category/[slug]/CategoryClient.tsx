"use client";

import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

function toLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// Tarjeta animada individualmente
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
          {/* Gold reveal line */}
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-maestro-gold group-hover:w-full transition-all duration-500" />
          {/* Hover overlay */}
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

export default function CategoryClient({
  categoryName,
  products,
  heroImage,
}: {
  categoryName: string;
  products: any[];
  heroImage?: string;
}) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  // Parallax: imagen sube más lento que el scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY  = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const gridRef    = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-40px" });

  return (
    <main className="min-h-screen bg-maestro-dark">
      <Navbar />

      {/* ── Hero Cinematográfico con Parallax ── */}
      <section ref={heroRef} className="relative h-[80vh] overflow-hidden">
        {/* Imagen de fondo con parallax */}
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 scale-110"
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt={categoryName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-maestro-carbon" />
          )}
        </motion.div>

        {/* Gradientes */}
        <div className="absolute inset-0 bg-gradient-to-t from-maestro-dark via-maestro-dark/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-maestro-dark/60 via-transparent to-transparent" />

        {/* Contenido con parallax */}
        <motion.div
          style={{ y: textY, opacity }}
          className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-16"
        >
          {/* Breadcrumb */}
          <div className="flex items-center text-[10px] text-white/40 uppercase tracking-[0.3em] mb-6">
            <Link href="/" className="hover:text-maestro-gold transition-colors">Inicio</Link>
            <span className="mx-3">/</span>
            <span className="text-white">{categoryName}</span>
          </div>

          {/* Número watermark grande */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute top-24 right-8 md:right-16 text-[120px] md:text-[200px] font-light text-white/[0.04] select-none leading-none"
          >
            {String(products.length).padStart(2, "0")}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-px w-8 bg-maestro-gold" />
            <p className="text-[9px] text-maestro-gold tracking-[0.4em] uppercase">
              {products.length} piezas
            </p>
          </motion.div>

          {/* Título con clip animation */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl md:text-9xl font-light text-white leading-[0.9] tracking-tight"
              style={{ fontFamily: "var(--font-editorial, serif)" }}
            >
              {categoryName}
            </motion.h1>
          </div>
        </motion.div>
      </section>

      {/* ── Grid de productos con animaciones al scroll ── */}
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
