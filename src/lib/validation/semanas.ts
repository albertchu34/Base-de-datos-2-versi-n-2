import { z } from "zod"

export const createSemanaSchema = z.object({
  titulo: z
    .string({ required_error: "El título es obligatorio." })
    .min(3, "El título debe tener al menos 3 caracteres."),
})

export type CreateSemanaSchema = z.infer<typeof createSemanaSchema>

export const createArchivoSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(3, "El nombre debe tener al menos 3 caracteres."),
  drive_id: z
    .string({ required_error: "El ID de Drive es obligatorio." })
    .min(10, "Ingresa un ID de Drive válido."),
})

export type CreateArchivoSchema = z.infer<typeof createArchivoSchema>
