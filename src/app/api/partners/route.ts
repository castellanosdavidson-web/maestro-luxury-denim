import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const name        = formData.get("name") as string;
  const website_url = formData.get("website_url") as string;
  const status      = formData.get("status") as string || "Activo";
  const imageFile   = formData.get("image") as File | null;

  let logo_url = formData.get("logo_url") as string || "";

  if (imageFile && imageFile.size > 0) {
    const buffer = await imageFile.arrayBuffer();
    const fileName = `partners/${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("uploads")
      .upload(fileName, Buffer.from(buffer), { contentType: imageFile.type, upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabaseAdmin.storage.from("uploads").getPublicUrl(fileName);
      logo_url = urlData.publicUrl;
    }
  }

  const { data, error } = await supabaseAdmin
    .from("partners")
    .insert([{ name, website_url, logo_url, status }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
