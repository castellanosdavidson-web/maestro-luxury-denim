"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { gtagBeginCheckout } from "@/lib/analytics";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, removeItem, updateQuantity, totalItems, totalPrice, generateWhatsAppLink } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-maestro-dark/80 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-maestro-carbon z-50 shadow-2xl flex flex-col border-l border-maestro-bone/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-maestro-bone/10 flex justify-between items-center">
              <h2 className="text-xl text-editorial text-maestro-bone uppercase tracking-widest flex items-center gap-3">
                <ShoppingBag size={20} />
                Mi Bolsa ({totalItems})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-maestro-bone/60 hover:text-maestro-gold transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-maestro-bone/50">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="uppercase tracking-widest text-sm">Tu bolsa de compras está vacía</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="w-24 h-32 bg-maestro-dark rounded-sm overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-maestro-bone leading-tight pr-4">{item.name}</h3>
                            <button onClick={() => removeItem(item.id, item.size)} className="text-maestro-bone/40 hover:text-maestro-gold flex-shrink-0">
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-[10px] text-maestro-bone/50 tracking-widest mt-1">REF: {item.reference}</p>
                          <p className="text-[11px] text-maestro-bone/60 mt-2 uppercase tracking-wider">
                            T: <span className="text-maestro-bone">{item.size}</span> | C: <span className="text-maestro-bone">{item.color}</span>
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-maestro-bone/20 rounded-sm">
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="px-2 py-1 text-maestro-bone/60 hover:text-maestro-bone">
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs text-maestro-bone">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="px-2 py-1 text-maestro-bone/60 hover:text-maestro-bone">
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-sm text-maestro-gold tracking-widest">${(item.price * item.quantity).toLocaleString("es-CO")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-maestro-bone/10 bg-maestro-dark/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest text-maestro-bone/60">Subtotal</span>
                  <span className="text-xl text-maestro-gold tracking-widest">${totalPrice.toLocaleString("es-CO")}</span>
                </div>
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // GA4: begin_checkout
                    gtagBeginCheckout(items, totalPrice);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-4 bg-maestro-bone text-maestro-dark uppercase tracking-widest text-sm hover:bg-maestro-gold transition-colors duration-300 flex items-center justify-center font-semibold"
                >
                  Finalizar Compra
                </a>
                <p className="text-[10px] text-center text-maestro-bone/40 mt-4 uppercase tracking-widest">
                  Te contactaremos para confirmar disponibilidad y envío
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
