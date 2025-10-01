import { unstable_noStore as noStore } from "next/cache"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/supabase"

type DashboardStats = {
  semanas: number
  archivos: number
  ultimaActualizacion: string | null
}

function formatDateIso(date?: string | null) {
  if (!date) return null
  return new Date(date).toISOString()
}

export async function getDashboardStats(): Promise<DashboardStats> {
  noStore()
  const supabase = await createServerSupabaseClient()

  const [{ count: semanasCount }, { count: archivosCount }, latestSemana] =
    await Promise.all([
      supabase.from("semanas").select("id", { count: "exact", head: true }),
      supabase.from("archivos").select("id", { count: "exact", head: true }),
      supabase
        .from("archivos")
        .select("fecha_subida")
        .order("fecha_subida", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

  return {
    semanas: semanasCount ?? 0,
    archivos: archivosCount ?? 0,
    ultimaActualizacion: formatDateIso(latestSemana?.fecha_subida),
  }
}

export async function getSemanas(): Promise<Tables<"semanas">[]> {
  noStore()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("semanas")
    .select("*")
    .order("fecha_creacion", { ascending: false })

  if (error) {
    console.error("Error fetching semanas", error.message)
    return []
  }

  return data ?? []
}

export async function getSemanaById(
  id: number
): Promise<(Tables<"semanas"> & { archivos: Tables<"archivos">[] }) | null> {
  noStore()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("semanas")
    .select("*, archivos(*)")
    .eq("id", id)
    .order("fecha_subida", { referencedTable: "archivos", ascending: false })
    .maybeSingle()

  if (error) {
    console.error("Error fetching semana", error.message)
    return null
  }

  return data as unknown as Tables<"semanas"> & {
    archivos: Tables<"archivos">[]
  }
}


export async function getSemanasWithArchivos(): Promise<
  Array<Tables<"semanas"> & { archivos: Tables<"archivos">[] }>
> {
  noStore()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("semanas")
    .select("*, archivos(*)")
    .order("fecha_creacion", { ascending: false })
    .order("fecha_subida", { referencedTable: "archivos", ascending: false })

  if (error) {
    console.error("Error fetching semanas with archivos", error.message)
    return []
  }

  return (data ?? []) as Array<
    Tables<"semanas"> & { archivos: Tables<"archivos">[] }
  >
}
