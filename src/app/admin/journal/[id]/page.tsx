import JournalForm from "@/components/admin/JournalForm";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function EditJournalPage({ params }: { params: { id: string } }) {
  const { data } = await supabaseAdmin.from("journal").select("*").eq("id", params.id).single();

  if (!data) return <div>No encontrado</div>;

  return <JournalForm initialData={data} />;
}
