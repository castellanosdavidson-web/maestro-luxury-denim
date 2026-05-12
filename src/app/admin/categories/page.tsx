"use client";

import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, LayoutGrid } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories]   = useState<any[]>([]);
  const [loadingId, setLoadingId]     = useState<string | null>(null);
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [toast, setToast]             = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = async () => {
    const res  = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleUpload = async (id: string, file: File, field: 'main' | 'megamenu') => {
    setLoadingId(id);
    setLoadingField(field);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('image', file);

    const method = field === 'megamenu' ? 'PUT' : 'POST';
    if (field === 'megamenu') formData.append('field', 'megamenu');

    try {
      const res = await fetch('/api/categories', { method, body: formData });
      if (res.ok) {
        showToast(field === 'megamenu' ? 'Imagen del megamenu actualizada ✓' : 'Imagen principal actualizada ✓');
        fetchCategories();
      } else {
        showToast("Error al subir la imagen");
      }
    } catch {
      showToast("Error al subir la imagen");
    } finally {
      setLoadingId(null);
      setLoadingField(null);
    }
  };

  const isLoading = (id: string, field: string) => loadingId === id && loadingField === field;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-maestro-gold text-black px-5 py-3 text-xs tracking-widest uppercase">
          {toast}
        </div>
      )}

      <h1 className="text-3xl text-editorial text-maestro-bone mb-3">Gestión de Categorías</h1>
      <p className="text-maestro-bone/40 text-sm mb-8">
        Cada categoría tiene <strong className="text-maestro-bone/70">dos imágenes</strong>: la imagen principal (que aparece en el Home) y la imagen del popup del menú superior al pasar el cursor por "Colecciones".
      </p>

      <div className="space-y-4">
        {categories.map(c => (
          <div key={c.id} className="bg-maestro-dark border border-maestro-bone/10 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-maestro-bone font-medium tracking-widest uppercase text-sm">{c.name}</p>
                <span className="text-[10px] tracking-widest uppercase text-green-400 border border-green-500/20 bg-green-500/10 px-2 py-0.5 mt-1 inline-block">
                  {c.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Imagen Principal */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon size={13} className="text-maestro-gold" />
                  <p className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/50">Imagen Principal del Home</p>
                </div>
                <div className="relative aspect-video overflow-hidden bg-maestro-carbon border border-maestro-bone/10 mb-3">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-maestro-bone/20 text-xs">Sin imagen</div>
                  )}
                </div>
                <label className={`flex items-center justify-center gap-2 w-full py-2.5 border text-[10px] tracking-widest uppercase cursor-pointer transition-colors ${isLoading(c.id, 'main') ? 'border-maestro-gold/30 text-maestro-gold/50' : 'border-maestro-bone/20 text-maestro-bone/50 hover:border-maestro-gold hover:text-maestro-gold'}`}>
                  {isLoading(c.id, 'main') ? (
                    <><div className="w-3 h-3 border border-maestro-gold border-t-transparent rounded-full animate-spin" /> Subiendo...</>
                  ) : (
                    <><Upload size={12} /> Cambiar imagen principal</>
                  )}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleUpload(c.id, e.target.files[0], 'main'); }} />
                </label>
              </div>

              {/* Imagen Megamenu */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LayoutGrid size={13} className="text-maestro-gold" />
                  <p className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/50">Imagen del Popup (Menú)</p>
                </div>
                <div className="relative aspect-video overflow-hidden bg-maestro-carbon border border-maestro-bone/10 mb-3">
                  {c.megamenuImage ? (
                    <img src={c.megamenuImage} alt={`${c.name} megamenu`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-maestro-bone/20 text-xs gap-1">
                      <LayoutGrid size={20} className="opacity-30" />
                      <span>Usa la imagen principal como fallback</span>
                    </div>
                  )}
                </div>
                <label className={`flex items-center justify-center gap-2 w-full py-2.5 border text-[10px] tracking-widest uppercase cursor-pointer transition-colors ${isLoading(c.id, 'megamenu') ? 'border-maestro-gold/30 text-maestro-gold/50' : 'border-maestro-bone/20 text-maestro-bone/50 hover:border-maestro-gold hover:text-maestro-gold'}`}>
                  {isLoading(c.id, 'megamenu') ? (
                    <><div className="w-3 h-3 border border-maestro-gold border-t-transparent rounded-full animate-spin" /> Subiendo...</>
                  ) : (
                    <><Upload size={12} /> Cambiar imagen del popup</>
                  )}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleUpload(c.id, e.target.files[0], 'megamenu'); }} />
                </label>
                <p className="text-[10px] text-maestro-bone/20 mt-2 text-center">Recomendado: formato vertical 3:4</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="flex items-center justify-center h-48 text-maestro-bone/20 text-sm tracking-widest uppercase">
          No hay categorías registradas
        </div>
      )}
    </div>
  );
}
