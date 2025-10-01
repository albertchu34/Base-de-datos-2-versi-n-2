"use server"

import { revalidatePath } from "next/cache"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function logoutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut({ scope: "local" })

  revalidatePath("/login")
  revalidatePath("/dashboard")
  revalidatePath("/semanas")

  return { success: true }
}
