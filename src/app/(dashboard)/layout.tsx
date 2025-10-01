import { redirect } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Administrador"

  const email = user.email ?? "admin@upla.edu"

  return (
    <AppShell
      user={{
        name: fullName,
        email,
      }}
    >
      {children}
    </AppShell>
  )
}
