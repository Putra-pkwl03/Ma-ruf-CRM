// src/lib/supabase.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

export const createServerSupabase = (cookieStore: any) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Tambahkan pengecekan fungsi untuk menghindari error "not a function"
          return typeof cookieStore.getAll === 'function' 
            ? cookieStore.getAll() 
            : [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (typeof cookieStore.set === 'function') {
                cookieStore.set(name, value, options);
              }
            });
          } catch {
            // Aman diabaikan di Server Component
          }
        },
      },
    }
  )
}