import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuración con tus credenciales
cloudinary.config({ 
  cloud_name: 'gwc8t3re', 
  api_key: '681281257956792', 
  api_secret: '5HFdL6vBF5kb9RnY1v3RtQ9Zt-E' 
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: 'auto', 
          folder: 'maestro' 
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const isVideo = file.type.startsWith('video/');
    let fileUrl = uploadResult.secure_url;

    // Si es imagen, optimizar automáticamente el formato y calidad
    if (!isVideo) {
      fileUrl = cloudinary.url(uploadResult.public_id, {
        fetch_format: 'auto',
        quality: 'auto',
        secure: true
      });
    }

    return NextResponse.json({ url: fileUrl, isVideo });
  } catch (error: any) {
    console.error('Unexpected error in API Upload:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
