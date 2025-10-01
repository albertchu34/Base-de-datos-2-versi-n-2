import { createServerClient } from "@supabase/ssr"
import { cookies, headers } from "next/headers"

import type { Database } from "@/types/supabase"
import { env } from "@/lib/env"

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const headerList = await headers()

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((cookie) => {
            try {
              cookieStore.set(cookie.name, cookie.value, cookie.options)
            } catch (error) {
              if (process.env.NODE_ENV === "development") {
                console.warn(
                  "Attempted to set a cookie outside of a mutable request context.",
                  error
                )
              }
            }
          })
        },
      },
      global: {
        headers: {
          "X-Client-Info": headerList.get("X-Client-Info") ?? "supabase-ssr-client",
        },
      },
    }
  )
}
