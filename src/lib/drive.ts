const DRIVE_ID_PATTERNS = [
  /\/d\/([a-zA-Z0-9_-]+)/,
  /id=([a-zA-Z0-9_-]+)/,
  /[?&]resourcekey=([a-zA-Z0-9_-]+)/,
]

export function extractDriveId(input: string): string | null {
  const value = input.trim()

  for (const pattern of DRIVE_ID_PATTERNS) {
    const match = pattern.exec(value)
    if (match?.[1]) {
      return match[1]
    }
  }

  if (/^[a-zA-Z0-9_-]{20,}$/.test(value)) {
    return value
  }

  return null
}
