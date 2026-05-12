import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Traer todas las categorías con sus imágenes de megamenu
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name, image, megamenu_image')
      .order('name');

    const megamenuItems: { name: string; img: string; href: string }[] = [];

    if (categories) {
      for (const cat of categories) {
        // Si la categoría tiene imagen específica para el megamenu, usarla directamente
        if (cat.megamenu_image) {
          megamenuItems.push({
            name: cat.name,
            img:  cat.megamenu_image,
            href: `/category/${cat.name.toLowerCase()}`,
          });
        } else {
          // Fallback: imagen del producto más reciente de esa categoría
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('image')
            .eq('category_id', cat.id)
            .eq('status', 'Activo')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (product?.image) {
            megamenuItems.push({
              name: cat.name,
              img:  product.image,
              href: `/category/${cat.name.toLowerCase()}`,
            });
          } else if (cat.image) {
            // Último fallback: imagen principal de la categoría
            megamenuItems.push({
              name: cat.name,
              img:  cat.image,
              href: `/category/${cat.name.toLowerCase()}`,
            });
          }
        }
      }
    }

    // Si no hay nada en BD, usar placeholders de Unsplash
    const defaultItems = [
      { name: "Chaquetas", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600", href: "/category/chaquetas" },
      { name: "Vestidos",  img: "https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=600", href: "/category/vestidos" },
      { name: "Enterizos", img: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=600", href: "/category/enterizo" },
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
