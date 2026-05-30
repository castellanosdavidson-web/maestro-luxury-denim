"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Aurora from "@/components/Aurora";

// Mapa de tamaÃ±os de texto disponibles para el tÃ­tulo
const fontSizeMap: Record<string, string> = {
  small:  "text-4xl md:text-5xl lg:text-6xl",
  medium: "text-5xl md:text-6xl lg:text-7xl",
  large:  "text-6xl md:text-7xl lg:text-8xl",
  xlarge: "text-7xl md:text-8xl lg:text-[10rem]",
};

// Mapa de tipografÃ­as disponibles
const fontFamilyMap: Record<string, string> = {
  editorial: "font-['Playfair_Display',serif]",
  modern:    "font-['Inter',sans-serif]",
  classic:   "font-['Georgia',serif]",
  elegant:   "font-['Cormorant_Garamond',serif]",
};

export default function Hero({ settings }: { settings?: any }) {
  const sizeClass  = fontSizeMap[settings?.heroFontSize  || "large"]  ?? fontSizeMap.large;
  const familyClass = fontFamilyMap[settings?.heroFontFamily || "editorial"] ?? fontFamilyMap.editorial;
  
  // Ticker text
  const marqueeText = settings?.heroMarquee || "ENVÃO GRATIS A TODA COLOMBIA â€¢ CAMBIOS SIN COSTO â€¢ COLECCIÃ“N LIMITADA â€¢ ";
  const linkText    = settings?.heroLinkText || "Explorar ColecciÃ³n";

  // Dividir el tÃ­tulo en palabras para la animaciÃ³n secuencial
  const titleText = settings?.heroTitle || "DISEÃ‘ADO\nPARA MUJERES";
  const words = titleText.split(/(\s+)/);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-maestro-dark flex flex-col justify-between">
      
      {/* â”€â”€ Background Media (Aurora / Video / Image) â”€â”€ */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-maestro-dark/90 via-maestro-dark/40 to-maestro-dark/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-maestro-dark/80 via-transparent to-transparent z-10" />
        
        {settings?.heroVideo ? (
          <motion.video
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={settings.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
          />
        ) : settings?.heroImage ? (
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={settings?.heroImage}
            alt="Maestro Luxury Denim Collection"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full bg-maestro-dark"
          >
            <Aurora
              colorStops={["#111111", "#c9a96e", "#111111"]}
              blend={0.5}
              amplitude={1.2}
              speed={0.5}
            />
          </motion.div>
        )}
      </div>

      {/* â”€â”€ Main Content (Center) â”€â”€ */}
      <div className="relative z-20 flex-1 flex items-center pt-24 pb-10">
        <div className="container mx-auto px-6 md:px-12 w-full">
          <div className="max-w-4xl">
            
            {/* AnimaciÃ³n del Caption Superior */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-8 bg-maestro-gold" />
              <p className="text-[9px] md:text-[10px] text-maestro-gold tracking-[0.4em] uppercase">
                {settings?.heroCaption || "Denim premium Â· EdiciÃ³n limitada"}
              </p>
            </motion.div>

            {/* AnimaciÃ³n de TÃ­tulo (Palabra por palabra) */}
            <h1 className={`${sizeClass} ${familyClass} text-white leading-[1] mb-4 whitespace-pre-wrap flex flex-wrap`}>
              {words.map((word: string, i: number) => {
                if (word.match(/\s+/)) {
                  return <span key={i}>{word}</span>;
                }
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>

            {/* SubtÃ­tulo ItÃ¡lico */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className={`${familyClass} text-maestro-gold italic block text-3xl md:text-5xl mb-8`}
            >
              {settings?.heroSubtitle || "que imponen estilo."}
            </motion.span>

            {/* Propuesta de valor */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-xs md:text-sm text-white/60 tracking-[0.25em] font-light mb-12 uppercase max-w-lg"
            >
              {settings?.heroValueProp || "ConfecciÃ³n colombiana con estÃ¡ndares globales"}
            </motion.p>

            {/* BotÃ³n MagnÃ©tico CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <Link 
                href="/collections"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-black overflow-hidden transition-transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 w-0 bg-maestro-gold transition-all duration-[250ms] ease-out group-hover:w-full" />
                <span className="relative text-[11px] uppercase tracking-[0.3em] font-medium group-hover:text-white transition-colors">
                  {linkText}
                </span>
              </Link>
            </motion.div>

          </div>
        </div>
      </div>

      {/* â”€â”€ Marquee Footer / Cinta Animada â”€â”€ */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="relative z-20 w-full border-t border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex items-center h-12"
      >
        {/* El contenido se duplica para lograr un scroll infinito perfecto */}
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex whitespace-nowrap"
        >
          {/* Primer bloque */}
          <span className="text-[10px] text-white/70 uppercase tracking-[0.3em] mx-4">
            {marqueeText}
          </span>
          <span className="text-[10px] text-white/70 uppercase tracking-[0.3em] mx-4">
            {marqueeText}
          </span>
          <span className="text-[10px] text-white/70 uppercase tracking-[0.3em] mx-4">
            {marqueeText}
          </span>
          <span className="text-[10px] text-white/70 uppercase tracking-[0.3em] mx-4">
            {marqueeText}
          </span>
        </motion.div>
      </motion.div>

    </section>
  );
}
