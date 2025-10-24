// app/utils/supabase/server.js

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          return (await cookieStore).get(name)?.value
        },
        async set(name, value, options) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch {
            // Handle error jika diperlukan
          }
        },
        async remove(name, options) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch {
            // Handle error jika diperlukan
          }
        },
      },
    }
  )
}