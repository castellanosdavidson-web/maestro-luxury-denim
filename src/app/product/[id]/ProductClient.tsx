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

/** Tarjeta scroll-reveal para recomendados */
function RelatedCard({ product, index }: { product: any; index: number }) {
  const ref    = useRef(null);
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
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
          ) : <div className="w-full h-full bg-maestro-carbon" />}
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-maestro-gold group-hover:w-full transition-all duration-500" />
        </div>
        <p className="text-[8px] uppercase tracking-[0.3em] text-maestro-gold/70 mb-1">{toLabel(product.category_id)}</p>
        <h3 className="text-sm text-white font-light leading-snug group-hover:text-maestro-gold transition-colors">{product.name}</h3>
        <p className="text-xs text-white/40 mt-1">${Number(product.price).toLocaleString("es-CO")}</p>
      </Link>
    </motion.div>
  );
}

export default function ProductClient({ product, related = [] }: { product: any; related?: any[] }) {
  const { addItem } = useCart();
  const [selectedSize,  setSelectedSize]  = useState(product.sizes?.[0]  || "U");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default");

  const mainImage = product.image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6?q=80&w=2000";
  const gallery   = Array.isArray(product.gallery) ? product.gallery : [];
  const allImages = [mainImage, ...gallery].filter(Boolean);

  const handleAddToCart = () => {
    addItem({
      id: product.id, name: product.name, reference: product.reference,
      price: Number(product.price), size: selectedSize, color: selectedColor,
      image: allImages[0], quantity: 1,
    });
  };

  const relatedRef    = useRef(null);
  const relatedInView = useInView(relatedRef, { once: true, margin: "-60px" });

  // Nombre del producto: nunca vacío
  const productName = (product.name && product.name.trim() !== "") ? product.name : product.reference;

  return (
    <main className="min-h-screen bg-[#050505]" style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
      <Navbar />

      {/* ── Layout principal ── */}
      <div className="flex flex-col lg:flex-row w-full min-h-screen" style={{ paddingTop: "80px" }}>

        {/* LEFT — Galería */}
        <div className="w-full lg:w-[58%] p-4 md:p-8 lg:p-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6"
            style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,245,245,0.4)" }}>
            <Link href="/" style={{ color: "rgba(245,245,245,0.4)" }} className="hover:text-maestro-gold transition-colors">Inicio</Link>
            <ChevronRight size={10} />
            <Link href="/collections" style={{ color: "rgba(245,245,245,0.4)" }} className="hover:text-maestro-gold transition-colors">Colección</Link>
            <ChevronRight size={10} />
            <span style={{ color: "#F5F5F5" }}>{productName}</span>
          </div>

          {/* Nombre — MOBILE ONLY (arriba de la galería) */}
          <div className="lg:hidden mb-6">
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
              fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              display: "block",
              marginBottom: "6px",
            }}>
              {productName}
            </h1>
            <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,245,245,0.35)" }}>
              Ref. {product.reference}
            </p>
          </div>

          <ProductGallery images={allImages} productName={productName} />
        </div>

        {/* RIGHT — Panel de info (desktop: sticky, scroll interno) */}
        <div
          className="w-full lg:w-[42%] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto no-scrollbar"
          style={{ backgroundColor: "#050505", padding: "clamp(2rem, 4vw, 4rem)" }}
        >
          <div style={{ maxWidth: "420px", width: "100%", margin: "0 auto" }}>

            {/* Nombre — DESKTOP ONLY */}
            <div className="hidden lg:block">
              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px",
              }}>
                {productName}
              </h1>
              <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,245,245,0.35)", marginBottom: "32px" }}>
                Ref. {product.reference}
              </p>
            </div>

            {/* Precio */}
            <p style={{
              fontSize: "1.5rem", color: "#F5F5F5", letterSpacing: "0.1em",
              marginBottom: "32px", paddingBottom: "28px",
              borderBottom: "1px solid rgba(245,245,245,0.08)"
            }}>
              ${Number(product.price).toLocaleString("es-CO")}
            </p>

            {/* Descripción */}
            <p style={{
              fontSize: "13px", color: "rgba(245,245,245,0.55)", fontWeight: 300,
              lineHeight: 1.8, marginBottom: "32px", textAlign: "justify"
            }}>
              {product.description || "Diseño exclusivo y confección de lujo para un estilo inigualable."}
            </p>

            {/* Material */}
            {product.material && (
              <div style={{ marginBottom: "32px", paddingBottom: "28px", borderBottom: "1px solid rgba(245,245,245,0.08)" }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8A96B", marginBottom: "4px" }}>Material</p>
                <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.65)", fontWeight: 300 }}>{product.material}</p>
              </div>
            )}

            {/* Color */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid rgba(245,245,245,0.08)" }}>
                  <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5F5F5" }}>Color</span>
                  <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,245,245,0.4)" }}>{selectedColor}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {product.colors.map((color: string) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      style={{
                        padding: "12px 24px", fontSize: "10px", letterSpacing: "0.2em",
                        textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
                        backgroundColor: "transparent",
                        border: selectedColor === color ? "1px solid #C8A96B" : "1px solid transparent",
                        color: selectedColor === color ? "#C8A96B" : "rgba(245,245,245,0.5)",
                      }}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Talla */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid rgba(245,245,245,0.08)" }}>
                  <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5F5F5" }}>Talla</span>
                  <span style={{ fontSize: "10px", color: "rgba(245,245,245,0.35)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Ruler size={10} /> Guía
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {product.sizes.map((size: string) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      style={{
                        padding: "16px 8px", fontSize: "10px", letterSpacing: "0.2em",
                        textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
                        backgroundColor: selectedSize === size ? "#F5F5F5" : "transparent",
                        border: selectedSize === size ? "none" : "1px solid rgba(245,245,245,0.2)",
                        color: selectedSize === size ? "#050505" : "#F5F5F5",
                        fontWeight: selectedSize === size ? 600 : 400,
                      }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Principal */}
            <button onClick={handleAddToCart} className="group w-full relative overflow-hidden"
              style={{
                padding: "22px", marginTop: "16px", marginBottom: "40px",
                border: "1px solid #C8A96B", backgroundColor: "transparent",
                color: "#C8A96B", fontSize: "11px", letterSpacing: "0.3em",
                textTransform: "uppercase", cursor: "pointer", fontWeight: 600,
                transition: "color 0.5s",
              }}>
              <span className="relative z-10 group-hover:text-[#050505] transition-colors duration-500">
                Añadir a la Bolsa
              </span>
              <div className="absolute inset-0 bg-[#C8A96B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" style={{ zIndex: 0 }} />
            </button>

            {/* Especificaciones */}
            {product.details?.length > 0 && (
              <div>
                <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8A96B", marginBottom: "20px" }}>Especificaciones</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {product.details.map((detail: string, idx: number) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "12px", color: "rgba(245,245,245,0.5)", marginBottom: "12px", lineHeight: 1.6 }}>
                      <span style={{ color: "#C8A96B", fontSize: "8px", marginTop: "4px" }}>✦</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Completa tu Outfit ── */}
      {related.length > 0 && (
        <section style={{ backgroundColor: "#000000", padding: "96px clamp(24px, 5vw, 80px)" }}>
          <motion.div
            ref={relatedRef}
            initial={{ opacity: 0, y: 30 }}
            animate={relatedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px" }}>
              <div>
                <p style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase", color: "#C8A96B", marginBottom: "12px" }}>Editorial</p>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#FFFFFF", fontWeight: 300, lineHeight: 1 }}>
                  Completa tu Outfit
                </h2>
              </div>
              <Link href="/collections" className="hidden md:flex items-center gap-2 group"
                style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
                <span className="group-hover:text-maestro-gold transition-colors">Ver todo</span>
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "32px" }}>
              {related.map((p: any, i: number) => (
                <RelatedCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{ padding: "12px 16px 16px", background: "linear-gradient(to top, #000 80%, transparent)" }}>
        <button onClick={handleAddToCart}
          style={{
            width: "100%", padding: "18px", backgroundColor: "#C8A96B",
            color: "#050505", fontSize: "11px", letterSpacing: "0.3em",
            textTransform: "uppercase", fontWeight: 700, border: "none", cursor: "pointer",
          }}>
          Añadir a la Bolsa — ${Number(product.price).toLocaleString("es-CO")}
        </button>
      </div>
    </main>
  );
}
