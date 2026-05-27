"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  price: number;
  image: string;
  category_id: string;
}

function toLabel(slug: string) {
  return (slug || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function highlight(text: string, query: string) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-maestro-gold/30 text-maestro-gold rounded-none px-0.5">{part}</mark>
      : part
  );
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<Product[]>([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 320);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-24 px-4">

        {/* Search Input */}
        <div className="flex items-center border-b-2 border-maestro-gold bg-transparent pb-4 mb-8">
          <Search size={22} className="text-maestro-gold mr-4 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Buscar por nombre, referencia o categoría..."
            className="flex-1 bg-transparent text-white text-xl md:text-2xl font-light tracking-wide placeholder:text-white/25 outline-none"
          />
          {loading && <Loader2 size={18} className="text-maestro-gold animate-spin mr-3" />}
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors ml-2">
            <X size={22} />
          </button>
        </div>

        {/* Suggestions / hint before search */}
        {!searched && query.length < 2 && (
          <div className="text-center py-8">
            <p className="text-white/20 text-sm tracking-widest uppercase">
              Escribe al menos 2 caracteres para buscar
            </p>
          </div>
        )}

        {/* No results */}
        {searched && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40 text-sm tracking-widest uppercase mb-2">Sin resultados para</p>
            <p className="text-maestro-gold text-xl font-light">"{query}"</p>
            <p className="text-white/20 text-xs tracking-widest uppercase mt-4">
              Intenta con el nombre del producto, referencia o categoría
            </p>
          </div>
        )}

        {/* Results grid */}
        {results.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5">
              {results.length} resultado{results.length !== 1 ? "s" : ""} para &quot;{query}&quot;
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[55vh] overflow-y-auto pr-1 pb-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#C9A96E20 transparent" }}>
              {results.map(p => (
                <Link
                  key={p.id}
                  href={`/${p.category_id}/${p.slug}`}
                  onClick={onClose}
                  className="group flex flex-col bg-white/5 hover:bg-white/10 border border-white/5 hover:border-maestro-gold/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden bg-black/20 relative">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <Search size={24} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col gap-1">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-maestro-gold/60">
                      {toLabel(p.category_id)}
                    </p>
                    <h3 className="text-xs text-white leading-snug group-hover:text-maestro-gold transition-colors">
                      {highlight(p.name, query)}
                    </h3>
                    {p.reference && (
                      <p className="text-[9px] text-white/30 tracking-widest">
                        Ref. {highlight(p.reference, query)}
                      </p>
                    )}
                    <p className="text-xs text-white/60 mt-0.5">
                      ${Number(p.price).toLocaleString("es-CO")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Ver todos en colecciones */}
            <div className="flex justify-center mt-6 pt-4 border-t border-white/5">
              <Link
                href={`/collections`}
                onClick={onClose}
                className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-maestro-gold transition-colors group"
              >
                Ver colección completa
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
