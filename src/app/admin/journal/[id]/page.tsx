import JournalForm from "@/components/admin/JournalForm";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data } = await supabaseAdmin.from("journal").select("*").eq("id", resolvedParams.id).single();

  if (!data) return <div className="p-12 text-maestro-bone">No encontrado</div>;

  return <JournalForm initialData={data} />;
}
