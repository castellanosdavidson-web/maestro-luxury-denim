import Navbar from "@/components/layout/Navbar";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  const { data } = await supabaseAdmin.from('settings').select('about_text').eq('id', 1).single();

  return (
    <main className="min-h-screen bg-maestro-dark pt-32 pb-32">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <h1 className="text-4xl md:text-6xl text-editorial text-maestro-bone mb-12 text-center">Nuestra Historia</h1>
        <div className="text-maestro-bone/90 mx-auto whitespace-pre-wrap leading-relaxed text-sm md:text-base tracking-wide font-light max-w-3xl">
          {data?.about_text || "La historia de MAESTRO está por escribirse..."}
        </div>
      </div>
    </main>
  );
}
