import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("success_cases")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const name     = formData.get("name") as string;
  const location = formData.get("location") as string;
  const quote    = formData.get("quote") as string;
  const product  = formData.get("product") as string;
  const order    = parseInt(formData.get("display_order") as string) || 0;
  const active   = formData.get("active") === "true";
  const imageFile = formData.get("image") as File | null;

  let image_url = formData.get("image_url") as string || "";

  if (imageFile && imageFile.size > 0) {
    const buffer = await imageFile.arrayBuffer();
    const fileName = `success-cases/${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("uploads")
      .upload(fileName, Buffer.from(buffer), { contentType: imageFile.type, upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabaseAdmin.storage.from("uploads").getPublicUrl(fileName);
      image_url = urlData.publicUrl;
    }
  }

  const { data, error } = await supabaseAdmin
    .from("success_cases")
    .insert([{ name, location, quote, product, image_url, display_order: order, active }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
