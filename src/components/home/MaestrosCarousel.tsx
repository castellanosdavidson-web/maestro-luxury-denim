"use client";

import { useState, useRef, useEffect } from "react";

interface Maestro {
  name: string;
  location: string;
  quote: string;
  product: string;
  image: string;
  number: string;
}

const MAESTROS: Maestro[] = [
  {
    number: "01",
    name: "Valentina M.",
    location: "Bogotá, Colombia",
    quote: "Nunca pensé que un denim me haría sentir tan poderosa. Las miradas en la oficina lo dicen todo.",
    product: "Chaqueta Obsidiana",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
  },
  {
    number: "02",
    name: "Isabella R.",
    location: "Medellín, Colombia",
    quote: "Invertí en piezas MAESTRO y nunca volví a preocuparme por mi guardarropa. Calidad que se siente desde el primer uso.",
    product: "Vestido Crepúsculo",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
  },
  {
    number: "03",
    name: "Camila S.",
    location: "Cali, Colombia",
    quote: "Lo que diferencia a MAESTRO es la forma en que moldea el cuerpo. Es denim que entiende a la mujer.",
    product: "Falda Horizonte",
    image: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80",
  },
  {
    number: "04",
    name: "Daniela P.",
    location: "Cartagena, Colombia",
    quote: "Cada prenda cuenta una historia. Tengo tres piezas MAESTRO y con cada una me siento como en una editorial de moda.",
    product: "Chaleco Dorado",
    image: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=80",
  },
  {
    number: "05",
    name: "Ana Lucía T.",
    location: "Barranquilla, Colombia",
    quote: "Mi compra más inteligente del año. Denim que no se arruga, que no destiñe y que con el tiempo se adapta perfectamente a mi figura.",
    product: "Pantalón Celosía",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  },
];

export default function MaestrosCarousel() {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number, dir: "left" | "right") => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setIsAnimating(false);
    }, 350);
  };

  const next = () => goTo((active + 1) % MAESTROS.length, "right");
  const prev = () => goTo((active - 1 + MAESTROS.length) % MAESTROS.length, "left");

  useEffect(() => {
    autoplayRef.current = setInterval(next, 5000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [active]);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    setStartX("touches" in e ? e.touches[0].clientX : e.clientX);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };
  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    setDragging(false);
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = startX - endX;
    if (diff > 50) next();
    else if (diff < -50) prev();
  };

  const current = MAESTROS[active];

  return (
    <section className="relative bg-maestro-carbon overflow-hidden py-24 md:py-32">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-[120px]"
          style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }}
        />
      </div>

      {/* Section header */}
      <div className="container mx-auto px-6 md:px-12 mb-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-maestro-gold mb-3">Casos de Éxito</p>
            <h2 className="text-4xl md:text-6xl font-light text-maestro-bone leading-none tracking-tight">
              Maestros<br /><span className="italic text-maestro-gold">del Estilo</span>
            </h2>
          </div>
          {/* Navigation arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50 hover:border-maestro-gold hover:text-maestro-gold transition-all duration-300 group"
              aria-label="Anterior"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <button
              onClick={next}
              className="w-12 h-12 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50 hover:border-maestro-gold hover:text-maestro-gold transition-all duration-300 group"
              aria-label="Siguiente"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main carousel */}
      <div
        ref={trackRef}
        className="container mx-auto px-6 md:px-12 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>

          {/* Image panel */}
          <div className="md:col-span-5 relative">
            <div className="relative overflow-hidden aspect-[3/4]">
              <img
                src={current.image}
                alt={current.name}
                className="absolute inset-0 w-full h-full object-cover object-top scale-105 transition-transform duration-700"
                draggable={false}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-maestro-carbon via-maestro-carbon/20 to-transparent" />
              {/* Number watermark */}
              <div className="absolute top-6 right-6 text-[80px] leading-none font-light text-maestro-bone/5 pointer-events-none">
                {current.number}
              </div>
              {/* Product tag */}
              <div className="absolute bottom-6 left-6">
                <span className="text-[9px] tracking-[0.3em] uppercase text-maestro-gold/80 border border-maestro-gold/30 px-3 py-1.5">
                  {current.product}
                </span>
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div className="md:col-span-7 flex flex-col justify-center py-8 md:py-0 md:pl-8">
            {/* Big quote mark */}
            <div className="text-[120px] leading-none text-maestro-gold/10 font-serif mb-0 -mb-8 select-none">"</div>

            {/* Quote */}
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-maestro-bone leading-relaxed mb-10">
              {current.quote}
            </blockquote>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-maestro-gold/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-maestro-gold/40" />
            </div>

            {/* Author info */}
            <div className="mb-12">
              <p className="text-maestro-bone text-lg tracking-wide">{current.name}</p>
              <p className="text-maestro-bone/40 text-xs tracking-[0.2em] uppercase mt-1">{current.location}</p>
            </div>

            {/* Dot navigation + counter */}
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                {MAESTROS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > active ? "right" : "left")}
                    className="relative h-0.5 transition-all duration-500 overflow-hidden"
                    style={{ width: i === active ? "40px" : "16px" }}
                    aria-label={`Ir a ${MAESTROS[i].name}`}
                  >
                    <span className="absolute inset-0 bg-maestro-bone/20" />
                    <span
                      className="absolute inset-0 bg-maestro-gold transition-all duration-500"
                      style={{ transform: i === active ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left" }}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/30">
                {String(active + 1).padStart(2, "0")} / {String(MAESTROS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav arrows */}
      <div className="md:hidden flex justify-center gap-4 mt-10">
        <button onClick={prev} className="w-10 h-10 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50 active:border-maestro-gold active:text-maestro-gold" aria-label="Anterior">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <button onClick={next} className="w-10 h-10 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50 active:border-maestro-gold active:text-maestro-gold" aria-label="Siguiente">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Bottom strip — thumbnail strip */}
      <div className="container mx-auto px-6 md:px-12 mt-12 hidden md:flex gap-2">
        {MAESTROS.map((m, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > active ? "right" : "left")}
            className={`relative flex-1 aspect-[3/1] overflow-hidden transition-all duration-500 ${i === active ? "opacity-100 scale-100" : "opacity-30 hover:opacity-60 scale-95 hover:scale-100"}`}
            aria-label={`Ver ${m.name}`}
          >
            <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top" draggable={false} />
            {i === active && (
              <div className="absolute inset-0 border border-maestro-gold/60" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
