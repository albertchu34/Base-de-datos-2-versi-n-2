"use client"

import { useState, type ReactNode } from "react"
import { ExternalLink } from "lucide-react"

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
import { Alert, AlertDescription } from "@/components/ui/alert"

// ✅ Función corregida para resolver correctamente los enlaces desde GitHub
function resolveGithubLinks(githubUrl: string) {
  const regex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/
  const match = githubUrl.match(regex)

  if (!match) return null

  const [, user, repo, branch, path] = match
  const rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`

  return {
    previewUrl: rawUrl, // ✅ se puede usar en iframe si es HTML, PDF o imagen
    downloadUrl: rawUrl,
    htmlUrl: githubUrl,
  }
}

type ArchivoPreviewDialogProps = {
  archivoNombre: string
  githubUrl: string
  children: ReactNode
}

export function ArchivoPreviewDialog({
  archivoNombre,
  githubUrl,
  children,
}: ArchivoPreviewDialogProps) {
  const [open, setOpen] = useState(false)
  const links = resolveGithubLinks(githubUrl)

  const previewUrl = links?.previewUrl
  const downloadUrl = links?.downloadUrl ?? githubUrl
  const htmlUrl = links?.htmlUrl ?? githubUrl

  // ✅ Solo permitimos vista previa para formatos soportados
  const canPreview =
    previewUrl &&
    /\.(html?|pdf|png|jpg|jpeg|gif|svg|txt|md)$/i.test(archivoNombre)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl border-white/10 bg-[#141632]/95 text-white sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Previsualización: {archivoNombre}
          </DialogTitle>
          <DialogDescription className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Vista generada desde GitHub
          </DialogDescription>
        </DialogHeader>

        {canPreview ? (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60">
            <iframe
              src={previewUrl}
              title={`Previsualización ${archivoNombre}`}
              loading="lazy"
              className="h-[70vh] w-full rounded-xl bg-[#0b0d21]"
              allowFullScreen
            />
          </div>
        ) : (
          <Alert
            variant="default"
            className="border-white/10 bg-white/5 text-white"
          >
            <AlertDescription>
              No pudimos generar una vista previa automática para este tipo de
              archivo. Puedes abrirlo directamente en GitHub para revisarlo.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-between">
          <Button
            asChild
            variant="secondary"
            className="w-full justify-center gap-2 border-white/20 bg-white/10 text-white sm:w-auto"
          >
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              Descargar
            </a>
          </Button>
          <Button
            asChild
            className="w-full justify-center gap-2 bg-primary/80 sm:w-auto"
          >
            <a href={htmlUrl} target="_blank" rel="noopener noreferrer">
              Ver en GitHub <ExternalLink className="size-4" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
