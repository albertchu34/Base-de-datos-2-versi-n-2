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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  createSemanaSchema,
  type CreateSemanaSchema,
} from "@/lib/validation/semanas"

import { createSemanaAction } from "./actions"
import { Switch } from "@/components/ui/switch"

type CreateSemanaDialogProps = {
  children: ReactNode
}

export function CreateSemanaDialog({ children }: CreateSemanaDialogProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CreateSemanaSchema>({
    resolver: zodResolver(createSemanaSchema),
    defaultValues: {
      titulo: "",
      habilitada: false,
    },
  })

  const handleSubmit = (values: CreateSemanaSchema) => {
    setError(null)
    startTransition(async () => {
      const result = await createSemanaAction(values)
      if (result?.error) {
        setError(result.error)
        return
      }

      form.reset({ titulo: "", habilitada: false })
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[#141632]/90 text-white">
        <DialogHeader>
          <DialogTitle>Nueva semana</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Registra una nueva semana para adjuntar archivos y actividades.
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
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la semana</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Semana 7 - Modelado lógico"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="habilitada"
              render={({ field }) => (
                <FormItem className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <FormLabel>Mostrar en el portal</FormLabel>
                      <FormDescription>
                        Activa la semana cuando quieras que sea visible para los estudiantes.
                      </FormDescription>
                    </div>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </div>
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
