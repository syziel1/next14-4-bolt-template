import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const missingVars = [];
  if (!url) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!anonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variable(s): ${missingVars.join(', ')}.`);
  }
  return createBrowserClient(
    url,
    anonKey
  );
}