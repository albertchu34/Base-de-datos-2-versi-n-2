"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAction } from "./actions"
import { loginSchema, type LoginSchema } from "@/lib/validation/auth"

type LoginFormProps = {
  redirectTo?: string
}

const formSchema = loginSchema.pick({ email: true, password: true })

type LoginFormValues = z.infer<typeof formSchema>

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    setError(null)
  }, [redirectTo])

  const onSubmit = (values: LoginFormValues) => {
    const payload: LoginSchema = {
      ...values,
      redirectTo,
    }

    setError(null)
    startTransition(async () => {
      const result = await loginAction(payload)

      if (result?.error) {
        setError(result.error)
        return
      }

      const destination =
        redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard"

      router.replace(destination)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo institucional</FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin@upla.edu"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="h-12 font-semibold" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <LogIn className="size-4" />
                Ingresar
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
