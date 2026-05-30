import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name        = formData.get('name') as string;
    const slug        = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substr(2, 4);
    const price       = parseFloat(formData.get('price') as string) || 0;
    const description = (formData.get('description') as string) || '';
    const reference   = (formData.get('reference') as string) || '';
    const status      = (formData.get('status') as string) || 'Activo';
    const categoryId  = (formData.get('categoryId') as string) || '';
    const sizesRaw    = (formData.get('sizes') as string) || '';
    const colorsRaw   = (formData.get('colors') as string) || '';
    const sizes       = sizesRaw  ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean)  : [];
    const colors      = colorsRaw ? colorsRaw.split(',').map(c => c.trim()).filter(Boolean) : [];
    const material    = (formData.get('material') as string) || '';
    const focalX      = parseFloat(formData.get('focal_x') as string) || 50;
    const focalY      = parseFloat(formData.get('focal_y') as string) || 50;
    const zoom        = parseFloat(formData.get('zoom') as string) || 100;

    let imageUrl = '';
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      const bytes  = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext      = path.extname(imageFile.name);
      const filename = `product-${Date.now()}${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: imageFile.type, upsert: true });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
      } else {
        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
        imageUrl = urlData.publicUrl;
      }
    }

    const basePayload = { name, slug, price, description, reference, status, category_id: categoryId, sizes, colors, image: imageUrl, material };

    // Intentar insertar con campos de posiciÃ³n
    let { data, error } = await supabaseAdmin
      .from('products')
      .insert([{ ...basePayload, focal_x: focalX, focal_y: focalY, zoom }])
      .select()
      .single();

    // Si falla por columna inexistente, reintenta sin esos campos
    if (error && (error.code === '42703' || error.message?.includes('column'))) {
      console.warn('Retrying POST without focal fields â€” run SQL migration in Supabase');
      const retry = await supabaseAdmin.from('products').insert([basePayload]).select().single();
      data  = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('DB insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
