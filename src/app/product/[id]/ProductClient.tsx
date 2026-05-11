"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ChevronRight, Ruler } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function ProductClient({ product }: { product: any }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "U");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default");

  const images = product.image 
    ? [product.image] 
    : ["https://images.unsplash.com/photo-1542272604-784c46ce5ac6?q=80&w=2000&auto=format&fit=crop"];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      reference: product.reference,
      price: Number(product.price),
      size: selectedSize,
      color: selectedColor,
      image: images[0],
      quantity: 1,
    });
  };

  return (
    <main className="min-h-screen bg-maestro-dark selection:bg-maestro-gold selection:text-maestro-dark">
      <Navbar />
      
      {/* Editorial Layout */}
      <div className="flex flex-col lg:flex-row w-full min-h-screen pt-20">
        
        {/* Left Side - Massive Imagery */}
        <div className="w-full lg:w-[60%] flex flex-col p-4 md:p-8 lg:p-12 gap-8">
          <div className="flex items-center text-[10px] text-maestro-bone/40 uppercase tracking-[0.2em] mb-4">
            <Link href="/" className="hover:text-maestro-gold transition-colors">Inicio</Link>
            <ChevronRight size={12} className="mx-2" />
            <Link href="/collections" className="hover:text-maestro-gold transition-colors">Colección</Link>
            <ChevronRight size={12} className="mx-2" />
            <span className="text-maestro-bone">{product.name}</span>
          </div>

          {images.map((img: string, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: idx * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-[70vh] lg:h-[120vh] bg-maestro-carbon overflow-hidden"
            >
              <img 
                src={img} 
                alt={`${product.name} vista ${idx}`} 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 hover:scale-105"
              />
            </motion.div>
          ))}
          
          {/* Si quieres agregar más imágenes estáticas de ambiente editorial en un futuro */}
        </div>

        {/* Right Side - Sticky Product Info */}
        <div className="w-full lg:w-[40%] bg-maestro-dark p-8 lg:p-16 lg:sticky lg:top-0 h-auto lg:h-screen lg:overflow-y-auto no-scrollbar flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md w-full mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl text-editorial text-maestro-bone mb-2 leading-none uppercase">{product.name}</h1>
            <p className="text-xs text-maestro-bone/40 tracking-[0.3em] uppercase mb-8">Ref. {product.reference}</p>
            
            <p className="text-2xl text-maestro-bone tracking-widest mb-10 border-b border-maestro-bone/10 pb-8">
              ${Number(product.price).toLocaleString("es-CO")}
            </p>
            
            <p className="text-sm text-maestro-bone/60 font-light leading-relaxed mb-12 tracking-wide text-justify">
              {product.description || "Diseño exclusivo y confección de lujo para un estilo inigualable. Cada detalle ha sido cuidadosamente seleccionado para ofrecer una experiencia premium."}
            </p>

            <div className="space-y-10">
              {/* Color Selection */}
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

              {/* Size Selection */}
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

              {/* Action Button */}
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

              {/* Editorial Details */}
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
    </main>
  );
}
