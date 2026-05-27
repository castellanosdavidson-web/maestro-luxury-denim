"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft, ImagePlus } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function JournalForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    status: initialData?.status || "Borrador",
    cover_image_url: initialData?.cover_image || "",
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
    seo_keywords: initialData?.seo_keywords || "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleMediaUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaUploading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      
      if (res.status === 413) {
        alert("La imagen es demasiado pesada. El tamaño máximo es 4.5MB.");
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error al subir: ${errorText.substring(0, 50)}`);
        return;
      }

      const data = await res.json();

      if (data.url) {
        const isVideo = file.type.startsWith('video/');
        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection(true) || { index: editor.getLength() };
          if (isVideo) {
            editor.insertEmbed(range.index, 'video', data.url);
          } else {
            editor.insertEmbed(range.index, 'image', data.url);
          }
          editor.setSelection(range.index + 1);
        } else {
          const snippet = isVideo 
            ? `<p><video src="${data.url}" controls loop class="w-full"></video></p>`
            : `<p><img src="${data.url}" alt="${file.name}" /></p>`;
          setFormData(prev => ({ ...prev, content: prev.content + snippet }));
        }
      } else {
        alert(data.error || 'Error al subir archivo');
      }
    } catch (err) {
      console.error(err);
      alert("Error en el servidor al subir archivo");
    } finally {
      setMediaUploading(false);
    }
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    form.append("content", formData.content);
    
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/journal/${initialData.id}` : "/api/journal";

    try {
      const res = await fetch(url, { method, body: form });
      if (res.ok) {
        router.push("/admin/journal");
      } else {
        if (res.status === 413) {
          alert("Error: La imagen que intentas subir es demasiado pesada. Vercel permite un máximo de 4.5MB. Por favor, comprime tu imagen antes de subirla.");
          return;
        }
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          alert(`Error al guardar: ${errorData.error || 'Desconocido'}`);
        } else {
          const errorText = await res.text();
          alert(`Error del servidor (${res.status}): ${errorText.substring(0, 50)}...`);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error en el servidor: ${err.message}`);
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
              <div className="flex items-end justify-between mb-2">
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60">
                  Contenido Principal (Markdown & HTML)
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleMediaUpload} 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={mediaUploading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-maestro-carbon border border-maestro-bone/20 hover:border-maestro-gold hover:text-maestro-gold transition-colors text-[9px] tracking-widest uppercase disabled:opacity-50"
                  >
                    <ImagePlus size={12} />
                    {mediaUploading ? 'Subiendo...' : 'Insertar Imagen / Video'}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-maestro-bone/40 mb-3">
                Puedes copiar y pegar imágenes directamente en el texto, o usar el botón para insertar en la posición del cursor.
              </p>
              <div className="bg-maestro-bone/5 border border-maestro-bone/20 text-maestro-bone">
                <ReactQuill 
                  {...{ ref: quillRef }}
                  theme="snow" 
                  value={formData.content} 
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  className="h-80 mb-12 text-maestro-bone"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link', 'clean']
                    ],
                  }}
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="pt-8 border-t border-maestro-bone/10 space-y-6">
              <h3 className="text-lg text-editorial text-maestro-gold mb-4">Optimización SEO</h3>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Título SEO (Recomendado: 50-60 caracteres)</label>
                <input
                  type="text" name="seo_title"
                  value={formData.seo_title} onChange={handleChange}
                  placeholder="Ej: Tendencias en Denim Premium 2026 | MAESTRO"
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Descripción SEO (Recomendado: 150-160 caracteres)</label>
                <textarea
                  name="seo_description" rows={2}
                  value={formData.seo_description} onChange={handleChange}
                  placeholder="Descripción que aparecerá en los resultados de Google..."
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-maestro-bone/60 mb-2">Palabras Clave (Separadas por comas)</label>
                <input
                  type="text" name="seo_keywords"
                  value={formData.seo_keywords} onChange={handleChange}
                  placeholder="denim lujo, jeans premium colombia, tendencias moda"
                  className="w-full bg-maestro-carbon border border-maestro-bone/20 p-3 text-sm text-maestro-bone focus:border-maestro-gold outline-none"
                />
              </div>
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
                {(coverPreview || formData.cover_image_url) && (
                  <img src={coverPreview || formData.cover_image_url} alt="Cover" className="w-full h-32 object-cover mb-4 border border-maestro-bone/10" />
                )}
                <Upload size={24} className="text-maestro-bone/40 mb-2" />
                <input
                  name="cover_image" type="file" accept="image/*"
                  onChange={handleCoverChange}
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
