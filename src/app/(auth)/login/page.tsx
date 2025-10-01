import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth"

import { LoginForm } from "./login-form"

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession()
  if (session) {
    redirect("/dashboard")
  }

  const query = searchParams ? await searchParams : undefined
  const redirectTo =
    query && typeof query.redirectTo === "string" ? query.redirectTo : undefined

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="surface-panel w-full max-w-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#14152b]/80 via-[#14152b]/60 to-[#1c1d33]/80 p-[1px] shadow-[0_25px_55px_rgba(13,15,37,0.55)]">
        <div className="rounded-[calc(var(--radius-lg))] bg-[#101222]/90 p-10">
          <div className="space-y-3 text-center">
            <span className="text-xs uppercase tracking-[0.35em] text-primary">
              Base de Datos II
            </span>
            <h1 className="text-gradient text-3xl font-semibold tracking-tight">
              Bienvenido de vuelta
            </h1>
            <p className="text-muted-foreground text-sm">
              Ingresa con tus credenciales administrativas para gestionar las
              semanas y archivos del curso.
            </p>
          </div>
          <div className="mt-8">
            <LoginForm redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    </div>
  )
}
