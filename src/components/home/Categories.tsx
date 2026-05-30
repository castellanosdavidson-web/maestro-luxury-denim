"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

interface Category {
  id: string;
  name: string;
  image: string;
  categoryImage?: string;
  focal_x?: number;
  focal_y?: number;
  status?: string;
}

// â”€â”€ Layout DESKTOP: patrÃ³n editorial con anchos variables â”€â”€
const ROW_PATTERNS = [
  [65, 35],
  [35, 65],
  [40, 30, 30],
  [30, 40, 30],
];

const desktopHeight = (pct: number) =>
  pct >= 60 ? 560 : pct >= 40 ? 480 : 400;

function buildRows(cats: Category[]) {
  const rows: Category[][] = [];
  let i = 0, patternIdx = 0;
  while (i < cats.length) {
    const pattern = ROW_PATTERNS[patternIdx % ROW_PATTERNS.length];
    const chunk   = cats.slice(i, i + pattern.length);
    if (chunk.length > 0) rows.push(chunk);
    i += chunk.length;
    patternIdx++;
  }
  return { rows, patterns: ROW_PATTERNS };
}

// â”€â”€ Tarjeta desktop â”€â”€
function DesktopCard({
  cat, widthPct, isHovered,
  onEnter, onLeave,
}: {
  cat: Category; widthPct: number; isHovered: boolean;
  onEnter: () => void; onLeave: () => void;
}) {
  const height = desktopHeight(widthPct);
  return (
    <Link
      href={`/category/${toSlug(cat.id)}`}
      className="relative overflow-hidden flex-shrink-0 block"
      style={{ width: `${widthPct}%`, height }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Imagen */}
      <div
        className="absolute inset-0 transition-transform duration-[1400ms] ease-out will-change-transform"
        style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
      >
        {cat.image
          ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover"
              style={{ objectPosition: `${cat.focal_x ?? 50}% ${cat.focal_y ?? 50}%` }} />
          : <div className="w-full h-full bg-white/5" />}
      </div>

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-maestro-gold/10 transition-opacity duration-500"
        style={{ opacity: isHovered ? 1 : 0 }} />

      {/* LÃ­nea diagonal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ opacity: isHovered ? 1 : 0, transition: "opacity 600ms" }}>
        <div className="absolute bg-maestro-gold"
          style={{
            width: 1, height: "140%", top: "-20%",
            left: widthPct >= 60 ? "38%" : "50%",
            transform: "rotate(25deg)", opacity: 0.15,
          }} />
      </div>

      {/* Contenido */}
      <div className="absolute inset-x-0 bottom-0 p-8">
        {/* Barra gold */}
        <div className="h-px bg-maestro-gold mb-4 transition-all duration-700 ease-out origin-left"
          style={{
            width: isHovered ? (widthPct >= 60 ? "60px" : "40px") : "0px",
            opacity: isHovered ? 1 : 0,
          }} />

        {/* Nombre */}
        <h3
          className="font-light text-white leading-none tracking-tight transition-transform duration-500"
          style={{
            fontSize: widthPct >= 60 ? "clamp(2rem, 4vw, 3.5rem)"
                    : widthPct >= 40 ? "clamp(1.6rem, 3vw, 2.5rem)"
                    : "clamp(1.3rem, 2.5vw, 2rem)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            fontFamily: "var(--font-editorial, serif)",
          }}
        >
          {cat.name}
        </h3>

        {/* CTA */}
        <div className="flex items-center gap-3 mt-3 transition-all duration-500"
          style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? "translateY(0)" : "translateY(8px)" }}>
          <span className="text-[9px] tracking-[0.35em] uppercase text-maestro-gold">Explorar colecciÃ³n</span>
          <ArrowRight size={10} className="text-maestro-gold" />
        </div>
      </div>
    </Link>
  );
}

