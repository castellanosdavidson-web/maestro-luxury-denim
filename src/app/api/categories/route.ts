import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/localDb';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.categories);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const imageFile = formData.get('image') as File;
    
    if (!id || !imageFile) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const db = await readDb();
    const categoryIndex = db.categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(imageFile.name);
    const filename = `cat-${id}-${uniqueSuffix}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
    
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    db.categories[categoryIndex].image = `/uploads/${filename}`;
    
    await writeDb(db);
    return NextResponse.json({ success: true, category: db.categories[categoryIndex] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
