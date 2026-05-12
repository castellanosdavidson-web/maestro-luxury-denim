import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedShowcase from "@/components/home/FeaturedShowcase";
import Categories from "@/components/home/Categories";
import MaestrosCarousel from "@/components/home/MaestrosCarousel";

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
      heroVideo:      data.hero_video      || "",
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

async function getProducts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'Activo')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error("Error fetching products:", e);
    return [];
  }
}

export default async function Home() {
  const [settings, categories, products] = await Promise.all([
    getSettings(), 
    getCategories(),
    getProducts()
  ]);

  return (
    <main className="min-h-screen bg-maestro-dark">
      <Navbar />
      <Hero settings={settings} />
      <FeaturedShowcase products={products} />
      <Categories categories={categories} />
      <MaestrosCarousel />
    </main>
  );
}
