"use client"

import { useState, useTransition, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  createArchivoSchema,
  type CreateArchivoSchema,
} from "@/lib/validation/semanas"

import { createArchivoAction } from "../actions"

type AddArchivoDialogProps = {
  semanaId: number
  children: ReactNode
}

export function AddArchivoDialog({ semanaId, children }: AddArchivoDialogProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CreateArchivoSchema>({
    resolver: zodResolver(createArchivoSchema),
    defaultValues: {
      nombre: "",
      drive_id: "",
    },
  })

  const handleSubmit = (values: CreateArchivoSchema) => {
    setError(null)
    startTransition(async () => {
      const result = await createArchivoAction({
        semana_id: semanaId,
        nombre: values.nombre,
        drive_id: values.drive_id,
      })

      if (result?.error) {
        setError(result.error)
        return
      }

      form.reset({ nombre: "", drive_id: "" })
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[#141632]/90 text-white">
        <DialogHeader>
          <DialogTitle>Agregar archivo</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Pega el enlace completo o el ID del archivo de Google Drive que deseas publicar.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del archivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Trabajo práctico" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="drive_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Google Drive</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://drive.google.com/file/d/ABCDEFGHIJK/view"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="gap-2" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />} Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
