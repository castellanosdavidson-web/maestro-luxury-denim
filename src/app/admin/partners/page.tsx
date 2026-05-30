"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, ImagePlus, Handshake, Eye, EyeOff, X, Check, Upload } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  website_url: string;
  logo_url: string;
  status: string;
}

const EMPTY: Omit<Partner, "id"> = {
  name: "",
  website_url: "",
  logo_url: "",
  status: "Activo",
};

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPartners = async () => {
    setLoading(true);
    const res = await fetch("/api/partners");
    const data = await res.json();
    setPartners(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchPartners(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (p: Partner) => {
    setEditing(p);
    setForm({ name: p.name, website_url: p.website_url, logo_url: p.logo_url, status: p.status });
    setImageFile(null);
    setImagePreview(p.logo_url || "");
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (imageFile) fd.append("image", imageFile);

    const url = editing ? `/api/partners/${editing.id}` : "/api/partners";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, { method, body: fd });
    if (res.ok) {
      showToast(editing ? "Aliado actualizado âœ“" : "Aliado creado âœ“");
      setShowModal(false);
      fetchPartners();
    } else {
      showToast("OcurriÃ³ un error", false);
    }
    setSaving(false);
  };

  const toggleStatus = async (p: Partner) => {
    const newStatus = p.status === "Activo" ? "Inactivo" : "Activo";
    const fd = new FormData();
    Object.entries({ ...p, status: newStatus }).forEach(([k, v]) => fd.append(k, String(v)));
    await fetch(`/api/partners/${p.id}`, { method: "PUT", body: fd });
    fetchPartners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Â¿Eliminar este aliado permanentemente?")) return;
    setDeletingId(id);
    await fetch(`/api/partners/${id}`, { method: "DELETE" });
    showToast("Aliado eliminado");
    setDeletingId(null);
    fetchPartners();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 text-sm tracking-wide ${toast.ok ? "bg-maestro-gold text-black" : "bg-red-700 text-white"}`}>
          {toast.ok ? <Check size={14} /> : <X size={14} />} {toast.msg}
        </div>
      )}

      <header className="border-b border-white/5 px-8 py-5 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-medium tracking-widest uppercase">Alianzas y Colaboraciones</h1>
            <p className="text-[10px] tracking-widest uppercase text-white/30 mt-0.5">{partners.length} marcas aliadas</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-maestro-gold text-black px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-white transition-colors"
        >
          <Plus size={14} /> Nuevo Aliado
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="border border-maestro-gold/20 bg-maestro-gold/5 p-5 mb-10 flex items-start gap-4">
          <Handshake size={16} className="text-maestro-gold mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs tracking-widest uppercase text-maestro-gold mb-1">Logos en el Footer de la tienda</p>
            <p className="text-white/50 text-sm leading-relaxed">Los aliados marcados como activos aparecerÃ¡n en el carrusel continuo que se muestra al final de la pÃ¡gina. Puedes desactivarlos temporalmente en caso de finalizar una colaboraciÃ³n sin perder su informaciÃ³n.</p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-6 h-6 border border-maestro-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && partners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Handshake size={48} className="text-white/10 mb-6" />
            <p className="text-white/30 text-sm tracking-widest uppercase mb-2">Sin aliados</p>
            <p className="text-white/20 text-xs mb-8">Agrega el logo de tu primera marca aliada.</p>
            <button onClick={openCreate} className="flex items-center gap-2 border border-white/20 px-6 py-3 text-xs tracking-widest uppercase hover:border-maestro-gold hover:text-maestro-gold transition-colors">
              <Plus size={14} /> Crear aliado
            </button>
          </div>
        )}

        {!loading && partners.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {partners.map((p) => (
              <div key={p.id} className={`relative group border transition-all duration-300 bg-white/5 ${p.status === "Activo" ? "border-white/10 hover:border-maestro-gold/40" : "border-white/5 opacity-50"}`}>
                <div className={`absolute top-2 left-2 z-10 text-[9px] tracking-widest uppercase px-2 py-0.5 ${p.status === "Activo" ? "bg-maestro-gold text-black" : "bg-white/10 text-white/50"}`}>
                  {p.status}
                </div>

                <div className="relative aspect-square overflow-hidden flex items-center justify-center p-4 bg-white/5">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <ImagePlus size={32} className="text-white/20" />
                  )}
                </div>

                <div className="p-4 border-t border-white/5">
                  <p className="text-white font-medium text-xs mb-1 truncate">{p.name || "Sin nombre"}</p>
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noreferrer" className="text-[9px] text-maestro-gold/60 tracking-widest hover:text-maestro-gold truncate block mb-3">
                      {p.website_url}
                    </a>
                  )}

                  <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                    <button onClick={() => openEdit(p)} className="flex-1 text-[9px] tracking-widest uppercase py-1.5 border border-white/10 hover:border-maestro-gold hover:text-maestro-gold transition-colors flex justify-center">
                      <Pencil size={11} />
                    </button>
                    <button onClick={() => toggleStatus(p)} title={p.status === "Activo" ? "Desactivar" : "Activar"} className="w-7 h-7 flex items-center justify-center border border-white/10 hover:border-white/30 text-white/40 hover:text-white transition-colors">
                      {p.status === "Activo" ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="w-7 h-7 flex items-center justify-center border border-white/10 hover:border-red-500/50 hover:text-red-400 text-white/40 transition-colors">
                      {deletingId === p.id ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={11} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/90 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-[#111] border border-white/10 w-full max-w-lg mt-10">
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
              <div>
                <h2 className="text-sm font-medium tracking-widest uppercase">{editing ? "Editar Aliado" : "Nuevo Aliado"}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-3">Logo de la marca *</label>
                <div
                  className="relative border-2 border-dashed border-white/10 hover:border-maestro-gold/40 transition-colors cursor-pointer overflow-hidden flex items-center justify-center bg-black/40"
                  style={{ height: 160 }}
                  onClick={() => fileRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full p-4 flex justify-center">
                      <img src={imagePreview} alt="preview" className="max-w-full max-h-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs tracking-widest uppercase flex items-center gap-2"><Upload size={14} /> Cambiar logo</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-white/20">
                      <Upload size={24} />
                      <p className="text-xs tracking-widest uppercase">Clic para subir logo</p>
                      <p className="text-[9px]">Fondo transparente (PNG/WEBP)</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} required={!editing} />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">Nombre del Aliado *</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="Ej: Vogue, Inexmoda..."
                  className="w-full bg-black/40 border border-white/10 focus:border-maestro-gold outline-none px-4 py-3 text-sm text-white placeholder:text-white/20"
                />
              </div>
              
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">URL del Sitio Web o Red Social</label>
                <input
                  type="url" name="website_url" value={form.website_url} onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-white/10 focus:border-maestro-gold outline-none px-4 py-3 text-sm text-white placeholder:text-white/20"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-white/10 py-3 text-xs tracking-widest uppercase text-white/50 hover:text-white hover:border-white/30 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-maestro-gold text-black py-3 text-xs tracking-widest uppercase hover:bg-white transition-colors flex justify-center items-center gap-2">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
