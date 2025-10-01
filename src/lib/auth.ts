import { cache } from "react"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export const getSession = cache(async () => {
  const supabase = await createServerSupabaseClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to fetch Supabase session", error)
    }
    return null
  }

  return session
})

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  return session?.user ?? null
})
