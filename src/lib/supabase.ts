import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey      = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente público (para el frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente admin: usa service role si existe, si no usa anon key
// Ambas claves funcionan para leer/escribir si las RLS policies están abiertas
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceKey || supabaseAnonKey,
  {
    auth: { persistSession: false },
    global: {
      headers: {
        // Usar apikey header explícito para Storage
        apikey: serviceKey || supabaseAnonKey,
      }
    }
  }
);
