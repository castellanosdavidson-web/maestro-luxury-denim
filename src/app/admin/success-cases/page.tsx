"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, ImagePlus, Star, Eye, EyeOff, GripVertical, X, Check, Upload } from "lucide-react";

interface SuccessCase {
  id: number;
  name: string;
  location: string;
  quote: string;
  product: string;
  image_url: string;
  display_order: number;
  active: boolean;
}

const EMPTY: Omit<SuccessCase, "id"> = {
  name: "",
  location: "",
  quote: "",
  product: "",
  image_url: "",
  display_order: 0,
  active: true,
};

export default function AdminSuccessCases() {
  const [cases, setCases] = useState<SuccessCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SuccessCase | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCases = async () => {
    setLoading(true);
    const res = await fetch("/api/success-cases");
    const data = await res.json();
    setCases(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCases(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, display_order: cases.length + 1 });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (c: SuccessCase) => {
    setEditing(c);
    setForm({ name: c.name, location: c.location, quote: c.quote, product: c.product, image_url: c.image_url, display_order: c.display_order, active: c.active });
    setImageFile(null);
    setImagePreview(c.image_url || "");
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (imageFile) fd.append("image", imageFile);

    const url = editing ? `/api/success-cases/${editing.id}` : "/api/success-cases";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, { method, body: fd });
    if (res.ok) {
      showToast(editing ? "Caso actualizado âœ“" : "Caso creado âœ“");
      setShowModal(false);
      fetchCases();
    } else {
      showToast("Ocurrió un error", false);
    }
    setSaving(false);
  };

  const toggleActive = async (c: SuccessCase) => {
    const fd = new FormData();
    Object.entries({ ...c, active: !c.active }).forEach(([k, v]) => fd.append(k, String(v)));
    await fetch(`/api/success-cases/${c.id}`, { method: "PUT", body: fd });
    fetchCases();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este caso de éxito?")) return;
    setDeletingId(id);
    await fetch(`/api/success-cases/${id}`, { method: "DELETE" });
    showToast("Caso eliminado");
    setDeletingId(null);
    fetchCases();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 text-sm tracking-wide ${toast.ok ? "bg-maestro-gold text-black" : "bg-red-700 text-white"}`}>
          {toast.ok ? <Check size={14} /> : <X size={14} />} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/5 px-8 py-5 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-medium tracking-widest uppercase">Maestros del Estilo</h1>
            <p className="text-[10px] tracking-widest uppercase text-white/30 mt-0.5">Casos de Éxito â€” {cases.length} registros</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-maestro-gold text-black px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-white transition-colors"
        >
          <Plus size={14} /> Nuevo Caso
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">

        {/* Info banner */}
        <div className="border border-maestro-gold/20 bg-maestro-gold/5 p-5 mb-10 flex items-start gap-4">
          <Star size={16} className="text-maestro-gold mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs tracking-widest uppercase text-maestro-gold mb-1">Sección activa en el Home</p>
            <p className="text-white/50 text-sm leading-relaxed">Los casos marcados como activos aparecerán en el carrusel "Maestros del Estilo" del sitio web en el orden que definas. Se muestran máximo <strong className="text-white">5 casos</strong> a la vez.</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-6 h-6 border border-maestro-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && cases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Star size={48} className="text-white/10 mb-6" />
            <p className="text-white/30 text-sm tracking-widest uppercase mb-2">Sin casos de éxito</p>
            <p className="text-white/20 text-xs mb-8">Crea tu primer caso para que aparezca en el carrusel del Home</p>
            <button onClick={openCreate} className="flex items-center gap-2 border border-white/20 px-6 py-3 text-xs tracking-widest uppercase hover:border-maestro-gold hover:text-maestro-gold transition-colors">
              <Plus size={14} /> Crear primer caso
            </button>
          </div>
        )}

        {/* Cases grid */}
        {!loading && cases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cases.map((c) => (
              <div key={c.id} className={`relative group border transition-all duration-300 ${c.active ? "border-white/10 hover:border-maestro-gold/40" : "border-white/5 opacity-50"}`}>
                {/* Status badge */}
                <div className={`absolute top-3 left-3 z-10 text-[9px] tracking-widest uppercase px-2 py-1 ${c.active ? "bg-maestro-gold text-black" : "bg-white/10 text-white/50"}`}>
                  {c.active ? "Visible" : "Oculto"}
                </div>

                {/* Order badge */}
                <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 flex items-center justify-center text-xs text-white/40">
                  {String(c.display_order).padStart(2, "0")}
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/20">
                      <ImagePlus size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-white font-medium text-sm">{c.name || "Sin nombre"}</p>
                      <p className="text-white/40 text-xs tracking-widest uppercase mt-0.5">{c.location || "Sin ubicación"}</p>
                    </div>
                    <span className="text-[9px] tracking-widest uppercase text-maestro-gold/60 border border-maestro-gold/20 px-2 py-1 whitespace-nowrap flex-shrink-0">
                      {c.product || "Sin prenda"}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-5">
                    "{c.quote || "Sin testimonio"}"
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                    <button
                      onClick={() => openEdit(c)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase py-2 border border-white/10 hover:border-maestro-gold hover:text-maestro-gold transition-colors"
                    >
                      <Pencil size={11} /> Editar
                    </button>
                    <button
                      onClick={() => toggleActive(c)}
                      title={c.active ? "Ocultar" : "Mostrar"}
                      className="w-9 h-9 flex items-center justify-center border border-white/10 hover:border-white/30 transition-colors text-white/40 hover:text-white"
                    >
                      {c.active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="w-9 h-9 flex items-center justify-center border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-colors text-white/40"
                    >
                      {deletingId === c.id ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/90 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-[#111] border border-white/10 w-full max-w-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
              <div>
                <h2 className="text-sm font-medium tracking-widest uppercase">{editing ? "Editar Caso" : "Nuevo Caso de Éxito"}</h2>
                <p className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">{editing ? editing.name : "Completa los campos"}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">

              {/* Image upload */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-3">Foto del Cliente</label>
                <div
                  className="relative border-2 border-dashed border-white/10 hover:border-maestro-gold/40 transition-colors cursor-pointer overflow-hidden"
                  style={{ minHeight: 180 }}
                  onClick={() => fileRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-full h-56 object-cover object-top" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs tracking-widest uppercase flex items-center gap-2"><Upload size={14} /> Cambiar imagen</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-44 gap-3 text-white/20">
                      <ImagePlus size={32} />
                      <p className="text-xs tracking-widest uppercase">Clic para subir foto</p>
                      <p className="text-[10px]">JPG, PNG, WEBP â€” Recomendado: formato vertical 3:4</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Nombre del Cliente *</label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder="Ej: Valentina M."
                    className="w-full bg-black/40 border border-white/10 focus:border-maestro-gold outline-none px-4 py-3 text-sm text-white placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Ciudad / Ubicación *</label>
                  <input
                    type="text" name="location" value={form.location} onChange={handleChange} required
                    placeholder="Ej: Bogotá, Colombia"
                    className="w-full bg-black/40 border border-white/10 focus:border-maestro-gold outline-none px-4 py-3 text-sm text-white placeholder:text-white/20"
                  />
                </div>
              </div>

              {/* Product */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Prenda MAESTRO utilizada</label>
                <input
                  type="text" name="product" value={form.product} onChange={handleChange}
                  placeholder="Ej: Chaqueta Obsidiana, Vestido Crepúsculo..."
                  className="w-full bg-black/40 border border-white/10 focus:border-maestro-gold outline-none px-4 py-3 text-sm text-white placeholder:text-white/20"
                />
              </div>

              {/* Quote */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Testimonio / Cita *</label>
                <textarea
                  name="quote" value={form.quote} onChange={handleChange} required rows={4}
                  placeholder="Escribe el testimonio de la clienta tal como lo expresó..."
                  className="w-full bg-black/40 border border-white/10 focus:border-maestro-gold outline-none px-4 py-3 text-sm text-white placeholder:text-white/20 resize-none leading-relaxed"
                />
                <p className="text-[10px] text-white/20 mt-1">{form.quote.length} caracteres â€” Recomendado: entre 80 y 180</p>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Orden de aparición</label>
                  <input
                    type="number" name="display_order" value={form.display_order} onChange={handleChange} min={1} max={20}
                    className="w-full bg-black/40 border border-white/10 focus:border-maestro-gold outline-none px-4 py-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Estado</label>
                  <div className="flex gap-2 h-[46px]">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, active: true }))}
                      className={`flex-1 text-[10px] tracking-widest uppercase border transition-colors ${form.active ? "border-maestro-gold bg-maestro-gold/10 text-maestro-gold" : "border-white/10 text-white/30 hover:border-white/30"}`}
                    >
                      Visible
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, active: false }))}
                      className={`flex-1 text-[10px] tracking-widest uppercase border transition-colors ${!form.active ? "border-white/40 bg-white/5 text-white" : "border-white/10 text-white/30 hover:border-white/30"}`}
                    >
                      Oculto
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-white/10 py-3 text-xs tracking-widest uppercase text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-maestro-gold text-black py-3 text-xs tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> Guardando...</> : <><Check size={14} /> {editing ? "Actualizar Caso" : "Publicar Caso"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
