"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ChevronRight, Ruler } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function ProductClient({ product }: { product: any }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "U");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default");
  const [activeImage, setActiveImage] = useState(0);

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
    <main className="min-h-screen bg-maestro-dark pt-28 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center text-xs text-maestro-bone/40 uppercase tracking-widest mb-8">
          <span>Inicio</span>
          <ChevronRight size={14} className="mx-2" />
          <span>Colecciones</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-maestro-bone">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="flex flex-col md:flex-row gap-4 h-[60vh] lg:h-[80vh]">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar order-2 md:order-1 pb-2 md:pb-0">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-28 flex-shrink-0 border transition-all duration-300 ${activeImage === idx ? 'border-maestro-gold scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Vista ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-maestro-carbon relative order-1 md:order-2 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center cursor-zoom-in group-hover:scale-125 transition-transform duration-1000 origin-center"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl text-editorial text-maestro-bone mb-2">{product.name}</h1>
            <p className="text-sm text-maestro-bone/50 tracking-widest uppercase mb-6">REF: {product.reference}</p>
            <p className="text-2xl text-maestro-gold tracking-widest mb-10">${Number(product.price).toLocaleString("es-CO")}</p>
            
            <p className="text-maestro-bone/80 font-light leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm uppercase tracking-widest text-maestro-bone">Color</span>
                <span className="text-xs text-maestro-bone/50 uppercase tracking-wider">{selectedColor}</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.colors?.map((color: string) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 border text-xs tracking-widest uppercase transition-colors ${selectedColor === color ? 'border-maestro-gold text-maestro-gold' : 'border-maestro-bone/20 text-maestro-bone/60 hover:border-maestro-bone/50'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm uppercase tracking-widest text-maestro-bone">Talla</span>
                <button className="text-[10px] text-maestro-bone/50 uppercase hover:text-maestro-gold flex items-center gap-1 transition-colors tracking-widest">
                  <Ruler size={12} /> Guía de Tallas
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes?.map((size: string) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border text-sm tracking-widest transition-colors ${selectedSize === size ? 'border-maestro-bone bg-maestro-bone text-maestro-dark font-semibold' : 'border-maestro-bone/20 text-maestro-bone hover:border-maestro-bone/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full py-5 border border-maestro-gold text-maestro-gold uppercase tracking-[0.2em] text-sm hover:bg-maestro-gold hover:text-maestro-dark transition-colors duration-500 font-semibold mb-12"
            >
              Agregar a la Cotización
            </button>

            {product.details?.length > 0 && (
              <div className="border-t border-maestro-bone/10 pt-8">
                <h3 className="text-xs uppercase tracking-widest text-maestro-bone mb-6">Detalles y Cuidados</h3>
                <ul className="space-y-3">
                  {product.details.map((detail: string, idx: number) => (
                    <li key={idx} className="text-sm text-maestro-bone/60 font-light flex items-center before:content-[''] before:w-1 before:h-1 before:bg-maestro-gold before:rounded-full before:mr-3">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
