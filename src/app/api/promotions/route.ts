import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const BUCKET_NAME = 'uploads';
const FILE_NAME = 'promotions.json';

const defaultPromos = {
  promo_50_off: false,
  promo_2x1: false,
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(FILE_NAME);

    if (error || !data) {
      // Si no existe, devolvemos las por defecto
      return NextResponse.json(defaultPromos);
    }

    const text = await data.text();
    const promos = JSON.parse(text);
    return NextResponse.json(promos);
  } catch (error) {
    console.error("Error reading promos:", error);
    return NextResponse.json(defaultPromos);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar y sanear la entrada
    const promos = {
      promo_50_off: Boolean(body.promo_50_off),
      promo_2x1: Boolean(body.promo_2x1),
    };

    // Subir archivo a storage
    const buffer = Buffer.from(JSON.stringify(promos, null, 2), 'utf-8');
    
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(FILE_NAME, buffer, { 
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      console.error("Error uploading promos:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, promos });
  } catch (error) {
    console.error("Error updating promos:", error);
    return NextResponse.json({ error: 'Failed to update promos' }, { status: 500 });
  }
}
