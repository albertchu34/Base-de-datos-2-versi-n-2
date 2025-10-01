import type { Metadata } from "next"
import { Geist_Mono, Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Base de Datos II | Panel",
  description: "Panel administrativo inspirado en el portafolio de Base de Datos II.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={[poppins.variable, geistMono.variable, "antialiased min-h-screen"].join(" ")}
      >
        {children}
      </body>
    </html>
  )
}
