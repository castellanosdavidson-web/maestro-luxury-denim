import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    
    const updates: any = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as string,
    };
    
    // Si cambia el título, podríamos regenerar el slug o dejarlo fijo. Por simplicidad lo mantenemos o actualizamos:
    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const coverImage = formData.get('cover_image') as File;
    if (coverImage && coverImage.size > 0) {
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(coverImage.name);
      const filename = `journal-${Date.now()}${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: coverImage.type, upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
        updates.cover_image = urlData.publicUrl;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('journal')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin.from('journal').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
