import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Download, Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getSemanaById } from "@/lib/data/semanas"

import { AddArchivoDialog } from "./add-archivo-dialog"
import { EditArchivoDialog } from "./edit-archivo-dialog"
import { DeleteArchivoDialog } from "./delete-archivo-dialog"

function formatDateTime(value?: string | null) {
  if (!value) return "Sin registro"
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export default async function SemanaDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const idNumber = Number(params.id)
  if (Number.isNaN(idNumber)) {
    notFound()
  }

  const semana = await getSemanaById(idNumber)

  if (!semana) {
    notFound()
  }

  const archivos = semana.archivos ?? []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-2 gap-2 text-muted-foreground"
          >
            <Link href="/semanas">
              <ArrowLeft className="size-4" /> Regresar
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-white">{semana.titulo}</h1>
          <p className="text-sm text-muted-foreground">
            Registrada el {formatDateTime(semana.fecha_creacion)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-primary/30 text-primary">
            {archivos.length} archivos
          </Badge>
          <AddArchivoDialog semanaId={semana.id}>
            <Button className="gap-2 bg-primary/80 px-4">Agregar archivo</Button>
          </AddArchivoDialog>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141632]/70">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-muted-foreground">Archivo</TableHead>
              <TableHead className="text-muted-foreground">Fecha</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archivos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                  Todavía no se han agregado archivos a esta semana.
                </TableCell>
              </TableRow>
            ) : (
              archivos.map((archivo) => (
                <TableRow key={archivo.id} className="border-white/5">
                  <TableCell className="text-white">{archivo.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(archivo.fecha_subida)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <EditArchivoDialog archivo={archivo} semanaId={semana.id}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-primary/20 text-primary"
                        >
                          <Pencil className="size-4" /> Editar
                        </Button>
                      </EditArchivoDialog>
                      <DeleteArchivoDialog archivo={archivo} semanaId={semana.id}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" /> Eliminar
                        </Button>
                      </DeleteArchivoDialog>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-primary"
                      >
                        <a
                          href={"https://drive.google.com/file/d/" + archivo.drive_id + "/view"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="size-4" /> Previsualizar
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2 border-primary/20 text-primary"
                      >
                        <a
                          href={"https://drive.google.com/uc?export=download&id=" + archivo.drive_id}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="size-4" /> Descargar
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
