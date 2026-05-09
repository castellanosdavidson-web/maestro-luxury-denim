"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleImageUpload = async (id: string, file: File) => {
    setLoadingId(id);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchCategories();
      } else {
        alert("Error al subir la imagen");
      }
    } catch (e) {
      alert("Error al subir la imagen");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-editorial text-maestro-bone mb-8">Gestión de Categorías</h1>
      
      <div className="bg-maestro-dark border border-maestro-bone/10 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-maestro-bone/10 bg-maestro-carbon">
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal w-24">Miniatura</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Categoría</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Estado</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal text-right">Actualizar Imagen</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-b border-maestro-bone/5 hover:bg-maestro-bone/5 transition-colors">
                <td className="p-4">
                  <img src={c.image} alt={c.name} className="w-16 h-12 object-cover border border-maestro-bone/10" />
                </td>
                <td className="p-4 text-sm text-maestro-bone">{c.name}</td>
                <td className="p-4 text-sm">
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] tracking-widest uppercase rounded-sm border border-green-500/20">
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {loadingId === c.id ? (
                      <span className="text-xs text-maestro-gold">Subiendo...</span>
                    ) : (
                      <label className="cursor-pointer flex items-center gap-2 text-maestro-bone/60 hover:text-maestro-gold transition-colors text-xs uppercase tracking-widest">
                        <Upload size={14} />
                        <span className="hidden md:inline">Cambiar</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(c.id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
