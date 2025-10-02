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

export const env: EnvValues = required.reduce((acc, key) => {
  acc[key] = readEnv(key)
  return acc
}, {} as EnvValues)
