"use server"

import { revalidatePath } from "next/cache"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import {
  loginSchema,
  type LoginSchema,
} from "@/lib/validation/auth"

export type LoginActionState = {
  success?: boolean
  error?: string
}

export async function loginAction(values: LoginSchema): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse(values)

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos, intenta nuevamente.",
    }
  }

  const { email, password, redirectTo } = parsed.data
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  const destination = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard"

  revalidatePath(destination)
  revalidatePath("/dashboard")
  revalidatePath("/semanas")

  return { success: true }
}
