import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSettings() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/settings?id=eq.1&select=*`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        cache: 'no-store',
      }
    );
    const data = await res.json();
    const s = data[0] || {};
    return {
      heroTitle:      s.hero_title      || "DISEÑADO\nPARA MUJERES",
      heroSubtitle:   s.hero_subtitle   || "que imponen estilo.",
      heroCaption:    s.hero_caption    || "Denim premium · Edición limitada",
      heroValueProp:  s.hero_value_prop || "Confección colombiana con estándares globales",
      heroImage:      s.hero_image      || "",
      heroFontSize:   s.hero_font_size  || "large",
      heroFontFamily: s.hero_font_family || "editorial",
    };
  } catch {
    return {};
  }
}

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/categories?select=*`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        cache: 'no-store',
      }
    );
    const data = await res.json();
    return (data || []).map((c: any) => ({
      id:      c.id,
      name:    c.name,
      image:   c.image,
      colSpan: c.col_span,
      rowSpan: c.row_span,
      status:  c.status,
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <main className="min-h-screen bg-maestro-dark">
      <Navbar />
      <Hero settings={settings} />
      <Categories categories={categories} />
    </main>
  );
}
