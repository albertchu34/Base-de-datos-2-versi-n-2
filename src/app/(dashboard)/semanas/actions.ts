
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { parseGithubFileUrl } from "@/lib/github"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import {
  createArchivoSchema,
  createSemanaSchema,
  type CreateSemanaSchema,
} from "@/lib/validation/semanas"

export type ActionResponse = {
  success?: boolean
  error?: string
}

export async function createSemanaAction(
  values: CreateSemanaSchema
): Promise<ActionResponse> {
  const parsed = createSemanaSchema.safeParse({
    ...values,
    titulo: values.titulo.trim(),
    descripcion: values.descripcion.trim(),
    habilitada: values.habilitada ?? false,
  })

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const supabase = await createServerSupabaseClient()
  const { data: lastSemana, error: lastSemanaError } = await supabase
    .from("semanas")
    .select("numero")
    .order("numero", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lastSemanaError) {
    return { error: lastSemanaError.message }
  }

  const nextNumero = (lastSemana?.numero ?? 0) + 1
  const { error } = await supabase.from("semanas").insert({
    titulo: parsed.data.titulo,
    numero: nextNumero,
    descripcion: parsed.data.descripcion,
    habilitada: parsed.data.habilitada ?? false,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/semanas")
  revalidatePath("/")

  return { success: true }
}

const createArchivoPayloadSchema = createArchivoSchema.extend({
  semana_id: z.number().int().positive(),
})

export type CreateArchivoPayload = z.infer<typeof createArchivoPayloadSchema>

export async function createArchivoAction(
  values: CreateArchivoPayload
): Promise<ActionResponse> {
  const parsed = createArchivoPayloadSchema.safeParse({
    ...values,
    nombre: values.nombre.trim(),
    github_url: values.github_url.trim(),
  })

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const { semana_id, nombre, github_url } = parsed.data
  const githubInfo = parseGithubFileUrl(github_url)
  if (!githubInfo) {
    return { error: "Ingresa un enlace válido de GitHub." }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("archivos").insert({
    semana_id,
    nombre,
    github_url: githubInfo.htmlUrl,
  })

  if (error) {
    return { error: error.message }
  }

  const detailPath = "/semanas/" + semana_id
  revalidatePath(detailPath)
  revalidatePath("/semanas")
  revalidatePath("/dashboard")
  revalidatePath("/")

  return { success: true }
}

const updateSemanaSchema = createSemanaSchema.extend({
  id: z.number().int().positive(),
  habilitada: z.boolean(),
})

export type UpdateSemanaPayload = z.infer<typeof updateSemanaSchema>

export async function updateSemanaAction(
  values: UpdateSemanaPayload
): Promise<ActionResponse> {
  const parsed = updateSemanaSchema.safeParse({
    ...values,
    titulo: values.titulo.trim(),
    descripcion: values.descripcion.trim(),
    habilitada: values.habilitada,
  })

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  if (parsed.data.habilitada && parsed.data.titulo.length < 3) {
    return { error: "Cuando la semana está habilitada, debe tener un título válido." }
  }

  const { id, titulo, descripcion, habilitada } = parsed.data
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("semanas")
    .update({ titulo, descripcion, habilitada })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  const detailPath = "/semanas/" + id
  revalidatePath("/dashboard")
  revalidatePath("/semanas")
  revalidatePath(detailPath)
  revalidatePath("/")

  return { success: true }
}

const deleteSemanaSchema = z.object({
  id: z.number().int().positive(),
})

export type DeleteSemanaPayload = z.infer<typeof deleteSemanaSchema>

export async function deleteSemanaAction(
  values: DeleteSemanaPayload
): Promise<ActionResponse> {
  const parsed = deleteSemanaSchema.safeParse(values)

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const { id } = parsed.data
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("semanas").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  const detailPath = "/semanas/" + id
  revalidatePath("/dashboard")
  revalidatePath("/semanas")
  revalidatePath(detailPath)
  revalidatePath("/")

  return { success: true }
}

const updateArchivoPayloadSchema = createArchivoSchema.extend({
  id: z.number().int().positive(),
  semana_id: z.number().int().positive(),
})

export type UpdateArchivoPayload = z.infer<typeof updateArchivoPayloadSchema>

export async function updateArchivoAction(
  values: UpdateArchivoPayload
): Promise<ActionResponse> {
  const parsed = updateArchivoPayloadSchema.safeParse({
    ...values,
    nombre: values.nombre.trim(),
    github_url: values.github_url.trim(),
  })

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const { id, semana_id, nombre, github_url } = parsed.data
  const githubInfo = parseGithubFileUrl(github_url)
  if (!githubInfo) {
    return { error: "Ingresa un enlace válido de GitHub." }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("archivos")
    .update({ nombre, github_url: githubInfo.htmlUrl })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  const detailPath = "/semanas/" + semana_id
  revalidatePath(detailPath)
  revalidatePath("/semanas")
  revalidatePath("/dashboard")
  revalidatePath("/")

  return { success: true }
}

const deleteArchivoSchema = z.object({
  id: z.number().int().positive(),
  semana_id: z.number().int().positive(),
})

export type DeleteArchivoPayload = z.infer<typeof deleteArchivoSchema>

export async function deleteArchivoAction(
  values: DeleteArchivoPayload
): Promise<ActionResponse> {
  const parsed = deleteArchivoSchema.safeParse(values)

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const { id, semana_id } = parsed.data
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("archivos").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  const detailPath = "/semanas/" + semana_id
  revalidatePath(detailPath)
  revalidatePath("/semanas")
  revalidatePath("/dashboard")
  revalidatePath("/")

  return { success: true }
}
