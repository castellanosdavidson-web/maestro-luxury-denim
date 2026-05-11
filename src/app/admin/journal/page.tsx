"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminJournal() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/journal");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este artículo?")) return;
    try {
      await fetch(`/api/journal/${id}`, { method: "DELETE" });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-editorial text-maestro-bone">The Journal</h1>
        <Link 
          href="/admin/journal/new"
          className="flex items-center gap-2 bg-maestro-gold text-maestro-dark px-4 py-2 uppercase tracking-widest text-xs font-semibold hover:bg-maestro-bone transition-colors"
        >
          <Plus size={16} /> Crear Artículo
        </Link>
      </div>

      <div className="bg-maestro-dark border border-maestro-bone/10 rounded-sm">
        <table className="w-full text-left text-sm text-maestro-bone/80">
          <thead className="text-xs uppercase tracking-widest text-maestro-bone bg-maestro-carbon border-b border-maestro-bone/10">
            <tr>
              <th className="px-6 py-4">Imagen</th>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-maestro-bone/50">Cargando...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-maestro-bone/50">No hay artículos creados.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-maestro-bone/5 hover:bg-maestro-bone/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-maestro-carbon overflow-hidden border border-maestro-bone/20">
                      {post.cover_image && <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-maestro-bone">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-widest border ${post.status === 'Publicado' ? 'border-maestro-gold text-maestro-gold' : 'border-maestro-bone/40 text-maestro-bone/60'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/journal/${post.id}`} className="text-maestro-bone/60 hover:text-maestro-gold transition-colors">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => deletePost(post.id)} className="text-maestro-bone/60 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
