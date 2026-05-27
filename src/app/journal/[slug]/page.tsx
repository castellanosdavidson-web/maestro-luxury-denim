import Navbar from "@/components/layout/Navbar";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Metadata, ResolvingMetadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: "Artículo no encontrado | MAESTRO",
    }
  }

  return {
    title: post.seo_title || `${post.title} | MAESTRO Journal`,
    description: post.seo_description || post.excerpt,
    keywords: post.seo_keywords || "",
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: "article",
      publishedTime: post.created_at,
      images: [
        {
          url: post.cover_image || "https://maestrodeninmluxury.com/og-default.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image || "https://maestrodeninmluxury.com/og-default.jpg"],
    }
  }
}

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

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Schema.org BlogPosting for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.cover_image,
    "datePublished": post.created_at,
    "author": {
      "@type": "Organization",
      "name": "MAESTRO Luxury Denim"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MAESTRO Luxury Denim",
      "logo": {
        "@type": "ImageObject",
        "url": "https://maestrodeninmluxury.com/logo.png"
      }
    }
  };

  return (
    <main className="min-h-screen bg-maestro-dark selection:bg-maestro-gold selection:text-maestro-dark pt-28 pb-32">
      <Navbar />
      
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container mx-auto px-6 md:px-12 max-w-5xl">
        <Link href="/journal" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-maestro-bone/60 hover:text-maestro-gold transition-colors mb-12">
          <ArrowLeft size={12} /> Volver al Journal
        </Link>

        <header className="mb-16 text-center max-w-4xl mx-auto">
          <span className="text-[10px] text-maestro-gold uppercase tracking-[0.3em] mb-6 block">
            {new Date(post.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-editorial text-maestro-bone mb-8 uppercase leading-[1.1]">
            {post.title}
          </h1>
          <p className="text-sm md:text-base text-maestro-bone/80 tracking-wide font-light mx-auto italic">
            "{post.excerpt}"
          </p>
        </header>

        {post.cover_image && (
          <div className="w-full aspect-video md:aspect-[21/9] bg-maestro-carbon mb-20 overflow-hidden relative group">
            <img 
              src={post.cover_image} 
              alt={post.title} 
              className="w-full h-full object-cover object-center grayscale-[10%]"
            />
          </div>
        )}

        {/* Markdown Renderer with Custom Components */}
        <div className="max-w-3xl mx-auto">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ node, ...props }) => (
                <p className="text-maestro-bone/80 font-light leading-loose text-justify text-sm md:text-base mb-8" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl md:text-4xl text-editorial text-maestro-bone mt-16 mb-8 uppercase tracking-widest text-center" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl md:text-2xl text-editorial text-maestro-gold mt-12 mb-6 uppercase tracking-widest" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote 
                  className="my-16 md:my-24 py-8 md:py-12 border-t border-b border-maestro-bone/10 text-center text-3xl md:text-5xl text-editorial text-maestro-gold leading-tight italic" 
                  {...props} 
                />
              ),
              img: ({ node, ...props }) => (
                <span className="block my-16 w-[110%] -ml-[5%] md:w-[130%] md:-ml-[15%] relative">
                  <img className="w-full h-auto object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000" {...props} />
                </span>
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-maestro-bone" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-maestro-gold hover:text-maestro-bone underline underline-offset-4 decoration-maestro-gold/30 hover:decoration-maestro-bone transition-all" target="_blank" rel="noopener noreferrer" {...props} />
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
