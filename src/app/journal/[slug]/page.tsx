import Navbar from "@/components/layout/Navbar";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPost(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("journal")
      .select("*")
      .eq("slug", slug)
      .eq("status", "Publicado")
      .single();
    
    if (error || !data) return null;
    return data;
  } catch (error) {
    return null;
  }
}

export default async function JournalPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Simple formatter to convert line breaks to paragraphs
  const formattedContent = post.content.split('\n').filter((line: string) => line.trim() !== '');

  return (
    <main className="min-h-screen bg-maestro-dark selection:bg-maestro-gold selection:text-maestro-dark pt-28 pb-32">
      <Navbar />
      
      <article className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Link href="/journal" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-maestro-bone/60 hover:text-maestro-gold transition-colors mb-12">
          <ArrowLeft size={12} /> Volver al Journal
        </Link>

        <header className="mb-16 text-center">
          <span className="text-[10px] text-maestro-gold uppercase tracking-[0.3em] mb-6 block">
            {new Date(post.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-editorial text-maestro-bone mb-8 uppercase leading-[1.1]">
            {post.title}
          </h1>
          <p className="text-sm md:text-base text-maestro-bone/80 tracking-wide font-light max-w-2xl mx-auto italic">
            "{post.excerpt}"
          </p>
        </header>

        {post.cover_image && (
          <div className="w-full aspect-video md:aspect-[21/9] bg-maestro-carbon mb-20 overflow-hidden">
            <img 
              src={post.cover_image} 
              alt={post.title} 
              className="w-full h-full object-cover object-center grayscale-[10%]"
            />
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-8 text-maestro-bone/80 font-light leading-loose text-justify text-sm md:text-base">
          {formattedContent.map((paragraph: string, idx: number) => {
            // First paragraph styling like a drop-cap or just a bit highlighted
            if (idx === 0) {
              return (
                <p key={idx} className="first-letter:text-6xl first-letter:font-editorial first-letter:text-maestro-gold first-letter:float-left first-letter:mr-3 first-letter:mt-2 text-maestro-bone">
                  {paragraph}
                </p>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>
      </article>
    </main>
  );
}
