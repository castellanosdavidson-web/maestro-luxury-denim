import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name, image, megamenu_image')
      .order('name');

    const megamenuItems: { name: string; imgs: string[]; href: string }[] = [];

    if (categories) {
      for (const cat of categories) {
        // Fetch up to 5 recent products for the rotation
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('image')
          .eq('category_id', cat.id)
          .eq('status', 'Activo')
          .order('created_at', { ascending: false })
          .limit(5);

        let imgs = products?.map(p => p.image).filter(Boolean) || [];

        // Fallbacks if no products exist
        if (imgs.length === 0) {
          if (cat.megamenu_image) imgs.push(cat.megamenu_image);
          else if (cat.image) imgs.push(cat.image);
        }

        if (imgs.length > 0) {
          megamenuItems.push({
            name: cat.name,
            imgs: imgs,
            href: `/category/${cat.name.toLowerCase().replace(/ /g, '-')}`,
          });
        }
      }
    }

    const defaultItems = [
      { name: "Chaquetas", imgs: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600"], href: "/category/chaquetas" },
      { name: "Vestidos",  imgs: ["https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=600"], href: "/category/vestidos" },
      { name: "Enterizos", imgs: ["https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=600"], href: "/category/enterizo" },
    ];

    const finalItems = megamenuItems.length >= 2
      ? megamenuItems.slice(0, 6)
      : defaultItems;

    return NextResponse.json({ items: finalItems });
  } catch (error) {
    console.error("Megamenu Error:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
