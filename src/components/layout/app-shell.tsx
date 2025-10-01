"use client"

import {
  useMemo,
  useTransition,
  type ComponentType,
  type ReactNode,
} from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  CalendarRange,
  LayoutDashboard,
  LogOut,
  Shapes,
} from "lucide-react"

import { logoutAction } from "@/app/actions/logout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

type AppShellProps = {
  children: ReactNode
  user: {
    name: string
    email: string
  }
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/semanas",
    label: "Semanas",
    icon: CalendarRange,
  },
]

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const initials = useMemo(() => {
    if (user.name) {
      const chunks = user.name.trim().split(/\s+/)
      const letters = chunks.slice(0, 2).map((chunk) => chunk.charAt(0))
      const fallback = letters.join("").toUpperCase()
      if (fallback) {
        return fallback
      }
    }
    const fromEmail = user.email.split("@")[0]
    return (fromEmail.slice(0, 2) || "AD").toUpperCase()
  }, [user])

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
      router.replace("/login")
      router.refresh()
    })
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar
          collapsible="icon"
          className="border-r border-white/5 bg-[#121428]/95 text-white/90 backdrop-blur"
        >
          <SidebarHeader className="gap-4 p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1b1d33]/70 p-3 shadow-[0_18px_35px_rgba(13,15,37,0.45)]">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-primary text-background">
                <Shapes className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-primary/80">
                  Base de Datos II
                </p>
                <p className="text-sm font-semibold tracking-wide text-white">
                  Panel UPLA
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="gap-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase tracking-[0.32em] text-muted-foreground/80">
                Secciones
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      pathname === item.href ||
                      (pathname?.startsWith(item.href) && item.href !== "/dashboard")

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href} className="flex items-center gap-2">
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator className="border-white/10" />
          <SidebarFooter className="p-4">
            <div className="rounded-xl border border-white/10 bg-[#1a1c32]/80 p-4 text-xs text-muted-foreground/80">
              <p className="font-medium text-white/90">Visión del curso</p>
              <p>
                Gestiona semanalmente los recursos del portafolio académico con una
                experiencia inspirada en la estética original.
              </p>
            </div>
          </SidebarFooter>
          <SidebarRail className="bg-transparent" />
        </Sidebar>
        <SidebarInset className="bg-transparent">
          <div className="flex h-full flex-col">
            <header className="border-b border-white/5 bg-[#121428]/80 px-6 py-4 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="text-muted-foreground" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
                      Panel de control
                    </p>
                    <h2 className="text-gradient text-xl font-semibold tracking-tight">
                      Bienvenido, {user.name.split(" ")[0] || "Administrador"}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white/90">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground/70">{user.email}</p>
                  </div>
                  <Avatar className="ring-2 ring-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="outline" className="border-primary/40 text-primary/90">
                    Administrador
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={pending}
                    className="border-primary/30 bg-[#181a2f]/60 text-white hover:bg-primary/20 hover:text-primary"
                  >
                    {pending ? <LoaderIndicator /> : <LogOut className="size-4" />}
                    <span className="ml-2 hidden sm:inline">Salir</span>
                  </Button>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto px-6 py-8">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function LoaderIndicator() {
  return (
    <span className="flex items-center gap-2 text-xs font-semibold text-primary">
      <svg
        className="size-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </span>
  )
}
