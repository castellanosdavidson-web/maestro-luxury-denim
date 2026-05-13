"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

/** Comprime una imagen usando Canvas hasta que sea <= maxMB */
async function compressImage(file: File, maxMB = 2): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_DIM = 1920;
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width >= height) { height = Math.round((height / width) * MAX_DIM); width = MAX_DIM; }
        else                 { width  = Math.round((width / height) * MAX_DIM); height = MAX_DIM; }
      }
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      // Reduce calidad hasta caber en maxMB
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) { resolve(new Blob([file])); return; }
          if (blob.size > maxMB * 1024 * 1024 && quality > 0.3) {
            quality -= 0.1;
            tryCompress();
          } else {
            resolve(blob);
          }
        }, 'image/jpeg', quality);
      };
      tryCompress();
    };
    img.src = url;
  });
}

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rawForm  = new FormData(e.currentTarget);
      const imageFile = rawForm.get('image') as File;
      const url    = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      let finalForm = rawForm;

      // Si hay imagen y supera 1.5 MB, comprimirla antes de enviar
      if (imageFile && imageFile.size > 1.5 * 1024 * 1024) {
        const compressed = await compressImage(imageFile);
        finalForm = new FormData();
        for (const [key, val] of rawForm.entries()) {
          if (key !== 'image') finalForm.append(key, val);
        }
        finalForm.append('image', compressed, imageFile.name.replace(/\.[^.]+$/, '.jpg'));
      }

      const res = await fetch(url, { method, body: finalForm });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const body = await res.json().catch(() => ({}));
        alert(`Error al guardar producto:\n\n${body?.error || `HTTP ${res.status}`}`);
      }
    } catch (e: any) {
      alert(`Error de conexión:\n\n${e?.message || e}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-editorial text-maestro-bone">Gestión de Productos</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-maestro-gold text-maestro-dark px-4 py-2 uppercase tracking-widest text-xs font-semibold hover:bg-maestro-bone transition-colors"
        >
          <Plus size={16} />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-maestro-dark border border-maestro-bone/10 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-maestro-bone/10 bg-maestro-carbon">
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal w-16">Img</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Producto</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Referencia</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Precio</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Estado</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-maestro-bone/5 hover:bg-maestro-bone/5 transition-colors">
                <td className="p-4">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-10 h-14 object-cover" />
                  ) : (
                    <div className="w-10 h-14 bg-maestro-carbon border border-maestro-bone/10" />
                  )}
                </td>
                <td className="p-4 text-sm text-maestro-bone">{p.name}</td>
                <td className="p-4 text-sm text-maestro-bone/60">{p.reference || '-'}</td>
                <td className="p-4 text-sm text-maestro-gold">${Number(p.price).toLocaleString("es-CO")}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 text-[10px] tracking-widest uppercase rounded-sm border ${
                    p.status === 'Activo' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {p.status || 'Activo'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="text-maestro-bone/40 hover:text-maestro-gold transition-colors mr-3">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-maestro-bone/40 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-maestro-bone/40 text-sm">No hay productos. Agrega uno nuevo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-maestro-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-maestro-carbon border border-maestro-bone/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button 
              onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
              className="absolute top-6 right-6 text-maestro-bone/60 hover:text-maestro-bone"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl text-editorial text-maestro-bone mb-8">
              {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Nombre</label>
                  <input required name="name" type="text" defaultValue={editingProduct?.name} className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Referencia</label>
                  <input required name="reference" type="text" defaultValue={editingProduct?.reference} className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Precio (COP)</label>
                  <input required name="price" type="number" defaultValue={editingProduct?.price} className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Estado</label>
                  <select name="status" defaultValue={editingProduct?.status || "Activo"} className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none">
                    <option value="Activo">Activo</option>
                    <option value="Agotado">Agotado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Categoría</label>
                  <select required name="categoryId" defaultValue={editingProduct?.category_id} className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none">
                    <option value="">Selecciona...</option>
                    <option value="blusas-y-corset">Blusas y Corset</option>
                    <option value="chaquetas">Chaquetas</option>
                    <option value="gabardinas">Gabardinas</option>
                    <option value="chalecos">Chalecos</option>
                    <option value="faldas">Faldas</option>
                    <option value="vestidos">Vestidos</option>
                    <option value="pantalones">Pantalones</option>
                    <option value="enterizo">Enterizo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Descripción</label>
                <textarea required name="description" rows={3} defaultValue={editingProduct?.description} className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Tallas (Separadas por coma)</label>
                  <input name="sizes" type="text" placeholder="XS, S, M, L" defaultValue={editingProduct?.sizes?.join(', ')} className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Colores (Separados por coma)</label>
                  <input name="colors" type="text" placeholder="Vintage Blue, Black" defaultValue={editingProduct?.colors?.join(', ')} className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                </div>
              </div>

              <div className="col-span-2">
                <ImageUploader
                  label={`Imagen del Producto${editingProduct ? " (opcional — dejar sin cambiar para conservar la actual)" : ""}`}
                  currentUrl={editingProduct?.image || ""}
                  initialX={editingProduct?.focal_x ?? 50}
                  initialY={editingProduct?.focal_y ?? 50}
                  initialZoom={editingProduct?.zoom ?? 100}
                  aspect="3/4"
                  hint="Formato vertical 3:4 recomendado · Min 800×1067px"
                  fieldName="image"
                  focalXName="focal_x"
                  focalYName="focal_y"
                  zoomName="zoom"
                />
              </div>

              {/* ── Galería adicional (solo en edición) ── */}
              {editingProduct && (
                <div className="col-span-2 border border-maestro-bone/10 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-maestro-bone/50 mb-0.5">Galería adicional</p>
                      <p className="text-[9px] text-maestro-bone/25">Agrega 2–3 fotos de ángulos distintos para que el cliente vea más detalle</p>
                    </div>
                    <span className="text-[9px] text-maestro-bone/30 tracking-widest">
                      {Array.isArray(editingProduct?.gallery) ? editingProduct.gallery.length : 0} / 6 fotos
                    </span>
                  </div>

                  {/* Miniaturas actuales */}
                  {Array.isArray(editingProduct?.gallery) && editingProduct.gallery.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editingProduct.gallery.map((url: string, i: number) => (
                        <div key={i} className="relative group" style={{ width: 72, height: 90 }}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm("¿Eliminar esta foto de la galería?")) return;
                              const res = await fetch(`/api/products/${editingProduct.id}/gallery`, {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ url }),
                              });
                              if (res.ok) {
                                const updated = await res.json();
                                setEditingProduct({ ...editingProduct, gallery: updated.gallery });
                              }
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white/60 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload nuevas fotos */}
                  <label className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-maestro-bone/20 hover:border-maestro-gold text-[10px] tracking-widest uppercase text-maestro-bone/40 hover:text-maestro-gold transition-all cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    Subir fotos adicionales (máx. 3 a la vez)
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []).slice(0, 3);
                        if (files.length === 0) return;
                        const fd = new FormData();
                        for (const f of files) {
                          // Comprimir antes de subir
                          if (f.size > 1.5 * 1024 * 1024) {
                            const compressed = await compressImage(f);
                            fd.append("gallery", compressed, f.name.replace(/\.[^.]+$/, ".jpg"));
                          } else {
                            fd.append("gallery", f, f.name);
                          }
                        }
                        const res = await fetch(`/api/products/${editingProduct.id}/gallery`, { method: "POST", body: fd });
                        if (res.ok) {
                          const updated = await res.json();
                          setEditingProduct({ ...editingProduct, gallery: updated.gallery });
                          fetchProducts();
                        } else {
                          alert("Error subiendo fotos. Ejecuta el SQL de migración en Supabase.");
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-maestro-gold text-maestro-dark uppercase tracking-widest text-sm font-semibold hover:bg-maestro-bone transition-colors disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : "Guardar Producto"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


