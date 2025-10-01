
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarDays,
  FileStack,
  FolderKanban,
  Sparkle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDashboardStats, getSemanas } from "@/lib/data/semanas"

function formatDate(dateString?: string | null) {
  if (!dateString) return "Sin registro"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

export default async function DashboardPage() {
  const [stats, semanas] = await Promise.all([
    getDashboardStats(),
    getSemanas(),
  ])

  const recientes = semanas.slice(0, 4)
  const relativeUpdate = stats.ultimaActualizacion
    ? formatDistanceToNow(new Date(stats.ultimaActualizacion), {
        addSuffix: true,
        locale: es,
      })
    : "Aún no se cargan archivos"

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#151737]/85 via-[#12142d]/90 to-[#1d1f3d]/85 p-10 shadow-[0_25px_65px_rgba(13,15,37,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] text-primary/80">
              Resumen global
            </span>
            <h1 className="text-gradient text-3xl font-semibold leading-tight">
              Portafolio Base de Datos II
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Monitorea a detalle las semanas entregadas, los archivos asociados y
              mantén un control centralizado inspirado en la estética original del
              portafolio.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="sm" className="h-10 rounded-full bg-primary/80 px-6">
                <Link href="/semanas">Gestionar semanas</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-full border-primary/40 bg-transparent px-6 text-primary hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <Link href="https://supabase.com/" target="_blank" rel="noopener noreferrer">
                  Ver Supabase
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-xs text-primary/80">
            <p className="font-medium uppercase tracking-[0.28em]">
              Última carga
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {relativeUpdate}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border-white/10 bg-[#151736]/70">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                Semanas registradas
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Total de entregas a la fecha
              </CardDescription>
            </div>
            <FolderKanban className="size-8 text-primary/80" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-white">{stats.semanas}</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#151736]/70">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                Archivos vinculados
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Documentos y recursos en cada semana
              </CardDescription>
            </div>
            <FileStack className="size-8 text-primary/80" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-white">{stats.archivos}</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#151736]/70">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                Actividad reciente
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Última fecha de actualización
              </CardDescription>
            </div>
            <Sparkle className="size-8 text-primary/80" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-white">
              {formatDate(stats.ultimaActualizacion)}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Semanas recientes</h2>
            <p className="text-sm text-muted-foreground">
              Las últimas semanas registradas en Supabase.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary">
            <Link href="/semanas">Ver todas</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recientes.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-white/15 bg-[#141632]/50 p-8 text-center text-sm text-muted-foreground">
              Aún no hay semanas registradas. Crea una para comenzar.
            </div>
          ) : (
            recientes.map((semana) => (
              <Card key={semana.id} className="border-white/10 bg-[#141632]/70">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span>{semana.titulo}</span>
                    <CalendarDays className="size-5 text-primary/70" />
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Registrada el {formatDate(semana.fecha_creacion)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm">
                  <span>ID #{semana.id}</span>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-primary/20 text-primary"
                  >
                    <Link href={"/semanas/" + semana.id}>Ver archivos</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
