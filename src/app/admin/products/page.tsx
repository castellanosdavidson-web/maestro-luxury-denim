"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Images } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

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
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) { resolve(new Blob([file])); return; }
          if (blob.size > maxMB * 1024 * 1024 && quality > 0.3) { quality -= 0.1; tryCompress(); }
          else resolve(blob);
        }, "image/jpeg", quality);
      };
      tryCompress();
    };
    img.src = url;
  });
}

export default function AdminProducts() {
  const [products, setProducts]           = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [activeTab, setActiveTab]         = useState<"datos" | "galeria">("datos");
  const [galleryLoading, setGalleryLoading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res  = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (e) { console.error(e); }
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setActiveTab("datos");
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingProduct(null);
    setActiveTab("datos");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
    else alert("Error al eliminar");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rawForm   = new FormData(e.currentTarget);
      const imageFile = rawForm.get("image") as File;
      const url    = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      let finalForm = rawForm;
      if (imageFile && imageFile.size > 1.5 * 1024 * 1024) {
        const compressed = await compressImage(imageFile);
        finalForm = new FormData();
        for (const [key, val] of rawForm.entries()) {
          if (key !== "image") finalForm.append(key, val);
        }
        finalForm.append("image", compressed, imageFile.name.replace(/\.[^.]+$/, ".jpg"));
      }

      const res = await fetch(url, { method, body: finalForm });
      if (res.ok) {
        const saved = await res.json().catch(() => ({}));
        if (!editingProduct && saved?.id) {
          // Al crear un producto nuevo, abre edición para poder agregar galería
          const full = await fetch("/api/products").then(r => r.json());
          const newP = full.find((p: any) => p.id === saved.id) || saved;
          setEditingProduct(newP);
          setActiveTab("galeria");
          setProducts(full);
        } else {
          closeModal();
          fetchProducts();
        }
      } else {
        const body = await res.json().catch(() => ({}));
        alert(`Error al guardar:\n\n${body?.error || `HTTP ${res.status}`}`);
      }
    } catch (e: any) {
      alert(`Error:\n${e?.message || e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editingProduct) return;
    setGalleryLoading(true);
    try {
      const fd = new FormData();
      const arr = Array.from(files).slice(0, 3);
      for (const f of arr) {
        if (f.size > 1.5 * 1024 * 1024) {
          const c = await compressImage(f);
          fd.append("gallery", c, f.name.replace(/\.[^.]+$/, ".jpg"));
        } else {
          fd.append("gallery", f, f.name);
        }
      }
      const res = await fetch(`/api/products/${editingProduct.id}/gallery`, { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setEditingProduct((prev: any) => ({ ...prev, gallery: data.gallery }));
        fetchProducts();
      } else {
        const body = await res.json().catch(() => ({}));
        alert(`Error subiendo fotos:\n\n${body?.error || "Verifica que ejecutaste el SQL en Supabase"}`);
      }
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryDelete = async (url: string) => {
    if (!confirm("¿Eliminar esta foto de la galería?")) return;
    const res = await fetch(`/api/products/${editingProduct.id}/gallery`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) {
      const data = await res.json();
      setEditingProduct((prev: any) => ({ ...prev, gallery: data.gallery }));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-editorial text-maestro-bone">Gestión de Productos</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-maestro-gold text-maestro-dark px-4 py-2 uppercase tracking-widest text-xs font-semibold hover:bg-maestro-bone transition-colors"
        >
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-maestro-dark border border-maestro-bone/10 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-maestro-bone/10 bg-maestro-carbon">
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal w-16">Img</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Producto</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Referencia</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Precio</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Galería</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">Estado</th>
              <th className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-maestro-bone/5 hover:bg-maestro-bone/5 transition-colors">
                <td className="p-4">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-10 h-14 object-cover" />
                    : <div className="w-10 h-14 bg-maestro-carbon border border-maestro-bone/10" />}
                </td>
                <td className="p-4 text-sm text-maestro-bone">{p.name}</td>
                <td className="p-4 text-sm text-maestro-bone/60">{p.reference || "-"}</td>
                <td className="p-4 text-sm text-maestro-gold">${Number(p.price).toLocaleString("es-CO")}</td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-[10px] text-maestro-bone/40">
                    <Images size={11} />
                    {Array.isArray(p.gallery) ? p.gallery.length : 0}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 text-[10px] tracking-widest uppercase rounded-sm border ${
                    p.status === "Activo"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>{p.status || "Activo"}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(p)} className="text-maestro-bone/40 hover:text-maestro-gold transition-colors mr-3">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-maestro-bone/40 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-maestro-bone/40 text-sm">No hay productos. Agrega uno nuevo.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-maestro-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-maestro-carbon border border-maestro-bone/10 w-full max-w-2xl max-h-[92vh] flex flex-col relative">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-0 flex-shrink-0">
              <h2 className="text-2xl text-editorial text-maestro-bone">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={closeModal} className="text-maestro-bone/60 hover:text-maestro-bone">
                <X size={22} />
              </button>
            </div>

            {/* Tabs — solo si hay producto existente */}
            {editingProduct && (
              <div className="flex border-b border-maestro-bone/10 mt-6 px-8 flex-shrink-0">
                <button
                  onClick={() => setActiveTab("datos")}
                  className={`pb-3 mr-8 text-[10px] tracking-[0.25em] uppercase transition-all border-b-2 ${
                    activeTab === "datos"
                      ? "border-maestro-gold text-maestro-gold"
                      : "border-transparent text-maestro-bone/40 hover:text-maestro-bone"
                  }`}
                >
                  Datos del Producto
                </button>
                <button
                  onClick={() => setActiveTab("galeria")}
                  className={`pb-3 text-[10px] tracking-[0.25em] uppercase transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === "galeria"
                      ? "border-maestro-gold text-maestro-gold"
                      : "border-transparent text-maestro-bone/40 hover:text-maestro-bone"
                  }`}
                >
                  <Images size={11} />
                  Galería de Fotos
                  {Array.isArray(editingProduct?.gallery) && editingProduct.gallery.length > 0 && (
                    <span className="bg-maestro-gold text-maestro-dark text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                      {editingProduct.gallery.length}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-8 py-6">

              {/* ── TAB: Datos ── */}
              {activeTab === "datos" && (
                <form onSubmit={handleSubmit} className="space-y-6" id="product-form">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Nombre</label>
                      <input required name="name" type="text" defaultValue={editingProduct?.name}
                        className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Referencia</label>
                      <input required name="reference" type="text" defaultValue={editingProduct?.reference}
                        className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Precio (COP)</label>
                      <input required name="price" type="number" defaultValue={editingProduct?.price}
                        className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Estado</label>
                      <select name="status" defaultValue={editingProduct?.status || "Activo"}
                        className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none">
                        <option value="Activo">Activo</option>
                        <option value="Agotado">Agotado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Categoría</label>
                      <select required name="categoryId" defaultValue={editingProduct?.category_id}
                        className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none">
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
                    <textarea required name="description" rows={3} defaultValue={editingProduct?.description}
                      className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Tallas (coma)</label>
                      <input name="sizes" type="text" placeholder="XS, S, M, L" defaultValue={editingProduct?.sizes?.join(", ")}
                        className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Colores (coma)</label>
                      <input name="colors" type="text" placeholder="Vintage Blue, Black" defaultValue={editingProduct?.colors?.join(", ")}
                        className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                    </div>
                  </div>

                  <ImageUploader
                    label={`Imagen Principal${editingProduct ? " (dejar sin cambiar para conservar)" : ""}`}
                    currentUrl={editingProduct?.image || ""}
                    initialX={editingProduct?.focal_x ?? 50}
                    initialY={editingProduct?.focal_y ?? 50}
                    initialZoom={editingProduct?.zoom ?? 100}
                    aspect="3/4"
                    hint="Formato vertical 3:4 · Min 800×1067px"
                    fieldName="image"
                    focalXName="focal_x"
                    focalYName="focal_y"
                    zoomName="zoom"
                  />

                  <button type="submit" disabled={isLoading}
                    className="w-full py-4 bg-maestro-gold text-maestro-dark uppercase tracking-widest text-sm font-semibold hover:bg-maestro-bone transition-colors disabled:opacity-50">
                    {isLoading ? "Guardando..." : editingProduct ? "Guardar Cambios" : "Crear Producto y Agregar Fotos →"}
                  </button>
                </form>
              )}

              {/* ── TAB: Galería ── */}
              {activeTab === "galeria" && editingProduct && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-maestro-bone/40 tracking-wide leading-relaxed">
                      Agrega 2–3 ángulos adicionales del producto. Las fotos se muestran en el detalle del producto
                      como una galería cinematográfica con miniaturas y lightbox.
                    </p>
                  </div>

                  {/* Grid de fotos actuales */}
                  {Array.isArray(editingProduct.gallery) && editingProduct.gallery.length > 0 ? (
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-maestro-bone/40 mb-3">
                        Fotos en galería — {editingProduct.gallery.length} / 6
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {editingProduct.gallery.map((url: string, i: number) => (
                          <div key={i} className="relative group aspect-[3/4] overflow-hidden bg-maestro-dark">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                            <button
                              onClick={() => handleGalleryDelete(url)}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                            <span className="absolute bottom-2 left-2 text-[9px] text-white/50 tracking-widest">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-maestro-bone/10 p-8 text-center">
                      <Images size={32} className="text-maestro-bone/15 mx-auto mb-3" />
                      <p className="text-[10px] tracking-widest uppercase text-maestro-bone/25">Sin fotos adicionales todavía</p>
                    </div>
                  )}

                  {/* Upload */}
                  <label className={`flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed cursor-pointer transition-all ${
                    galleryLoading
                      ? "border-maestro-gold/30 text-maestro-gold/50"
                      : "border-maestro-bone/20 hover:border-maestro-gold text-maestro-bone/40 hover:text-maestro-gold"
                  }`}>
                    {galleryLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-maestro-gold border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] tracking-widest uppercase">Subiendo fotos...</p>
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                        <div className="text-center">
                          <p className="text-[10px] tracking-[0.25em] uppercase font-medium">Subir fotos adicionales</p>
                          <p className="text-[9px] text-maestro-bone/25 mt-1">Máx. 3 fotos a la vez · Se comprimen automáticamente</p>
                        </div>
                      </>
                    )}
                    <input
                      type="file" accept="image/*" multiple className="hidden"
                      disabled={galleryLoading}
                      onChange={e => handleGalleryUpload(e.target.files)}
                    />
                  </label>

                  <p className="text-[9px] text-maestro-bone/20 text-center">
                    ⚠ Requiere SQL ejecutado en Supabase: <code className="bg-white/5 px-1">ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT &apos;[]&apos;;</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
