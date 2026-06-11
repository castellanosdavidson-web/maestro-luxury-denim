"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Maestro {
  id: number;
  name: string;
  location: string;
  quote: string;
  product: string;
  image_url: string;
  display_order: number;
  active: boolean;
}

const FALLBACK: Maestro[] = [
  { id: 1, name: "Valentina M.", location: "Bogotá, Colombia", quote: "Nunca pensé que un denim me haría sentir tan poderosa. Las miradas en la oficina lo dicen todo.", product: "Chaqueta Obsidiana", image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", display_order: 1, active: true },
  { id: 2, name: "Isabella R.", location: "Medellín, Colombia", quote: "Invertí en piezas MAESTRO y nunca volví a preocuparme por mi guardarropa. Calidad que se siente desde el primer uso.", product: "Vestido Crepúsculo", image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80", display_order: 2, active: true },
  { id: 3, name: "Camila S.", location: "Cali, Colombia", quote: "Lo que diferencia a MAESTRO es la forma en que moldea el cuerpo. Es denim que entiende a la mujer.", product: "Falda Horizonte", image_url: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80", display_order: 3, active: true },
  { id: 4, name: "Daniela P.", location: "Cartagena, Colombia", quote: "Cada prenda cuenta una historia. Tengo tres piezas MAESTRO y con cada una me siento como en una editorial de moda.", product: "Chaleco Dorado", image_url: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=80", display_order: 4, active: true },
  { id: 5, name: "Ana Lucía T.", location: "Barranquilla, Colombia", quote: "Mi compra más inteligente del año. Denim que no se arruga, que no destiñe y que con el tiempo se adapta perfectamente.", product: "Pantalón Celosía", image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", display_order: 5, active: true },
];

export default function MaestrosCarousel() {
  const [maestros, setMaestros] = useState<Maestro[]>([]);
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/success-cases")
      .then(r => r.json())
      .then((data: Maestro[]) => {
        const active = Array.isArray(data) ? data.filter(d => d.active) : [];
        setMaestros(active.length > 0 ? active : FALLBACK);
      })
      .catch(() => setMaestros(FALLBACK));
  }, []);

  const goTo = (idx: number) => {
    if (isAnimating || maestros.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setIsAnimating(false);
    }, 350);
  };

  const next = () => goTo((active + 1) % maestros.length);
  const prev = () => goTo((active - 1 + maestros.length) % maestros.length);

  useEffect(() => {
    if (maestros.length === 0) return;
    autoplayRef.current = setInterval(next, 5500);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [active, maestros.length]);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    setStartX("touches" in e ? e.touches[0].clientX : e.clientX);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };
  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    setDragging(false);
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    if (startX - endX > 50) next();
    else if (startX - endX < -50) prev();
  };

  if (maestros.length === 0) return null;

  const current = maestros[active];
  const orderLabel = String(active + 1).padStart(2, "0");
  const totalLabel = String(maestros.length).padStart(2, "0");

  return (
    <section className="relative bg-maestro-carbon overflow-hidden py-24 md:py-32">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.04] blur-[150px] bg-maestro-gold" />
      </div>

      {/* Section header */}
      <div className="container mx-auto px-6 md:px-12 mb-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-maestro-gold mb-3">Casos de Éxito</p>
            <h2 className="text-4xl md:text-6xl font-light text-maestro-bone leading-none tracking-tight">
              Maestros<br /><em className="text-maestro-gold not-italic">del Estilo</em>
            </h2>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-3">
            <button onClick={prev} aria-label="Anterior"
              className="w-12 h-12 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50 hover:border-maestro-gold hover:text-maestro-gold transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
            <button onClick={next} aria-label="Siguiente"
              className="w-12 h-12 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50 hover:border-maestro-gold hover:text-maestro-gold transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="container mx-auto px-6 md:px-12 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onDragStart} onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
        onTouchStart={onDragStart} onTouchEnd={onDragEnd}
      >
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-10 transition-opacity duration-350 ${isAnimating ? "opacity-0" : "opacity-100"}`}>

          {/* Image */}
          <div className="md:col-span-5 relative">
            <div className="relative overflow-hidden aspect-[3/4]">
              <Image
                src={current.image_url}
                alt={current.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top scale-105"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maestro-carbon via-maestro-carbon/20 to-transparent" />
              <div className="absolute top-6 right-6 text-[100px] leading-none font-light text-maestro-bone/5 pointer-events-none select-none">
                {orderLabel}
              </div>
              {current.product && (
                <div className="absolute bottom-6 left-6">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-maestro-gold/80 border border-maestro-gold/30 px-3 py-1.5 bg-black/30 backdrop-blur-sm">
                    {current.product}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-7 flex flex-col justify-center py-8 md:py-0 md:pl-4">
            <div className="text-[120px] leading-[0.7] text-maestro-gold/10 font-serif mb-4 select-none">"</div>
            <blockquote className="text-2xl md:text-3xl lg:text-[2.2rem] font-light text-maestro-bone leading-relaxed mb-10">
              {current.quote}
            </blockquote>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-maestro-gold/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-maestro-gold/40" />
            </div>
            <div className="mb-12">
              <p className="text-maestro-bone text-lg tracking-wide">{current.name}</p>
              <p className="text-maestro-bone/40 text-xs tracking-[0.2em] uppercase mt-1">{current.location}</p>
            </div>

            {/* Dot nav + counter */}
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                {maestros.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} aria-label={`Ver caso ${i + 1}`}
                    className="relative h-0.5 transition-all duration-500 overflow-hidden"
                    style={{ width: i === active ? "40px" : "16px" }}>
                    <span className="absolute inset-0 bg-maestro-bone/20" />
                    <span className="absolute inset-0 bg-maestro-gold transition-transform duration-500"
                      style={{ transform: i === active ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left" }} />
                  </button>
                ))}
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/30">
                {orderLabel} / {totalLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex justify-center gap-4 mt-10">
        <button onClick={prev} aria-label="Anterior" className="w-10 h-10 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <button onClick={next} aria-label="Siguiente" className="w-10 h-10 border border-maestro-bone/20 flex items-center justify-center text-maestro-bone/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Thumbnail strip */}
      {maestros.length > 1 && (
        <div className="container mx-auto px-6 md:px-12 mt-12 hidden md:flex gap-2">
          {maestros.map((m, i) => (
            <button key={m.id} onClick={() => goTo(i)} aria-label={`Ver ${m.name}`}
              className={`relative flex-1 aspect-[3/1] overflow-hidden transition-all duration-500 ${i === active ? "opacity-100 scale-100" : "opacity-30 hover:opacity-60 scale-95 hover:scale-100"}`}>
              <Image src={m.image_url} alt={m.name} fill sizes="10vw" className="object-cover object-top" draggable={false} />
              {i === active && <div className="absolute inset-0 border border-maestro-gold/60" />}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
