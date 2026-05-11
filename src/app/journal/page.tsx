import Navbar from "@/components/layout/Navbar";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPosts() {
  try {
    const { data, error } = await supabaseAdmin
      .from("journal")
      .select("*")
      .eq("status", "Publicado")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching journal posts:", error);
    return [];
  }
}

export default async function JournalPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-maestro-dark selection:bg-maestro-gold selection:text-maestro-dark pt-28 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <header className="mb-16 md:mb-24 text-center">
          <h1 className="text-5xl md:text-7xl text-editorial text-maestro-bone mb-6 uppercase">The Journal</h1>
          <p className="text-sm md:text-base text-maestro-bone/60 tracking-[0.3em] uppercase max-w-2xl mx-auto">
            Tendencias, historias y editoriales sobre denim de lujo.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center text-maestro-bone/40 py-20 uppercase tracking-widest text-sm">
            Próximamente...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-20">
            {posts.map((post: any, idx: number) => (
              <Link key={post.id} href={`/journal/${post.slug}`} className="group block">
                <div className={`w-full bg-maestro-carbon overflow-hidden relative mb-6 ${idx === 0 ? 'aspect-square md:aspect-[4/3] md:col-span-2 lg:col-span-2' : 'aspect-[3/4]'}`}>
                  <img 
                    src={post.cover_image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6?q=80&w=2000&auto=format&fit=crop"} 
                    alt={post.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                
                <div>
                  <span className="text-[10px] text-maestro-gold uppercase tracking-[0.2em] mb-3 block">
                    {new Date(post.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                  <h2 className="text-2xl md:text-3xl text-editorial text-maestro-bone mb-3 group-hover:text-maestro-gold transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-maestro-bone/60 font-light leading-relaxed mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="text-xs uppercase tracking-[0.2em] text-maestro-bone flex items-center gap-2 group-hover:text-maestro-gold transition-colors">
                    Leer Editorial <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
