import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const updates: Record<string, any> = {
      name: formData.get('name'),
      reference: formData.get('reference'),
      price: formData.get('price'),
      description: formData.get('description'),
      category_id: formData.get('categoryId'),
      status: formData.get('status'),
      updated_at: new Date().toISOString(),
    };

    if (formData.get('sizes')) {
      updates.sizes = (formData.get('sizes') as string).split(',').map(s => s.trim());
    }
    if (formData.get('colors')) {
      updates.colors = (formData.get('colors') as string).split(',').map(c => c.trim());
    }

    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = imageFile.name.split('.').pop();
      const filename = `product-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: imageFile.type });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
        updates.image = urlData.publicUrl;
      }
    }

    const { error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
