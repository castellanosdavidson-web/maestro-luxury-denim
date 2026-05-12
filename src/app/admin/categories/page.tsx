"use client";

import { useState, useEffect } from "react";
import { LayoutGrid } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

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
                  <div className="w-2 h-2 rounded-full bg-maestro-gold" />
                  <p className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/50">Imagen Principal del Home</p>
                </div>
                <ImageUploader
                  currentUrl={c.image || ""}
                  aspect="16/9"
                  hint="Aparece en la sección Colecciones del Home"
                  fieldName={`main_image_${c.id}`}
                  onChange={async (file) => {
                    if (!file) return;
                    const fd = new FormData();
                    fd.append('id', c.id);
                    fd.append('image', file);
                    const res = await fetch('/api/categories', { method: 'POST', body: fd });
                    if (res.ok) { showToast('Imagen principal actualizada ✓'); fetchCategories(); }
                  }}
                />
              </div>

              {/* Imagen Megamenu */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LayoutGrid size={13} className="text-maestro-gold" />
                  <p className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/50">Imagen Popup del Menú</p>
                </div>
                <ImageUploader
                  currentUrl={c.megamenuImage || ""}
                  aspect="3/4"
                  hint="Aparece al pasar el cursor por 'Colecciones' · Formato vertical"
                  fieldName={`menu_image_${c.id}`}
                  onChange={async (file) => {
                    if (!file) return;
                    const fd = new FormData();
                    fd.append('id', c.id);
                    fd.append('image', file);
                    fd.append('field', 'megamenu');
                    const res = await fetch('/api/categories', { method: 'PUT', body: fd });
                    if (res.ok) { showToast('Imagen del menú actualizada ✓'); fetchCategories(); }
                  }}
                />
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
