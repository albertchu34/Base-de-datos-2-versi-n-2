import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Ingresa un correo válido.'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria.')
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  redirectTo: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
