const GITHUB_BLOB_REGEX =
  /^https:\/\/github\.com\/([^\/\s]+)\/([^\/\s]+)\/blob\/([^\/\s]+)\/(.+)$/i

const GITHUB_RAW_REGEX =
  /^https:\/\/raw\.githubusercontent\.com\/([^\/\s]+)\/([^\/\s]+)\/([^\/\s]+)\/(.+)$/i

const GITHUB_OBJECT_REGEX =
  /^https:\/\/github\.com\/([^\/\s]+)\/([^\/\s]+)\/raw\/([^\/\s]+)\/(.+)$/i

export type GithubFileInfo = {
  owner: string
  repo: string
  branch: string
  path: string
  htmlUrl: string
  rawUrl: string
}

function sanitizePath(path: string) {
  return path.replace(/^\//, "")
}

function buildHtmlUrl(owner: string, repo: string, branch: string, path: string) {
  return `https://github.com/${owner}/${repo}/blob/${branch}/${sanitizePath(path)}`
}

function buildRawUrl(owner: string, repo: string, branch: string, path: string) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${sanitizePath(path)}`
}

export function parseGithubFileUrl(input: string): GithubFileInfo | null {
  const value = input.trim()

  if (!value.startsWith("https://github.com") && !value.startsWith("https://raw.githubusercontent.com")) {
    return null
  }

  const blobMatch = GITHUB_BLOB_REGEX.exec(value)
  if (blobMatch) {
    const [, owner, repo, branch, path] = blobMatch
    return {
      owner,
      repo,
      branch,
      path: sanitizePath(path),
      htmlUrl: buildHtmlUrl(owner, repo, branch, path),
      rawUrl: buildRawUrl(owner, repo, branch, path),
    }
  }

  const rawMatch = GITHUB_RAW_REGEX.exec(value)
  if (rawMatch) {
    const [, owner, repo, branch, path] = rawMatch
    return {
      owner,
      repo,
      branch,
      path: sanitizePath(path),
      htmlUrl: buildHtmlUrl(owner, repo, branch, path),
      rawUrl: buildRawUrl(owner, repo, branch, path),
    }
  }

  const objectMatch = GITHUB_OBJECT_REGEX.exec(value)
  if (objectMatch) {
    const [, owner, repo, branch, path] = objectMatch
    return {
      owner,
      repo,
      branch,
      path: sanitizePath(path),
      htmlUrl: buildHtmlUrl(owner, repo, branch, path),
      rawUrl: buildRawUrl(owner, repo, branch, path),
    }
  }

  return null
}

export function buildGithubDownloadUrl(htmlUrlOrRawUrl: string) {
  const info = parseGithubFileUrl(htmlUrlOrRawUrl)
  if (!info) return null
  return info.rawUrl
}

function getFileExtension(path: string) {
  const parts = path.split(".")
  if (parts.length < 2) return ""
  return parts.pop()?.toLowerCase() ?? ""
}

const DIRECT_PREVIEW_EXTENSIONS = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "mp4",
  "webm",
])

export function buildGithubPreviewUrl(htmlUrlOrRawUrl: string) {
  const info = parseGithubFileUrl(htmlUrlOrRawUrl)
  if (!info) return null

  const extension = getFileExtension(info.path)
  const rawUrl = info.rawUrl

  if (DIRECT_PREVIEW_EXTENSIONS.has(extension)) {
    return rawUrl
  }

  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(rawUrl)}`
}

export function resolveGithubLinks(htmlUrlOrRawUrl: string) {
  const info = parseGithubFileUrl(htmlUrlOrRawUrl)
  if (!info) return null

  const extension = getFileExtension(info.path)
  const directPreview = DIRECT_PREVIEW_EXTENSIONS.has(extension)

  const previewUrl = directPreview
    ? info.rawUrl
    : `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(info.rawUrl)}`

  return {
    htmlUrl: info.htmlUrl,
    downloadUrl: info.rawUrl,
    previewUrl,
  }
}
