import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const files = formData.getAll("gallery") as File[];

    if (!files || files.length === 0)
      return NextResponse.json({ error: "No images provided" }, { status: 400 });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;
      const bytes    = await file.arrayBuffer();
      const buffer   = Buffer.from(bytes);
      const ext      = file.name.split(".").pop() || "jpg";
      const filename = `gallery-${id}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: upErr } = await supabaseAdmin.storage
        .from("uploads")
        .upload(filename, buffer, { contentType: file.type, upsert: true });

      if (!upErr) {
        const { data } = supabaseAdmin.storage.from("uploads").getPublicUrl(filename);
        uploadedUrls.push(data.publicUrl);
      }
    }

    if (uploadedUrls.length === 0)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });

    // Append to existing gallery array
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("gallery")
      .eq("id", id)
      .single();

    const existing = Array.isArray(product?.gallery) ? product.gallery : [];
    const newGallery = [...existing, ...uploadedUrls];

    const { error: dbErr } = await supabaseAdmin
      .from("products")
      .update({ gallery: newGallery })
      .eq("id", id);

    if (dbErr) {
      // Fallback: try creating gallery column if it doesn't exist
      console.warn("Gallery column may not exist yet. Run SQL migration.");
      return NextResponse.json({ error: dbErr.message }, { status: 500 });
    }

    return NextResponse.json({ gallery: newGallery });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { url } = await request.json();

    const { data: product } = await supabaseAdmin
      .from("products")
      .select("gallery")
      .eq("id", id)
      .single();

    const existing = Array.isArray(product?.gallery) ? product.gallery : [];
    const newGallery = existing.filter((u: string) => u !== url);

    const { error } = await supabaseAdmin
      .from("products")
      .update({ gallery: newGallery })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ gallery: newGallery });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
