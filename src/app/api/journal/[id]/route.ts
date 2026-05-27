import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const formData = await request.formData();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const updates: any = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as string,
      seo_title: formData.get('seo_title') as string,
      seo_description: formData.get('seo_description') as string,
      seo_keywords: formData.get('seo_keywords') as string,
    };
    
    // Si cambia el título, podríamos regenerar el slug
    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + id.substring(0,4);
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

    let { data, error } = await supabaseAdmin
      .from('journal')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    // Fallback
    if (error && (error.code === '42703' || error.message?.includes('column'))) {
      const fallbackUpdates: any = { 
        title: updates.title, slug: updates.slug, 
        excerpt: updates.excerpt, content: updates.content, 
        status: updates.status 
      };
      if (updates.cover_image) fallbackUpdates.cover_image = updates.cover_image;
      
      const retry = await supabaseAdmin.from('journal').update(fallbackUpdates).eq('id', id).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { error } = await supabaseAdmin.from('journal').delete().eq('id', resolvedParams.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
