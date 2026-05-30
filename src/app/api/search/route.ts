import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 2) return NextResponse.json([]);

  const term = `%${q}%`;

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id, slug, name, reference, price, image, category_id, status")
    .eq("status", "Activo")
    .or(`name.ilike.${term},reference.ilike.${term},category_id.ilike.${term},description.ilike.${term}`)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data || []);
}
