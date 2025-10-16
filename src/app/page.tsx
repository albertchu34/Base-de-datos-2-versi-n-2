import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Download, Eye, FileText, GraduationCap } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { getSemanasWithArchivos } from "@/lib/data/semanas"
import { resolveGithubLinks } from "@/lib/github"
import { ArchivoPreviewDialog } from "@/components/archivo-preview-dialog"
import { Badge } from "@/components/ui/badge"

function formatDate(value?: string | null) {
  if (!value) return "Fecha pendiente"
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export default async function HomePage() {
  const semanas = await getSemanasWithArchivos()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/5 bg-[#111329]/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary/80">
              Portafolio UPLA
            </p>
            <h1 className="text-gradient text-2xl font-semibold">Base de Datos II</h1>
          </div>
             <h1 className="text-gradient text-2xl font-semibold">Chuquiyauri Lagunas Albert Jeankarlo</h1>
          <div>

          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-white/20 bg-white/90 p-2 shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
              <Image
                src="/logo_upla.jpg"
                alt="Logo de la UPLA"
                width={72}
                height={72}
                className="h-14 w-auto object-contain"
                priority
              />
            </div>
            <Link
              href="/login"
              className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
            >
              Ingresar al panel
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
          <section className="grid gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#151737]/85 via-[#12142d]/90 to-[#1d1f3d]/85 p-10 shadow-[0_25px_65px_rgba(13,15,37,0.45)] md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="space-y-5">
              <span className="text-xs uppercase tracking-[0.4em] text-primary/80">
                Presentación
              </span>
              <h2 className="text-gradient text-3xl font-semibold leading-tight">
                Albert Jeankarlo Chuquiyauri Lagunas
              </h2>
              <p className="text-muted-foreground">
                Estudiante de Ingeniería de Sistemas y Computación en la UPLA.
                Este portafolio recopila las actividades desarrolladas en la asignatura
                Base de Datos II, destacando planificación, diseño y gestión de datos.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#181a30]/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                    Código universitario
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">P00904J</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#181a30]/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                    Docente
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Ing. Raúl Enrique Fernández Bejarano
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#181a32]/60 p-6">
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-[#14173a]/80 p-2 shadow-[0_20px_45px_rgba(10,12,30,0.45)]">
                  <div className="relative h-60 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#1f2245]/70 to-[#0f1129]/70">
                    <Image
                      src="/foto.jpg"
                      alt="Fotografía de Albert Jeankarlo Chuquiyauri Lagunas"
                      fill
                      sizes="(min-width: 768px) 320px, 100vw"
                      className="object-cover object-center"
                      priority
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0d21]/80 via-transparent to-transparent" />
                  </div>
                  <p className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Fotografía personal
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-primary/80">
                    <GraduationCap className="size-8" />
                    <span className="font-semibold uppercase tracking-[0.3em]">
                      Enfoque académico
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Intereses en modelado de datos, normalización, diseño lógico y gestión de
                    información para potenciar la toma de decisiones.
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    El portafolio es público para facilitar la consulta de materiales y
                    referencias por parte de docentes y compañeros.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Semanas registradas</h2>
                <p className="text-sm text-muted-foreground">
                  Explora cada entrega y descarga los recursos disponibles.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {semanas.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-[#141632]/50 p-10 text-center text-sm text-muted-foreground">
                  Aún no hay semanas publicadas. Regresa pronto para ver las actualizaciones.
                </div>
              ) : (
                semanas.map((semana) => {
                  const isEnabled = semana.habilitada
                  const hasArchivos = semana.archivos.length > 0

                  return (
                    <article
                      key={semana.id}
                      className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#141632]/70 p-8 shadow-[0_20px_45px_rgba(13,15,37,0.35)]"
                    >
                      <header className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Semana {semana.numero.toString().padStart(2, "0")}
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                              <CalendarDays className="size-5 text-primary/70" />
                              {semana.titulo}
                            </h3>
                            <Badge
                              variant={isEnabled ? "default" : "outline"}
                              className={
                                isEnabled
                                  ? "bg-primary/20 text-primary"
                                  : "border-dashed border-white/40 text-muted-foreground"
                              }
                            >
                              {isEnabled ? "Disponible" : "Próximamente"}
                            </Badge>
                          </div>
                          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            Registrada el {formatDate(semana.fecha_creacion)}
                          </p>
                          <p className="max-w-prose text-sm text-muted-foreground">
                            {semana.descripcion || "Descripción pendiente. Actualiza esta semana para añadir un resumen."}
                          </p>
                        </div>
                        <Link
                          href={"/semanas/" + semana.id}
                          className="rounded-full border border-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/20"
                        >
                          Ver en panel
                        </Link>
                      </header>
                      <div className="space-y-4">
                        {!isEnabled ? (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-[#161834]/50 p-6 text-sm text-muted-foreground">
                            Esta semana se encuentra en preparación. Mantente atento, pronto
                            se publicarán las actividades correspondientes.
                          </div>
                        ) : !hasArchivos ? (
                          <p className="text-sm text-muted-foreground">
                            Esta semana aún no cuenta con archivos publicados.
                          </p>
                        ) : (
                          <Accordion type="multiple" className="space-y-3">
                            {semana.archivos.map((archivo) => {
                              const links = resolveGithubLinks(archivo.github_url)
                              const downloadUrl = links?.downloadUrl ?? archivo.github_url

                              return (
                                <AccordionItem
                                  key={archivo.id}
                                  value={`archivo-${archivo.id}`}
                                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#161834]/60"
                                >
                                  <AccordionTrigger className="px-4">
                                    <div className="flex w-full items-start gap-3">
                                      <div className="rounded-full border border-primary/30 bg-primary/10 p-2 text-primary">
                                        <FileText className="size-4" />
                                      </div>
                                      <div className="text-left">
                                        <p className="font-medium text-white">{archivo.nombre}</p>
                                        <p className="text-xs text-muted-foreground">
                                          Publicado el {formatDate(archivo.fecha_subida)}
                                        </p>
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="px-4">
                                    <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                      <p className="text-xs text-muted-foreground">
                                        Acciones disponibles
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        <ArchivoPreviewDialog
                                          archivoNombre={archivo.nombre}
                                          githubUrl={archivo.github_url}
                                        >
                                          <button
                                            type="button"
                                            className="rounded-full border border-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/20"
                                          >
                                            <span className="flex items-center gap-2">
                                              <Eye className="size-4" /> Previsualizar
                                            </span>
                                          </button>
                                        </ArchivoPreviewDialog>
                                        <a
                                          href={downloadUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
                                        >
                                          <span className="flex items-center gap-2">
                                            <Download className="size-4" /> Descargar
                                          </span>
                                        </a>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )
                            })}
                          </Accordion>
                        )}
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-[#101222]/80 px-6 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Portafolio Universitario - UPLA. Todos los derechos reservados.
      </footer>
    </div>
  )
}
