
"use client"

import { useState, useTransition, type ReactNode } from "react"
import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteArchivoAction } from "../actions"
import type { Tables } from "@/types/supabase"

type DeleteArchivoDialogProps = {
  archivo: Tables<"archivos">
  semanaId: number
  children?: ReactNode
}

export function DeleteArchivoDialog({ archivo, semanaId, children }: DeleteArchivoDialogProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      const result = await deleteArchivoAction({ id: archivo.id, semana_id: semanaId })
      if (result?.error) {
        setError(result.error)
        return
      }
      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children ?? (
          <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="size-4" /> Eliminar
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-[#141632]/90 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar archivo</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Esta acción eliminará el archivo "{archivo.nombre}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancelar</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="gap-2"
              disabled={pending}
              onClick={handleDelete}
            >
              {pending && <Loader2 className="size-4 animate-spin" />} Eliminar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
