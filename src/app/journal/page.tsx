import Navbar from "@/components/layout/Navbar";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "The Journal | MAESTRO Luxury Denim",
  description: "Tendencias, editoriales de moda y la visión del denim de lujo. Explora The Journal por MAESTRO.",
  openGraph: {
    title: "The Journal | MAESTRO",
    description: "Tendencias y editoriales sobre denim de lujo.",
    type: "website",
  }
};

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
    <main className="min-h-screen bg-maestro-dark selection:bg-maestro-gold selection:text-maestro-dark pt-28 pb-32">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <header className="mb-20 md:mb-32 text-center">
          <h1 className="text-5xl md:text-8xl text-editorial text-maestro-bone mb-6 uppercase tracking-tight">The Journal</h1>
          <p className="text-xs md:text-sm text-maestro-bone/60 tracking-[0.4em] uppercase max-w-2xl mx-auto">
            Tendencias · Editoriales · Denim de Lujo
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center text-maestro-bone/40 py-20 uppercase tracking-widest text-sm">
            Próximamente...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            {posts.map((post: any, idx: number) => {
              // Asymmetrical Grid Logic (Vogue Style)
              let colSpanClass = "col-span-1 md:col-span-4";
              let aspectClass = "aspect-[3/4]";
              let showExcerpt = false;

              if (idx === 0) {
                // First post is massive, cinematic
                colSpanClass = "col-span-1 md:col-span-12";
                aspectClass = "aspect-[4/3] md:aspect-[21/9]";
                showExcerpt = true;
              } else if (idx % 5 === 1 || idx % 5 === 4) {
                // Large vertical staggered
                colSpanClass = "col-span-1 md:col-span-7";
                aspectClass = "aspect-[4/5]";
                showExcerpt = true;
              } else if (idx % 5 === 2 || idx % 5 === 3) {
                // Smaller square/vertical
                colSpanClass = "col-span-1 md:col-span-5 md:mt-24";
                aspectClass = "aspect-square";
              }

              return (
                <Link key={post.id} href={`/journal/${post.slug}`} className={`group block ${colSpanClass}`}>
                  <div className={`w-full bg-maestro-carbon overflow-hidden relative mb-6 md:mb-8 ${aspectClass}`}>
                    <img 
                      src={post.cover_image || "https://images.unsplash.com/photo-1542272604-784c46ce5ac6?q=80&w=2000&auto=format&fit=crop"} 
                      alt={post.title}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  
                  <div className={`${idx === 0 ? 'md:max-w-3xl md:mx-auto md:text-center' : ''}`}>
                    <span className="text-[10px] text-maestro-gold uppercase tracking-[0.3em] mb-4 block">
                      {new Date(post.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    <h2 className={`text-editorial text-maestro-bone mb-4 group-hover:text-maestro-gold transition-colors uppercase leading-[1.15] ${idx === 0 ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
                      {post.title}
                    </h2>
                    
                    {showExcerpt && (
                      <p className={`text-maestro-bone/60 font-light leading-relaxed mb-8 ${idx === 0 ? 'text-base md:text-lg mx-auto line-clamp-3' : 'text-sm line-clamp-2'}`}>
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className={`text-[10px] uppercase tracking-[0.3em] text-maestro-bone flex items-center gap-3 group-hover:text-maestro-gold transition-colors ${idx === 0 ? 'justify-center' : ''}`}>
                      Leer Editorial <ArrowRight size={14} className="group-hover:translate-x-3 transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
