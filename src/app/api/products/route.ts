import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name        = formData.get('name') as string;
    const price       = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const categoryId  = formData.get('categoryId') as string;
    const sizesRaw    = formData.get('sizes') as string;
    const colorsRaw   = formData.get('colors') as string;
    const sizes       = sizesRaw  ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean)  : [];
    const colors      = colorsRaw ? colorsRaw.split(',').map(c => c.trim()).filter(Boolean) : [];

    let imageUrl = '';
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(imageFile.name);
      const filename = `product-${Date.now()}${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: imageFile.type, upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
        imageUrl = urlData.publicUrl;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([{ name, price, description, category_id: categoryId, sizes, colors, image: imageUrl }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
