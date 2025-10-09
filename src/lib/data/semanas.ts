import { unstable_noStore as noStore } from "next/cache"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/supabase"

type DashboardStats = {
  semanas: number
  archivos: number
  ultimaActualizacion: string | null
}

const DEFAULT_SEMANAS = Array.from({ length: 16 }, (_, index) => {
  const numero = index + 1
  return {
    numero,
    titulo: `Semana ${numero}`,
  }
})

async function ensureDefaultSemanas() {
  const supabase = await createServerSupabaseClient()

  const { data: existing, error: existingError } = await supabase
    .from("semanas")
    .select("numero")

  if (existingError) {
    console.error("Error fetching existing semanas", existingError.message)
    return supabase
  }

  const missing = DEFAULT_SEMANAS.filter(
    (semana) => !existing?.some((item) => item.numero === semana.numero)
  )

  if (missing.length > 0) {
    const { error: insertError } = await supabase.from("semanas").insert(
      missing.map((item) => ({
        numero: item.numero,
        titulo: item.titulo,
        habilitada: false,
      }))
    )

    if (insertError) {
      console.error("Error creating default semanas", insertError.message)
    }
  }

  return supabase
}

function formatDateIso(date?: string | null) {
  if (!date) return null
  return new Date(date).toISOString()
}

export async function getDashboardStats(): Promise<DashboardStats> {
  noStore()
  const supabase = await ensureDefaultSemanas()

  const [
    { count: semanasCount },
    { count: archivosCount },
    { data: latestSemana },
  ] = await Promise.all([
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
    ultimaActualizacion: formatDateIso(latestSemana?.fecha_subida ?? null),
  }
}

export async function getSemanas(): Promise<Tables<"semanas">[]> {
  noStore()
  const supabase = await ensureDefaultSemanas()

  const { data, error } = await supabase
    .from("semanas")
    .select("*")
    .order("numero", { ascending: true })

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
  const supabase = await ensureDefaultSemanas()

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
  const supabase = await ensureDefaultSemanas()

  const { data, error } = await supabase
    .from("semanas")
    .select("*, archivos(*)")
    .order("numero", { ascending: true })
    .order("fecha_subida", { referencedTable: "archivos", ascending: false })

  if (error) {
    console.error("Error fetching semanas with archivos", error.message)
    return []
  }

  return (data ?? []) as Array<
    Tables<"semanas"> & { archivos: Tables<"archivos">[] }
  >
}
