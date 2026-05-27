"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JournalForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    status: initialData?.status || "Borrador",
    cover_image_url: initialData?.cover_image || "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/journal/${initialData.id}` : "/api/journal";

    try {
      const res = await fetch(url, { method, body: form });
      if (res.ok) {
        router.push("/admin/journal");
      } else {
        alert("Error al guardar");
      }
    } catch (err) {
      console.error(err);
      alert("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/journal" className="text-maestro-bone/60 hover:text-maestro-gold transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl text-editorial text-maestro-bone">
          {initialData ? "Editar Artículo" : "Nuevo Artículo Editorial"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-maestro-dark border border-maestro-bone/10 p-8 rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Título del Artículo</label>
              <input
                type="text" name="title" required
                value={formData.title} onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Extracto (Bajada)</label>
              <textarea
                name="excerpt" rows={2} required
                value={formData.excerpt} onChange={handleChange}
                placeholder="Un breve resumen que invite a leer más..."
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2 flex justify-between">
                <span>Contenido Principal (Markdown)</span>
                <span className="text-[10px] text-maestro-bone/40">Soporta: **negrita**, &gt; Citas Gigantes, ![alt](url) para fotos</span>
              </label>
              <textarea
                name="content" rows={15} required
                value={formData.content} onChange={handleChange}
                placeholder="Escribe la historia o artículo aquí usando Markdown..."
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-4 text-sm text-maestro-bone focus:border-maestro-gold outline-none font-mono font-light leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Estado</label>
              <select
                name="status"
                value={formData.status} onChange={handleChange}
                className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
              >
                <option value="Borrador">Borrador</option>
                <option value="Publicado">Publicado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Imagen de Portada</label>
              <div className="border border-dashed border-maestro-bone/20 p-6 flex flex-col items-center justify-center text-center">
                {formData.cover_image_url && (
                  <img src={formData.cover_image_url} alt="Cover" className="w-full h-32 object-cover mb-4 border border-maestro-bone/10" />
                )}
                <Upload size={24} className="text-maestro-bone/40 mb-2" />
                <input
                  name="cover_image" type="file" accept="image/*"
                  className="w-full text-[10px] text-maestro-bone/60 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-maestro-bone file:text-maestro-dark hover:file:bg-maestro-gold"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-maestro-bone/10 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-maestro-gold text-maestro-dark uppercase tracking-widest text-xs font-semibold hover:bg-maestro-bone transition-colors disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Artículo"}
          </button>
        </div>
      </form>
    </div>
  );
}
