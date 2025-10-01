
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { extractDriveId } from "@/lib/drive"
import {
  createArchivoSchema,
  createSemanaSchema,
  type CreateArchivoSchema,
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
  })

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("semanas").insert({
    titulo: parsed.data.titulo,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/semanas")

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
    drive_id: values.drive_id.trim(),
  })

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const { semana_id, nombre, drive_id } = parsed.data
  const driveId = extractDriveId(drive_id)
  if (!driveId) {
    return { error: "Ingresa un enlace o ID válido de Google Drive." }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("archivos").insert({
    semana_id,
    nombre,
    drive_id: driveId,
  })

  if (error) {
    return { error: error.message }
  }

  const detailPath = "/semanas/" + semana_id
  revalidatePath(detailPath)
  revalidatePath("/semanas")
  revalidatePath("/dashboard")

  return { success: true }
}

const updateSemanaSchema = createSemanaSchema.extend({
  id: z.number().int().positive(),
})

export type UpdateSemanaPayload = z.infer<typeof updateSemanaSchema>

export async function updateSemanaAction(
  values: UpdateSemanaPayload
): Promise<ActionResponse> {
  const parsed = updateSemanaSchema.safeParse({
    ...values,
    titulo: values.titulo.trim(),
  })

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const { id, titulo } = parsed.data
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("semanas")
    .update({ titulo })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  const detailPath = "/semanas/" + id
  revalidatePath("/dashboard")
  revalidatePath("/semanas")
  revalidatePath(detailPath)

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
    drive_id: values.drive_id.trim(),
  })

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "No se pudo validar la información.",
    }
  }

  const { id, semana_id, nombre, drive_id } = parsed.data
  const driveId = extractDriveId(drive_id)
  if (!driveId) {
    return { error: "Ingresa un enlace o ID válido de Google Drive." }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("archivos")
    .update({ nombre, drive_id: driveId })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  const detailPath = "/semanas/" + semana_id
  revalidatePath(detailPath)
  revalidatePath("/semanas")
  revalidatePath("/dashboard")

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

  return { success: true }
}
