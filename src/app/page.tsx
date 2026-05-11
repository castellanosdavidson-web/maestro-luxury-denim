import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabaseAdmin } from "@/lib/supabase";

async function getSettings() {
  try {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) return {};

    return {
      heroTitle:      data.hero_title      || "DISEÑADO\nPARA MUJERES",
      heroSubtitle:   data.hero_subtitle   || "que imponen estilo.",
      heroCaption:    data.hero_caption    || "Denim premium · Edición limitada",
      heroValueProp:  data.hero_value_prop || "Confección colombiana con estándares globales",
      heroImage:      data.hero_image      || "",
      heroFontSize:   data.hero_font_size  || "large",
      heroFontFamily: data.hero_font_family || "editorial",
    };
  } catch (e) {
    console.error("Error fetching settings:", e);
    return {};
  }
}

async function getCategories() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*');

    if (error || !data) return [];

    return data.map((c: any) => ({
      id:      c.id,
      name:    c.name,
      image:   c.image,
      colSpan: c.col_span,
      rowSpan: c.row_span,
      status:  c.status,
    }));
  } catch (e) {
    console.error("Error fetching categories:", e);
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
