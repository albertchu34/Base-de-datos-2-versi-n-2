const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const

type EnvKey = (typeof required)[number]

type EnvValues = Record<EnvKey, string>

function readEnv(key: EnvKey) {
  const value = process.env[key]
  if (!value) {
    throw new Error("Missing environment variable: " + key)
  }
  return value
}

export const env: EnvValues = {
  NEXT_PUBLIC_SUPABASE_URL: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
}
