"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ChevronRight, Ruler, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import ProductGallery from "@/components/product/ProductGallery";

function toLabel(slug: string) {
  return slug?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";
}

// ── Scroll-reveal card para los productos relacionados ──
function RelatedCard({ product, index }: { product: any; index: number }) {
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden aspect-[3/4] bg-maestro-carbon mb-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-maestro-carbon" />
          )}
          {/* Gold line reveal on hover */}
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-maestro-gold group-hover:w-full transition-all duration-500" />
        </div>
        <p className="text-[8px] uppercase tracking-[0.3em] text-maestro-gold/70 mb-1">
          {toLabel(product.category_id)}
        </p>
        <h3 className="text-sm text-maestro-bone font-light leading-snug group-hover:text-maestro-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-maestro-bone/50 mt-1">
          ${Number(product.price).toLocaleString("es-CO")}
        </p>
      </Link>
    </motion.div>
  );
}

export default function ProductClient({
  product,
  related = [],
}: {
  product: any;
  related?: any[];
}) {
  const { addItem } = useCart();
  const [selectedSize,  setSelectedSize]  = useState(product.sizes?.[0]  || "U");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default");

  // Combinar imagen principal + galería adicional
  const mainImage = product.image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6?q=80&w=2000";
  const gallery   = Array.isArray(product.gallery) ? product.gallery : [];
  const allImages = [mainImage, ...gallery].filter(Boolean);

  const handleAddToCart = () => {
    addItem({
      id:        product.id,
      name:      product.name,
      reference: product.reference,
      price:     Number(product.price),
      size:      selectedSize,
      color:     selectedColor,
      image:     allImages[0],
      quantity:  1,
    });
  };

  // Ref para la sección de recomendados
  const relatedRef   = useRef(null);
  const relatedInView = useInView(relatedRef, { once: true, margin: "-60px" });

  return (
    <main className="min-h-screen bg-maestro-dark selection:bg-maestro-gold selection:text-maestro-dark">
      <Navbar />

      {/* ── Bread + Split Layout ── */}
      <div className="flex flex-col lg:flex-row w-full min-h-screen pt-20 pb-0">

        {/* Left — Galería */}
        <div className="w-full lg:w-[60%] p-4 md:p-8 lg:p-12">
          <div className="flex items-center text-[10px] text-maestro-bone/40 uppercase tracking-[0.2em] mb-6">
            <Link href="/" className="hover:text-maestro-gold transition-colors">Inicio</Link>
            <ChevronRight size={12} className="mx-2" />
            <Link href="/collections" className="hover:text-maestro-gold transition-colors">Colección</Link>
            <ChevronRight size={12} className="mx-2" />
            {/* Fix #1: Mostrar name correctamente */}
            <span className="text-maestro-bone">{product.name || product.reference}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductGallery images={allImages} productName={product.name} />
          </motion.div>
        </div>

        {/* Right Side — Sticky Info */}
        <div className="w-full lg:w-[40%] bg-maestro-dark p-8 lg:p-16 lg:sticky lg:top-0 h-auto lg:h-screen lg:overflow-y-auto no-scrollbar flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md w-full mx-auto"
          >
            {/* Fix #1: Nombre siempre visible, fuente explícita sin depender de CSS var */}
            <h1
              style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.02em" }}
              className="text-4xl lg:text-5xl text-white mb-2 leading-none uppercase"
            >
              {product.name}
            </h1>
            <p className="text-xs text-maestro-bone/40 tracking-[0.3em] uppercase mb-8">
              Ref. {product.reference}
            </p>

            <p className="text-2xl text-maestro-bone tracking-widest mb-10 border-b border-maestro-bone/10 pb-8">
              ${Number(product.price).toLocaleString("es-CO")}
            </p>

            <p className="text-sm text-maestro-bone/60 font-light leading-relaxed mb-8 tracking-wide text-justify">
              {product.description || "Diseño exclusivo y confección de lujo para un estilo inigualable."}
            </p>

            {product.material && (
              <div className="mb-10 pb-8 border-b border-maestro-bone/10">
                <p className="text-[9px] uppercase tracking-[0.3em] text-maestro-gold mb-1">Material</p>
                <p className="text-sm text-maestro-bone/70 font-light">{product.material}</p>
              </div>
            )}

            <div className="space-y-10">
              {/* Color */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-maestro-bone/10 pb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-maestro-bone">Color</span>
                  <span className="text-[10px] text-maestro-bone/50 uppercase tracking-widest">{selectedColor}</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {product.colors?.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-8 py-3 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                        selectedColor === color
                          ? 'border border-maestro-gold text-maestro-gold'
                          : 'border border-transparent text-maestro-bone/60 hover:text-maestro-bone hover:border-maestro-bone/30'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Talla */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-maestro-bone/10 pb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-maestro-bone">Talla</span>
                  <button className="text-[10px] text-maestro-bone/50 uppercase hover:text-maestro-gold flex items-center gap-2 transition-colors tracking-widest">
                    <Ruler size={10} /> Guía
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes?.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                        selectedSize === size
                          ? 'bg-maestro-bone text-maestro-dark font-semibold'
                          : 'border border-maestro-bone/20 text-maestro-bone hover:border-maestro-bone/50 hover:bg-maestro-bone/5'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToCart}
                className="w-full py-6 mt-8 border border-maestro-gold text-maestro-gold uppercase tracking-[0.3em] text-xs hover:bg-maestro-gold hover:text-maestro-dark transition-colors duration-500 font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10">Añadir a la Bolsa</span>
                <div className="absolute inset-0 bg-maestro-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] -z-0" />
                <span className="absolute inset-0 flex items-center justify-center text-maestro-dark scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] z-20">
                  Añadir a la Bolsa
                </span>
              </button>

              {/* Especificaciones */}
              {product.details?.length > 0 && (
                <div className="pt-8">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-maestro-gold mb-6">Especificaciones</h3>
                  <ul className="space-y-4">
                    {product.details.map((detail: string, idx: number) => (
                      <li key={idx} className="text-xs text-maestro-bone/60 font-light flex items-start leading-relaxed">
                        <span className="text-maestro-gold mr-3 mt-1 text-[8px]">✦</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Fix #2: Completa tu Look — Productos Relacionados ── */}
      {related.length > 0 && (
        <section className="w-full bg-black py-24 px-6 md:px-12 lg:px-20">
          <motion.div
            ref={relatedRef}
            initial={{ opacity: 0, y: 30 }}
            animate={relatedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[9px] tracking-[0.45em] uppercase text-maestro-gold mb-3">Editorial</p>
                <h2 className="text-4xl md:text-5xl font-light text-white leading-none">
                  Completa tu Outfit
                </h2>
              </div>
              <Link
                href="/collections"
                className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-maestro-gold transition-colors group"
              >
                Ver todo <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Grid de recomendados con scroll-reveal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {related.map((p: any, i: number) => (
                <RelatedCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4 pt-3 bg-gradient-to-t from-black to-transparent">
        <button
          onClick={handleAddToCart}
          className="w-full py-5 bg-maestro-gold text-maestro-dark uppercase tracking-[0.3em] text-xs font-bold"
        >
          Añadir a la Bolsa — ${Number(product.price).toLocaleString("es-CO")}
        </button>
      </div>
    </main>
  );
}
