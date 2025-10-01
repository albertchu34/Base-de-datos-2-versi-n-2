import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

import type { Database } from "@/types/supabase"
import { env } from "@/lib/env"

const AUTH_PATH = "/login"
const DASHBOARD_PATH = "/dashboard"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value, cookie.options)
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthRoute = pathname.startsWith(AUTH_PATH)
  const isProtectedRoute =
    pathname.startsWith(DASHBOARD_PATH) || pathname.startsWith("/semanas")

  if (!session && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = AUTH_PATH
    redirectUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(redirectUrl, { status: 307 })
  }

  if (session && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = DASHBOARD_PATH
    redirectUrl.searchParams.delete("redirectTo")
    return NextResponse.redirect(redirectUrl, { status: 307 })
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/semanas/:path*", "/login"],
}
