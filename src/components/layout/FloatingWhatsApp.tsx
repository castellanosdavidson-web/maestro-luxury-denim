"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("573000000000");

  useEffect(() => {
    // Si necesitas fetchear configuraciones, aquí se haría.
  }, []);

  useEffect(() => {
    // Aparece después de 3 segundos para no ser intrusivo
    const timer = setTimeout(() => setIsVisible(true), 3000);
    // Tooltip desaparece después de 25 segundos para dar más tiempo a leer
    const tooltipTimer = setTimeout(() => setShowTooltip(true), 5000);
    const tooltipHide = setTimeout(() => setShowTooltip(false), 25000);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
      clearTimeout(tooltipHide);
    };
  }, []);

  const handleChat = () => {
    window.open("https://www.instagram.com/maestrodeninmluxury", "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Tooltip de Bienvenida */}
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl shadow-2xl max-w-[240px] pointer-events-auto mb-2 relative"
              >
                <button 
                  onClick={() => setShowTooltip(false)}
                  className="absolute top-2 right-2 p-1.5 text-white/40 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="pr-2">
                  <p className="text-[10px] tracking-widest uppercase text-maestro-gold mb-1.5 font-bold">Únete a nuestra comunidad</p>
                  <p className="text-xs text-white/80 leading-relaxed font-light">
                    Síguenos en Instagram para ver contenido exclusivo y nuevas colecciones.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Botón Principal */}
            <motion.button
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChat}
              className="group pointer-events-auto relative"
            >
              {/* Efecto de Pulso Dorado */}
              <div className="absolute inset-0 bg-maestro-gold/20 rounded-full animate-ping group-hover:hidden" />
              
              {/* Contenedor del Botón */}
              <div className="relative w-16 h-16 bg-black border border-maestro-gold/30 rounded-full flex items-center justify-center shadow-2xl overflow-hidden group">
                {/* Fondo con Gradiente Dinámico */}
                <div className="absolute inset-0 bg-gradient-to-tr from-maestro-gold/10 to-transparent group-hover:opacity-100 transition-opacity" />
                
                {/* Icono de Instagram */}
                <Instagram size={24} className="text-maestro-gold group-hover:scale-110 transition-transform duration-500" />
                
                {/* Brillo de lujo */}
                <div className="absolute top-[-100%] left-[-100%] w-[50%] h-[200%] bg-white/10 rotate-[35deg] group-hover:left-[150%] transition-all duration-[1000ms] ease-in-out" />
              </div>

              {/* Punto de Notificación sutil */}
              <div className="absolute top-1 right-1 w-3 h-3 bg-maestro-gold rounded-full border-2 border-black" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