// â”€â”€ Tarjeta MOBILE: grid 2 columnas, texto siempre visible â”€â”€
function MobileCard({ cat, tall = false }: { cat: Category; tall?: boolean }) {
  return (
    <Link
      href={`/category/${toSlug(cat.id)}`}
      className="relative overflow-hidden block w-full rounded-none"
      style={{ height: tall ? 340 : 260 }}
    >
      {/* Imagen */}
      <div className="absolute inset-0">
        {cat.image
          ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover"
              style={{ objectPosition: `${cat.focal_x ?? 50}% ${cat.focal_y ?? 50}%` }}
              loading="lazy" />
          : <div className="w-full h-full bg-white/5" />}
      </div>

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Nombre â€” siempre visible, nunca se corta */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3
          className="font-light text-white leading-tight"
          style={{
            fontFamily: "var(--font-editorial, serif)",
            fontSize: "clamp(1.25rem, 5vw, 1.75rem)",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          {cat.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-px w-5 bg-maestro-gold" />
          <span className="text-[9px] tracking-[0.25em] uppercase text-maestro-gold/80">Ver</span>
        </div>
      </div>
    </Link>
  );
}

export default function Categories({ categories }: { categories?: Category[] }) {
  const cats = (categories || []).filter(c => c.status !== "Inactiva");
  const [hovered, setHovered] = useState<string | null>(null);

  if (cats.length === 0) return null;

  const { rows, patterns } = buildRows(cats);

  return (
    <section className="bg-black overflow-hidden">
      {/* â”€â”€ Header â”€â”€ */}
      <div className="px-6 md:px-12 pt-20 pb-10 flex items-end justify-between">
        <div>
          <p className="text-[9px] tracking-[0.5em] uppercase text-maestro-gold mb-3">Editorial</p>
          <h2 className="text-5xl md:text-7xl font-light text-white leading-none tracking-tight">
            Colecciones
          </h2>
        </div>
        <Link
          href="/collections"
          className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-maestro-gold transition-colors group"
        >
          Ver todo
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* â”€â”€ MOBILE: grid 2 columnas â”€â”€ */}
      <div className="md:hidden flex flex-col gap-[3px]">
        {/* Primera fila: 1 tarjeta grande (full width) */}
        {cats[0] && (
          <MobileCard cat={cats[0]} tall />
        )}
        {/* Resto: pares de 2 columnas */}
        {cats.slice(1).reduce((acc: Category[][], cat, i) => {
          if (i % 2 === 0) acc.push([cat]);
          else acc[acc.length - 1].push(cat);
          return acc;
        }, []).map((pair, rowIdx) => (
          <div key={rowIdx} className="flex gap-[3px]">
            {pair.map(cat => (
              <div key={cat.id} className="flex-1 min-w-0">
                <MobileCard cat={cat} />
              </div>
            ))}
            {/* Si el par tiene solo 1 elemento (Ãºltimo impar), full width */}
            {pair.length === 1 && <div className="flex-1 min-w-0" />}
          </div>
        ))}
      </div>

      {/* â”€â”€ DESKTOP: grid editorial con anchos variables â”€â”€ */}
      <div className="hidden md:flex flex-col gap-[3px]">
        {rows.map((row, rowIdx) => {
          const pattern = patterns[rowIdx % patterns.length];
          return (
            <div key={rowIdx} className="flex gap-[3px]">
              {row.map((cat, colIdx) => {
                const widthPct  = pattern[colIdx] ?? Math.floor(100 / row.length);
                const isHovered = hovered === cat.id;
                return (
                  <DesktopCard
                    key={cat.id}
                    cat={cat}
                    widthPct={widthPct}
                    isHovered={isHovered}
                    onEnter={() => setHovered(cat.id)}
                    onLeave={() => setHovered(null)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* â”€â”€ CTA mÃ³vil â”€â”€ */}
      <div className="flex md:hidden justify-center py-10 px-6">
        <Link
          href="/collections"
          className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-maestro-gold border border-white/10 hover:border-maestro-gold px-8 py-4 transition-all"
        >
          Ver todas las colecciones <ArrowRight size={11} />
        </Link>
      </div>
    </section>
  );
}
