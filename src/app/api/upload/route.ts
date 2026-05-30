import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name);
    // Para identificar que son subidas dinÃ¡micas del editor
    const filename = `media-${Date.now()}${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filename, buffer, { contentType: file.type });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
    const fileUrl = urlData.publicUrl;

    // Retornamos la URL y el tipo (para saber si inyectar <img> o <video>)
    const isVideo = file.type.startsWith('video/');
    
    return NextResponse.json({ url: fileUrl, isVideo });
  } catch (error: any) {
    console.error('Unexpected error in API Upload:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
