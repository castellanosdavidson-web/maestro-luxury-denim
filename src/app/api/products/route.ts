import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/localDb';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.products);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const reference = formData.get('reference') as string;
    const price = parseInt(formData.get('price') as string);
    const description = formData.get('description') as string;
    const status = formData.get('status') as string || 'Activo';
    const categoryId = formData.get('categoryId') as string;
    
    const sizes = (formData.get('sizes') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const colors = (formData.get('colors') as string)?.split(',').map(c => c.trim()).filter(Boolean) || [];
    const details = (formData.get('details') as string)?.split('\n').map(d => d.trim()).filter(Boolean) || [];
    
    const imageFile = formData.get('image') as File;
    let imageUrl = '';
    
    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(imageFile.name);
      const filename = `product-${uniqueSuffix}${ext}`;
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure the directory exists
      try {
        await fs.access(uploadDir);
      } catch (e) {
        await fs.mkdir(uploadDir, { recursive: true });
      }
      
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }
    
    const id = `prod-${Date.now()}`;
    
    const newProduct = {
      id,
      name,
      reference,
      price,
      description,
      details,
      sizes,
      colors,
      status,
      categoryId,
      images: imageUrl ? [imageUrl] : []
    };
    
    const db = await readDb();
    db.products.push(newProduct);
    await writeDb(db);
    
    return NextResponse.json({ success: true, product: newProduct });
    
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
