"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function FeaturedShowcase({ products }: { products: any[] }) {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  if (!products || products.length === 0) return null;

  return (
    <section ref={targetRef} className="relative h-[250vh] bg-maestro-carbon">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Encabezado fijo al lado */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 pointer-events-none mix-blend-difference">
          <h2 className="text-6xl md:text-8xl text-editorial text-maestro-bone opacity-90 leading-none">
            NEW <br /> DROP
          </h2>
          <p className="text-maestro-gold tracking-[0.3em] uppercase text-xs mt-4">
            Explora la colección
          </p>
        </div>

        {/* Contenedor horizontal */}
        <motion.div style={{ x }} className="flex gap-12 px-[30vw]">
          {products.map((product, idx) => (
            <Link 
              key={product.id} 
              href={`/product/${product.id}`}
              className="group relative w-[70vw] md:w-[35vw] lg:w-[25vw] h-[60vh] md:h-[70vh] flex-shrink-0 cursor-pointer overflow-hidden bg-maestro-dark"
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
  );
}
