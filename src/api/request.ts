import * as v from 'valibot'

// ─── Error ────────────────────────────────────────────────────────────────────

export type ApiErrorType = 'network' | 'parse'

export class ApiError extends Error {
  readonly type: ApiErrorType

  constructor(type: ApiErrorType, cause?: unknown) {
    super(
      type === 'network'
        ? 'Network request failed'
        : 'Response validation failed',
      {
        cause,
      },
    )
    this.name = 'ApiError'
    this.type = type
  }
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type ApiEvent =
  | {
      type: 'success'
      url: string
      method: string
      status: number
      duration: number
    }
  | {
      type: 'network'
      url: string
      method: string
      duration: number
      error: unknown
    }
  | {
      type: 'parse'
      url: string
      method: string
      status: number
      duration: number
      error: unknown
    }

export type OnApiEvent = (event: ApiEvent) => void

// ─── Request ──────────────────────────────────────────────────────────────────

type AnySchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>

export async function request<TSchema extends AnySchema>(
  url: string,
  init: RequestInit,
  schema: TSchema,
  onEvent?: OnApiEvent,
): Promise<v.InferOutput<TSchema>> {
  const method = (init.method ?? 'GET').toUpperCase()
  const sentAt = Date.now()
  const elapsed = () => Date.now() - sentAt

  let response: Response
  try {
    const fetchInit: RequestInit = { ...init }
    if (method === 'GET') delete fetchInit.body
    response = await fetch(url, fetchInit)
  } catch (cause) {
    onEvent?.({
      type: 'network',
      url,
      method,
      duration: elapsed(),
      error: cause,
    })
    throw new ApiError('network', cause)
  }

  const { status } = response
  let raw: unknown
  try {
    const text = await response.text()
    raw = text === '' ? null : JSON.parse(text)
  } catch (cause) {
    onEvent?.({
      type: 'parse',
      url,
      method,
      status,
      duration: elapsed(),
      error: cause,
    })
    throw new ApiError('parse', cause)
  }

  const result = v.safeParse(schema, raw)
  if (!result.success) {
    onEvent?.({
      type: 'parse',
      url,
      method,
      status,
      duration: elapsed(),
      error: result.issues,
    })
    throw new ApiError('parse', result.issues)
  }

  onEvent?.({ type: 'success', url, method, status, duration: elapsed() })
  return result.output
}
