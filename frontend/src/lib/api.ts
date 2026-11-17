/**
 * バックエンド API (ASP.NET Core) 呼び出しの共通処理。
 * API は常に同一オリジンの /api 配下として呼び出す。
 *   - ローカル: Vite の dev server proxy が http://localhost:5094 へ中継
 *   - 本番:     vercel.json の rewrites が Render へ中継
 * 同一オリジンなので認証 Cookie はブラウザが自動で送受信する。
 */

/** API が返すエラー（ASP.NET Core の ProblemDetails 形式）。 */
export class ApiError extends Error {
  readonly status: number
  readonly title?: string
  readonly detail?: string
  /** 入力チェックのエラー（項目名 → メッセージ）。項目名は camelCase。 */
  readonly fieldErrors: Record<string, string[]>

  constructor(status: number, problem: ProblemDetails | null) {
    super(problem?.detail ?? problem?.title ?? `API error: ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.title = problem?.title
    this.detail = problem?.detail
    this.fieldErrors = normalizeFieldErrors(problem?.errors)
  }
}

type ProblemDetails = {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}

// ASP.NET Core は項目名を "Email" や "email" で返すため、先頭を小文字にそろえる
function normalizeFieldErrors(errors: Record<string, string[]> | undefined) {
  const result: Record<string, string[]> = {}
  for (const [key, messages] of Object.entries(errors ?? {})) {
    const name = key.charAt(0).toLowerCase() + key.slice(1)
    result[name] = [...(result[name] ?? []), ...messages]
  }
  return result
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const problem = await res.json().catch(() => null)
    throw new ApiError(res.status, problem)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}

export function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === 401
}
