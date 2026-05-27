import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    
    // Generate an ID based on the name (e.g. "Ediciones Especiales" -> "ediciones-especiales")
    const id = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const { error } = await supabaseAdmin
      .from('categories')
      .insert([{ id, name, status: 'Activa', col_span: 'col-span-1', row_span: 'row-span-1' }]);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
