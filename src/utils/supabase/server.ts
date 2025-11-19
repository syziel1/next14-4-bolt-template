import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missingVars.length > 0) {
    throw new Error(
      `Missing environment variable(s): ${missingVars.join(', ')}. Please set the required variable(s) in your environment.`
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Server Components can't modify cookies; cookie setting should be handled by Route Handlers or Server Actions.
            // Log error for debugging purposes while suppressing expected Server Component errors
            if (process.env.NODE_ENV === 'development') {
              console.warn('Cookie set operation failed:', error)
            }
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // Server Components can't modify cookies; cookie removal should be handled by Route Handlers or Server Actions.
            // Log error for debugging purposes while suppressing expected Server Component errors
            if (process.env.NODE_ENV === 'development') {
              console.warn('Cookie remove operation failed:', error)
            }
          }
        },
      },
    }
  )
}