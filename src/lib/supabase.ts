import { createClient } from '@supabase/supabase-js';

// Estas variables vendrán de tu archivo .env (que crearemos en el paso 2)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);