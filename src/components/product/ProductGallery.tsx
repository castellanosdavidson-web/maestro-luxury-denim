"use client";

import { useState, useEffect, useCallback, useRef, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive]       = useState(0);
  const [lightbox, setLightbox]   = useState(false);
  const [lightboxIdx, setLbIdx]   = useState(0);
  const [direction, setDirection] = useState(1);

  const total = images.length;

  const go = useCallback((idx: number, dir: number) => {
    // startTransition: marca la actualizaciÃ³n como no urgente â†’ no bloquea el hilo
    startTransition(() => {
      setDirection(dir);
      setActive(Math.max(0, Math.min(idx, total - 1)));
    });
  }, [total]);

  // Auto-slideshow
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      startTransition(() => {
        setDirection(1);
        setActive(prev => (prev + 1) % total);
      });
    }, 6000);
  }, [total]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  const lbGo = useCallback((idx: number, dir: number) => {
    startTransition(() => {
      setDirection(dir);
      setLbIdx(Math.max(0, Math.min(idx, total - 1)));
    });
  }, [total]);

  // Keyboard nav â€” passive donde aplica
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") lbGo(lightboxIdx + 1,  1);
      if (e.key === "ArrowLeft")  lbGo(lightboxIdx - 1, -1);
      if (e.key === "Escape")     startTransition(() => setLightbox(false));
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, lightboxIdx, lbGo]);

  if (total === 0) return null;

  const slideVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ?  40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 :  40 }),
  };

  return (
    <>
      {/* â”€â”€ Main gallery â”€â”€ */}
      <div className="flex flex-col gap-3">

        {/* Hero image */}
        <div
          className="relative w-full overflow-hidden bg-maestro-carbon group"
          style={{
            aspectRatio: total === 1 ? "3/4" : "4/5",
            willChange: "transform",          // hint al compositor de GPU
          }}
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={`${productName} â€” vista ${active + 1}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ willChange: "opacity, transform" }}
              loading="eager"
            />
          </AnimatePresence>

          {/* Zoom */}
          <button
            onClick={() => { setLbIdx(active); startTransition(() => setLightbox(true)); }}
            className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Ampliar imagen"
          >
            <ZoomIn size={14} />
          </button>

          {/* Counter */}
          {total > 1 && (
            <div className="absolute bottom-4 left-4 text-[10px] tracking-widest uppercase text-white/50 bg-black/30 backdrop-blur-sm px-2 py-1 pointer-events-none">
              {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>
          )}

          {/* Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={() => go(active - 1, -1)}
                disabled={active === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-0 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => go(active + 1, 1)}
                disabled={active === total - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-0 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => go(i, i > active ? 1 : -1)}
                className={`flex-shrink-0 overflow-hidden transition-all duration-300 ${
                  i === active
                    ? "border-2 border-maestro-gold opacity-100"
                    : "border border-transparent opacity-40 hover:opacity-70"
                }`}
                style={{ width: 64, height: 80 }}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* â”€â”€ Lightbox â”€â”€ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => startTransition(() => setLightbox(false))}
          >
            {/* Close */}
            <button
              onClick={() => startTransition(() => setLightbox(false))}
              className="absolute top-6 right-6 w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-[10px] tracking-widest uppercase text-white/40 z-10 pointer-events-none">
              {String(lightboxIdx + 1).padStart(2, "00")} / {String(total).padStart(2, "0")}
            </div>

            {/* Image */}
            <AnimatePresence custom={direction} mode="wait">
              <motion.img
                key={lightboxIdx}
                src={images[lightboxIdx]}
                alt={`${productName} ${lightboxIdx + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="max-h-[85vh] max-w-[90vw] object-contain"
                style={{ willChange: "opacity, transform" }}
                onClick={e => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Arrows */}
            {lightboxIdx > 0 && (
              <button
                onClick={e => { e.stopPropagation(); lbGo(lightboxIdx - 1, -1); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
                aria-label="Anterior"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {lightboxIdx < total - 1 && (
              <button
                onClick={e => { e.stopPropagation(); lbGo(lightboxIdx + 1, 1); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
                aria-label="Siguiente"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); lbGo(i, i > lightboxIdx ? 1 : -1); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === lightboxIdx ? "w-6 h-1.5 bg-maestro-gold" : "w-1.5 h-1.5 bg-white/30"
                  }`}
                  aria-label={`Imagen ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
