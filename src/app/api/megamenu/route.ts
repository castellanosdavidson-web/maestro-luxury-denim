import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Definimos las 3 categorías que queremos mostrar en el megamenu
    const targetCategories = ["chaquetas", "vestidos", "enterizo"];
    
    // Obtenemos los IDs de estas categorías
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .in('name', ['Chaquetas', 'Vestidos', 'Enterizos', 'Enterizo']);

    const megamenuItems = [];

    if (categories) {
      for (const cat of categories) {
        // Obtenemos el producto más reciente de cada categoría
        const { data: product } = await supabaseAdmin
          .from('products')
          .select('image')
          .eq('category_id', cat.id)
          .eq('status', 'Activo')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (product && product.image) {
          megamenuItems.push({
            name: cat.name,
            img: product.image,
            href: `/category/${cat.name.toLowerCase()}`
          });
        }
      }
    }

    // Si no hay productos en la base de datos para estas categorías, devolvemos unas por defecto
    const defaultItems = [
      { name: "Chaquetas", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600", href: "/category/chaquetas" },
      { name: "Vestidos", img: "https://images.unsplash.com/photo-1549062572-544a64fb0c56?q=80&w=600", href: "/category/vestidos" },
      { name: "Enterizos", img: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=600", href: "/category/enterizo" }
    ];

    const finalItems = megamenuItems.length >= 2 ? megamenuItems : defaultItems;

    return NextResponse.json({ items: finalItems });
  } catch (error) {
    console.error("Megamenu Error:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
