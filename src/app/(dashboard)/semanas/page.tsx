import Link from "next/link"
import {
  ArrowUpRight,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSemanas } from "@/lib/data/semanas"
import { EditSemanaDialog } from "./edit-semana-dialog"
import { DeleteSemanaDialog } from "./delete-semana-dialog"
import { CreateSemanaDialog } from "./create-semana-dialog"
import { Badge } from "@/components/ui/badge"
import { VisibilityToggle } from "./visibility-toggle"

function formatDateTime(value?: string | null) {
  if (!value) return "Sin registro"
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export default async function SemanasPage() {
  const semanas = await getSemanas()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Semanas del curso</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las semanas entregadas y accede rápidamente a sus archivos.
          </p>
        </div>
        <CreateSemanaDialog>
          <Button className="gap-2 bg-primary/80 px-4">
            <PlusCircle className="size-4" /> Crear semana
          </Button>
        </CreateSemanaDialog>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141632]/70">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-muted-foreground">Semana</TableHead>
              <TableHead className="text-muted-foreground">Visibilidad</TableHead>
              <TableHead className="text-muted-foreground">Fecha</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semanas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  Aún no se han registrado semanas. Crea una para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              semanas.map((semana) => (
                <TableRow key={semana.id} className="border-white/5">
                  <TableCell className="space-y-2 text-white">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Semana {semana.numero}
                    </p>
                    <p className="text-sm font-semibold text-white">{semana.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {semana.descripcion || "Descripción pendiente."}
                    </p>
                    <Badge
                      variant={semana.habilitada ? "default" : "outline"}
                      className={semana.habilitada ? "bg-primary/20 text-primary" : "border-dashed border-white/30 text-muted-foreground"}
                    >
                      {semana.habilitada ? "Visible" : "Próximamente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <VisibilityToggle
                      semanaId={semana.id}
                      titulo={semana.titulo}
                      descripcion={semana.descripcion}
                      habilitada={semana.habilitada}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(semana.fecha_creacion)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <EditSemanaDialog semana={semana}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-primary/20 text-primary"
                        >
                          <Pencil className="size-4" /> Editar
                        </Button>
                      </EditSemanaDialog>
                      <DeleteSemanaDialog semana={semana}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" /> Eliminar
                        </Button>
                      </DeleteSemanaDialog>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2 border-primary/20 text-primary"
                      >
                        <Link href={"/semanas/" + semana.id}>
                          Ver archivos <ArrowUpRight className="size-4" />
                        </Link>
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
