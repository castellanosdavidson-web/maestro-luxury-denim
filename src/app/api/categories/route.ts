import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Convertir a camelCase para el frontend
  const categories = (data || []).map(c => ({
    id:           c.id,
    name:         c.name,
    image:        c.image,
    megamenuImage: c.megamenu_image || c.image,
    colSpan:      c.col_span,
    rowSpan:      c.row_span,
    status:       c.status,
  }));

  return NextResponse.json(categories);
}

export async function PUT(request: Request) {
  try {
    const formData    = await request.formData();
    const id          = formData.get('id') as string;
    const field       = formData.get('field') as string; // 'image' | 'megamenu_image'
    const imageFile   = formData.get('image') as File;

    if (!id || !imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const bytes    = await imageFile.arrayBuffer();
    const buffer   = Buffer.from(bytes);
    const ext      = path.extname(imageFile.name);
    const filename = `cat-${id}-${field}-${Date.now()}${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filename, buffer, { contentType: imageFile.type, upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
    const imageUrl = urlData.publicUrl;

    const dbField = field === 'megamenu' ? 'megamenu_image' : 'image';
    const { error } = await supabaseAdmin.from('categories').update({ [dbField]: imageUrl }).eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, image: imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id        = formData.get('id') as string;
    const imageFile = formData.get('image') as File;

    if (!id || !imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const bytes  = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext    = path.extname(imageFile.name);
    const filename = `cat-${id}-${Date.now()}${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filename, buffer, { contentType: imageFile.type, upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
    const imageUrl = urlData.publicUrl;

    const { error } = await supabaseAdmin
      .from('categories')
      .update({ image: imageUrl })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, image: imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
