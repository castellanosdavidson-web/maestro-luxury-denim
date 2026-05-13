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

    const baseUpdates: Record<string, any> = {
      name:        formData.get('name'),
      reference:   formData.get('reference'),
      price:       formData.get('price'),
      description: formData.get('description'),
      category_id: formData.get('categoryId'),
      status:      formData.get('status'),
    };

    if (formData.get('sizes')) {
      baseUpdates.sizes = (formData.get('sizes') as string).split(',').map(s => s.trim());
    }
    if (formData.get('colors')) {
      baseUpdates.colors = (formData.get('colors') as string).split(',').map(c => c.trim());
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
        baseUpdates.image = urlData.publicUrl;
      }
    }

    // Intentar con campos de posición
    const updatesWithFocal = {
      ...baseUpdates,
      focal_x: parseFloat(formData.get('focal_x') as string) || 50,
      focal_y: parseFloat(formData.get('focal_y') as string) || 50,
      zoom:    parseFloat(formData.get('zoom') as string) || 100,
    };

    let { error } = await supabaseAdmin.from('products').update(updatesWithFocal).eq('id', id);

    // Si falla por columna inexistente, reintenta sin campos de posición
    if (error && (error.code === '42703' || error.message?.includes('column'))) {
      console.warn('Retrying without focal fields — run SQL migration in Supabase');
      const retry = await supabaseAdmin.from('products').update(baseUpdates).eq('id', id);
      error = retry.error;
    }

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
