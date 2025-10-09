"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { updateSemanaAction } from "./actions"

type VisibilityToggleProps = {
  semanaId: number
  titulo: string
  descripcion: string
  habilitada: boolean
}

export function VisibilityToggle({
  semanaId,
  titulo,
  descripcion,
  habilitada,
}: VisibilityToggleProps) {
  const [checked, setChecked] = useState(habilitada)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleChange = (value: boolean) => {
    const previousValue = checked
    setChecked(value)
    setError(null)

    startTransition(async () => {
      const result = await updateSemanaAction({
        id: semanaId,
        titulo,
        descripcion,
        habilitada: value,
      })

      if (result?.error) {
        setChecked(previousValue)
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        <Switch
          checked={checked}
          onCheckedChange={handleChange}
          disabled={pending}
          aria-label={checked ? "Deshabilitar semana" : "Habilitar semana"}
        />
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {checked ? "Visible" : "Próximamente"}
        </span>
        {pending && <Loader2 className="size-4 animate-spin text-primary" />}
      </div>
      {error && (
        <p className="text-xs text-destructive/80">
          {error}
        </p>
      )}
    </div>
  )
}
