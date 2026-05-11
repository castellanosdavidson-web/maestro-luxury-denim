import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/localDb';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.settings);
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const db = await readDb();

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      
      const heroTitle = formData.get('heroTitle') as string;
      if (heroTitle !== null) db.settings.heroTitle = heroTitle;
      
      const heroSubtitle = formData.get('heroSubtitle') as string;
      if (heroSubtitle !== null) db.settings.heroSubtitle = heroSubtitle;
      
      const heroCaption = formData.get('heroCaption') as string;
      if (heroCaption !== null) db.settings.heroCaption = heroCaption;
      
      const heroValueProp = formData.get('heroValueProp') as string;
      if (heroValueProp !== null) db.settings.heroValueProp = heroValueProp;

      const heroFontSize = formData.get('heroFontSize') as string;
      if (heroFontSize) (db.settings as any).heroFontSize = heroFontSize;

      const heroFontFamily = formData.get('heroFontFamily') as string;
      if (heroFontFamily) (db.settings as any).heroFontFamily = heroFontFamily;

      const heroImageFile = formData.get('heroImage') as File;
      if (heroImageFile && heroImageFile.name) {
        const bytes = await heroImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(heroImageFile.name);
        const filename = `hero-${uniqueSuffix}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
        
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        db.settings.heroImage = `/uploads/${filename}`;
      }
    } else {
      const body = await request.json();
      db.settings = { ...db.settings, ...body };
    }
    
    await writeDb(db);
    return NextResponse.json({ success: true, settings: db.settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
