import { z } from "zod"

const requiredText = (message: string) => z.string().trim().min(1, message)

export const createSemanaSchema = z.object({
  titulo: requiredText("El título es obligatorio.").min(
    3,
    "El título debe tener al menos 3 caracteres."
  ),
  descripcion: requiredText("La descripción es obligatoria.").min(
    10,
    "Describe brevemente el contenido de la semana."
  ),
  habilitada: z.boolean().optional(),
})

export type CreateSemanaSchema = z.infer<typeof createSemanaSchema>

export const createArchivoSchema = z.object({
  nombre: requiredText("El nombre es obligatorio.").min(
    3,
    "El nombre debe tener al menos 3 caracteres."
  ),
  github_url: requiredText("El enlace de GitHub es obligatorio.").min(
    10,
    "Ingresa un enlace válido de GitHub."
  ),
})

export type CreateArchivoSchema = z.infer<typeof createArchivoSchema>
