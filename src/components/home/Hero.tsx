"use client";

import { motion } from "framer-motion";

// Mapa de tamaños de texto disponibles para el título
const fontSizeMap: Record<string, string> = {
  small:  "text-3xl md:text-4xl lg:text-5xl",
  medium: "text-4xl md:text-5xl lg:text-6xl",
  large:  "text-5xl md:text-6xl lg:text-7xl",
  xlarge: "text-5xl md:text-7xl lg:text-8xl",
};

// Mapa de tipografías disponibles
const fontFamilyMap: Record<string, string> = {
  editorial: "font-['Playfair_Display',serif]",
  modern:    "font-['Inter',sans-serif]",
  classic:   "font-['Georgia',serif]",
  elegant:   "font-['Cormorant_Garamond',serif]",
};

export default function Hero({ settings }: { settings?: any }) {
  const sizeClass  = fontSizeMap[settings?.heroFontSize  || "large"]  ?? fontSizeMap.large;
  const familyClass = fontFamilyMap[settings?.heroFontFamily || "editorial"] ?? fontFamilyMap.editorial;

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-maestro-dark/80 via-maestro-dark/40 to-maestro-dark/10 z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={settings?.heroImage || '/uploads/hero-custom.jpg'}
          alt="Maestro Luxury Denim Collection"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content — pt-20 deja espacio bajo el menú fijo */}
      <div className="container mx-auto px-6 md:px-12 relative z-20 pt-20">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`${sizeClass} ${familyClass} text-maestro-bone leading-[1.1] mb-6 whitespace-pre-line`}
          >
            {settings?.heroTitle || "DISEÑADO\nPARA MUJERES"}
            <span className="text-maestro-gold italic block mt-2">
              {settings?.heroSubtitle || "que imponen estilo."}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-sm md:text-base text-maestro-bone/80 tracking-[0.3em] uppercase mb-4"
          >
            {settings?.heroCaption || "Denim premium · Edición limitada"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-xs md:text-sm text-maestro-bone/60 tracking-[0.2em] font-light mb-12 uppercase"
          >
            {settings?.heroValueProp || "Confección colombiana con estándares globales"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button className="px-8 py-4 bg-maestro-bone text-maestro-dark uppercase tracking-widest text-sm hover:bg-maestro-gold transition-colors duration-300">
              Explorar colección
            </button>
            <button className="px-8 py-4 border-[0.5px] border-maestro-bone/40 text-maestro-bone uppercase tracking-widest text-sm hover:border-maestro-gold hover:text-maestro-gold transition-colors duration-300">
              Cotizar ahora
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <span className="text-maestro-bone/60 text-xs tracking-widest uppercase mb-4">Scroll</span>
        <div className="w-[1px] h-12 bg-maestro-bone/20 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 bg-maestro-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
