"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

// Patrón de layout que se repite: define anchos % por fila
const ROW_PATTERNS = [
  [65, 35],          // fila 1: grande izq + pequeño der
  [35, 65],          // fila 2: pequeño izq + grande der
  [40, 30, 30],      // fila 3: tres tarjetas
  [30, 40, 30],      // fila 4: tres tarjetas variado
];

// Alturas en px por tamaño de columna
const colHeight = (pct: number) =>
  pct >= 60 ? 560 : pct >= 40 ? 480 : 400;

function buildRows(cats: Category[]) {
  const rows: Category[][] = [];
  let i = 0;
  let patternIdx = 0;
  while (i < cats.length) {
    const pattern = ROW_PATTERNS[patternIdx % ROW_PATTERNS.length];
    const chunk   = cats.slice(i, i + pattern.length);
    if (chunk.length > 0) rows.push(chunk);
    i          += chunk.length;
    patternIdx += 1;
  }
  return { rows, patterns: ROW_PATTERNS };
}

export default function Categories({ categories }: { categories?: Category[] }) {
  const cats = (categories || []).filter(c => c.status !== "Inactiva");
  const [hovered, setHovered] = useState<string | null>(null);

  if (cats.length === 0) return null;

  const { rows, patterns } = buildRows(cats);

  return (
    <section className="bg-black overflow-hidden">
      {/* ── Header ── */}
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

      {/* ── Grid editorial ── */}
      <div className="flex flex-col gap-[3px]">
        {rows.map((row, rowIdx) => {
          const pattern = patterns[rowIdx % patterns.length];
          return (
            <div key={rowIdx} className="flex gap-[3px]">
              {row.map((cat, colIdx) => {
                const widthPct = pattern[colIdx] ?? Math.floor(100 / row.length);
                const height   = colHeight(widthPct);
                const isHovered = hovered === cat.id;
                const globalIdx = cats.indexOf(cat);

                return (
                  <Link
                    key={cat.id}
                    href={`/category/${toSlug(cat.id)}`}
                    className="relative overflow-hidden flex-shrink-0 block"
                    style={{ width: `${widthPct}%`, height }}
                    onMouseEnter={() => setHovered(cat.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* ── Imagen ── */}
                    <div
                      className="absolute inset-0 transition-transform duration-[1400ms] ease-out will-change-transform"
                      style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
                    >
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: `${cat.focal_x ?? 50}% ${cat.focal_y ?? 50}%` }}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5" />
                      )}
                    </div>

                    {/* ── Gradiente base ── */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                    {/* ── Overlay dorado al hover ── */}
                    <div
                      className="absolute inset-0 bg-maestro-gold/10 transition-opacity duration-500"
                      style={{ opacity: isHovered ? 1 : 0 }}
                    />

                    {/* ── Número grande watermark ── */}
                    <div
                      className="absolute top-5 right-5 font-light leading-none select-none pointer-events-none transition-all duration-500"
                      style={{
                        fontSize: widthPct >= 60 ? "7rem" : "5rem",
                        color: isHovered ? "rgba(201,169,110,0.25)" : "rgba(255,255,255,0.06)",
                        lineHeight: 1,
                        fontFamily: "var(--font-editorial, serif)",
                      }}
                    >
                      {String(globalIdx + 1).padStart(2, "0")}
                    </div>

                    {/* ── Línea diagonal decorativa ── */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ opacity: isHovered ? 1 : 0, transition: "opacity 600ms" }}
                    >
                      <div
                        className="absolute bg-maestro-gold"
                        style={{
                          width: 1,
                          height: "140%",
                          top: "-20%",
                          left: widthPct >= 60 ? "38%" : "50%",
                          transform: "rotate(25deg)",
                          opacity: 0.15,
                        }}
                      />
                    </div>

                    {/* ── Contenido inferior ── */}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      {/* Barra dorada animada */}
                      <div
                        className="h-px bg-maestro-gold mb-4 transition-all duration-700 ease-out origin-left"
                        style={{
                          width: isHovered ? (widthPct >= 60 ? "60px" : "40px") : "0px",
                          opacity: isHovered ? 1 : 0,
                        }}
                      />

                      {/* Nombre de categoría */}
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
                      <div
                        className="flex items-center gap-3 mt-3 transition-all duration-500"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered ? "translateY(0)" : "translateY(8px)",
                        }}
                      >
                        <span className="text-[9px] tracking-[0.35em] uppercase text-maestro-gold">
                          Explorar colección
                        </span>
                        <ArrowRight size={10} className="text-maestro-gold" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── CTA móvil ── */}
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
