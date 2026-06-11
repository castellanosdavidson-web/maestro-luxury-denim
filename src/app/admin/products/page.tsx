"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, Images, Upload } from "lucide-react";
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
        else { width = Math.round((width / height) * MAX_DIM); height = MAX_DIM; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      let quality = 0.85;
      const run = () => canvas.toBlob((blob) => {
        if (!blob) { resolve(new Blob([file])); return; }
        if (blob.size > maxMB * 1024 * 1024 && quality > 0.3) { quality -= 0.1; run(); }
        else resolve(blob);
      }, "image/jpeg", quality);
      run();
    };
    img.src = url;
  });
}

export default function AdminProducts() {
  const [products, setProducts]           = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  // Local gallery state for the modal (mirrors editingProduct.gallery)
  const [localGallery, setLocalGallery]   = useState<string[]>([]);
  const [savedId, setSavedId]             = useState<string | null>(null); // id after creating

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res  = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setLocalGallery(Array.isArray(p.gallery) ? p.gallery : []);
    setSavedId(p.id);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingProduct(null);
    setLocalGallery([]);
    setSavedId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setLocalGallery([]);
    setSavedId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
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
      const productId = savedId || editingProduct?.id;
      const url    = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";

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
        if (!productId && saved?.id) {
          // Producto nuevo creado: quedarse en el modal para galería
          setSavedId(saved.id);
          setEditingProduct(saved);
          fetchProducts();
          alert("âœ“ Producto creado. Ahora puedes subir fotos adicionales de galería.");
        } else {
          closeModal();
          fetchProducts();
        }
      } else {
        const body = await res.json().catch(() => ({}));
        alert(`Error al guardar:\n\n${body?.error || `HTTP ${res.status}`}`);
      }
    } catch (e: any) {
      alert(`Error:\n${e?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGalleryUpload = async (files: File[]) => {
    const pid = savedId || editingProduct?.id;
    if (!pid || files.length === 0) return;
    setGalleryLoading(true);
    try {
      const fd = new FormData();
      for (const f of files.slice(0, 6)) {
        const blob = f.size > 1.5 * 1024 * 1024 ? await compressImage(f) : f;
        fd.append("gallery", blob, f.name.replace(/\.[^.]+$/, ".jpg"));
      }
      const res = await fetch(`/api/products/${pid}/gallery`, { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setLocalGallery(data.gallery);
        fetchProducts();
      } else {
        const b = await res.json().catch(() => ({}));
        alert(`Error subiendo fotos:\n\n${b?.error || "Verifica el SQL en Supabase"}`);
      }
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryDelete = async (url: string) => {
    const pid = savedId || editingProduct?.id;
    if (!pid) return;
    if (!confirm("¿Eliminar esta foto?")) return;
    const res = await fetch(`/api/products/${pid}/gallery`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) {
      const data = await res.json();
      setLocalGallery(data.gallery);
    }
  };

  const currentId = savedId || editingProduct?.id;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-editorial text-maestro-bone">Gestión de Productos</h1>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-maestro-gold text-maestro-dark px-4 py-2 uppercase tracking-widest text-xs font-semibold hover:bg-maestro-bone transition-colors">
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-maestro-dark border border-maestro-bone/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-maestro-bone/10 bg-maestro-carbon">
              {["Img","Producto","Referencia","Precio","Galería","Estado",""].map(h => (
                <th key={h} className="p-4 text-xs text-maestro-bone/60 uppercase tracking-widest font-normal">{h}</th>
              ))}
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
                    <Images size={11} /> {Array.isArray(p.gallery) ? p.gallery.length : 0}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] tracking-widest uppercase border ${
                    p.status === "Activo"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>{p.status || "Activo"}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(p)} className="text-maestro-bone/40 hover:text-maestro-gold mr-3"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-maestro-bone/40 hover:text-red-400"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-maestro-bone/40 text-sm">No hay productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-maestro-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-maestro-carbon border border-maestro-bone/10 w-full max-w-2xl max-h-[92vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-maestro-bone/10 flex-shrink-0">
              <h2 className="text-2xl text-editorial text-maestro-bone">
                {editingProduct ? "Editar Producto" : currentId ? "Agregar Fotos de Galería" : "Nuevo Producto"}
              </h2>
              <button onClick={closeModal} className="text-maestro-bone/60 hover:text-maestro-bone"><X size={22} /></button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">

              {/* â”€â”€ FORM: datos del producto â”€â”€ */}
              <form onSubmit={handleSubmit} className="space-y-6" id="product-form">
                {/* FILA 1: Nombre + Referencia */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Nombre</label>
                    <input required name="name" type="text" defaultValue={editingProduct?.name}
                      className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Referencia</label>
                    <input required name="reference" type="text" defaultValue={editingProduct?.reference}
                      className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                  </div>
                </div>

                {/* FILA 2: Material (campo completo) */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Material</label>
                  <input name="material" type="text"
                    placeholder="Ej: 100% Denim Premium, Mezcla de algodón y elastano..."
                    defaultValue={editingProduct?.material}
                    className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                </div>

                {/* FILA 3: Talla + Color */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Tallas (coma)</label>
                    <input name="sizes" type="text" placeholder="XS, S, M, L" defaultValue={editingProduct?.sizes?.join(", ")}
                      className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Colores (coma)</label>
                    <input name="colors" type="text" placeholder="Vintage Blue, Black" defaultValue={editingProduct?.colors?.join(", ")}
                      className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                  </div>
                </div>

                {/* FILA 4: Precio + Estado + Categoría */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Precio (COP)</label>
                    <input required name="price" type="number" defaultValue={editingProduct?.price}
                      className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Estado</label>
                    <select name="status" defaultValue={editingProduct?.status || "Activo"}
                      className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none">
                      <option value="Activo">Activo</option>
                      <option value="Agotado">Agotado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Categoría</label>
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

                {/* FILA 5: Descripción */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-maestro-bone/60 mb-2">Descripción</label>
                  <textarea required name="description" rows={3} defaultValue={editingProduct?.description}
                    className="w-full bg-maestro-dark border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none" />
                </div>

                <ImageUploader
                  label={`Imagen Principal${editingProduct ? " (dejar vacío para conservar)" : ""}`}
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
                  {isLoading ? "Guardando..." : editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </form>


              {/* â”€â”€ GALERÍA: siempre visible si hay un ID â”€â”€ */}
              {currentId && (
                <div className="border-t border-maestro-bone/10 pt-6 space-y-4">
                  {/* Header galería */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-maestro-gold mb-0.5 flex items-center gap-2">
                        <Images size={11} /> Fotos Adicionales de Galería
                      </p>
                      <p className="text-[9px] text-maestro-bone/30">
                        Muestra el producto desde varios ángulos · {localGallery.length} / 6 fotos
                      </p>
                    </div>
                  </div>

                  {/* Grid fotos actuales */}
                  {localGallery.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {localGallery.map((url, i) => (
                        <div key={i} className="relative group aspect-[3/4] overflow-hidden bg-maestro-dark">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                          <button onClick={() => handleGalleryDelete(url)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={11} />
                          </button>
                          <span className="absolute bottom-1.5 left-2 text-[9px] text-white/40">{String(i + 1).padStart(2, "0")}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Zona upload múltiple */}
                  <label className={`flex flex-col items-center justify-center gap-3 w-full py-7 border-2 border-dashed cursor-pointer transition-all ${
                    galleryLoading
                      ? "border-maestro-gold/40 opacity-60 pointer-events-none"
                      : "border-maestro-bone/20 hover:border-maestro-gold"
                  }`}>
                    {galleryLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-5 h-5 border-2 border-maestro-gold border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] tracking-widest uppercase text-maestro-gold">Subiendo...</p>
                      </div>
                    ) : (
                      <>
                        <Upload size={18} className="text-maestro-bone/30" />
                        <div className="text-center">
                          <p className="text-[10px] tracking-[0.2em] uppercase text-maestro-bone/50">Subir fotos adicionales</p>
                          <p className="text-[9px] text-maestro-bone/25 mt-1">Selecciona varias a la vez · Se comprimen automáticamente</p>
                        </div>
                      </>
                    )}
                    <input
                      type="file" accept="image/*" multiple className="hidden"
                      disabled={galleryLoading}
                      onChange={e => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) handleGalleryUpload(files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Hint si aún no hay ID */}
              {!currentId && (
                <div className="border border-dashed border-maestro-bone/10 p-4 text-center">
                  <p className="text-[9px] text-maestro-bone/25 tracking-wide">
                    Primero crea el producto â†’ luego aparece aquí la sección de galería para subir fotos adicionales
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
