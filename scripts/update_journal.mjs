import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const updates = [
    {
      id: "09ee01c7-e1b6-4826-9013-2ea62976c19d",
      slug: "guia-tendencias-denim"
    },
    {
      id: "5aa84c40-4914-4725-83fc-76fdfaf73bdb",
      slug: "denim-lenguaje-estetico"
    }
  ];

  for (const update of updates) {
    const { error } = await supabase
      .from('journal')
      .update({ slug: update.slug })
      .eq('id', update.id);
      
    if (error) {
      console.error(`Error updating ${update.id}:`, error);
    } else {
      console.log(`Success: updated to ${update.slug}`);
    }
  }
}

main();
