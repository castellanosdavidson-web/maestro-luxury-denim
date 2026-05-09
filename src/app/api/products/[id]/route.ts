import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/localDb';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const db = await readDb();
    
    const newProducts = db.products.filter(p => p.id !== resolvedParams.id);
    db.products = newProducts;
    
    await writeDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
