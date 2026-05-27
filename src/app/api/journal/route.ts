import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let query = supabaseAdmin.from('journal').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as string;
    
    // SEO fields
    const seo_title = formData.get('seo_title') as string;
    const seo_description = formData.get('seo_description') as string;
    const seo_keywords = formData.get('seo_keywords') as string;
    
    // Generar slug único
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);

    const newPost: any = { 
      title, slug, excerpt, content, status,
      seo_title, seo_description, seo_keywords
    };

    const coverImage = formData.get('cover_image') as File;
    if (coverImage && coverImage.size > 0) {
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(coverImage.name);
      const filename = `journal-${Date.now()}${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: coverImage.type });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
        newPost.cover_image = urlData.publicUrl;
      }
    }

    let { data, error } = await supabaseAdmin.from('journal').insert([newPost]).select().single();
    
    // Fallback si faltan columnas SEO
    if (error && (error.code === '42703' || error.message?.includes('column'))) {
      const fallbackPost: any = { title, slug, excerpt, content, status };
      if (newPost.cover_image) fallbackPost.cover_image = newPost.cover_image;
      
      const retry = await supabaseAdmin.from('journal').insert([fallbackPost]).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
