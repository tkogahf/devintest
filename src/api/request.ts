import * as v from 'valibot'
import { reportEvent } from './reportEvent'

// ─── Error ────────────────────────────────────────────────────────────────────

export type ApiErrorStage =
  | 'fetch'
  | 'response_read'
  | 'body_decode'
  | 'schema_validation'

export class ApiError extends Error {
  readonly stage: ApiErrorStage

  constructor(stage: ApiErrorStage, cause?: unknown) {
    super(
      stage === 'fetch'
        ? 'Network request failed'
        : 'Response validation failed',
      { cause },
    )
    this.name = 'ApiError'
    this.stage = stage
  }
}

// ─── Request ──────────────────────────────────────────────────────────────────

type AnySchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>

export async function request<TSchema extends AnySchema>(
  url: string,
  init: RequestInit,
  schema: TSchema,
): Promise<v.InferOutput<TSchema>> {
  const method = (init.method ?? 'GET').toUpperCase()
  const sentAt = Date.now()
  const elapsed = () => Date.now() - sentAt

  function fail(stage: ApiErrorStage, cause: unknown): never {
    reportEvent('api/failed', url, {
      method,
      duration: elapsed(),
      stage,
      error: cause,
    })
    throw new ApiError(stage, cause)
  }

  let response: Response
  try {
    const fetchInit: RequestInit = { ...init }
    if (method === 'GET') delete fetchInit.body
    response = await fetch(url, fetchInit)
  } catch (cause) {
    fail('fetch', cause)
  }

  const { status } = response
  let text: string
  try {
    text = await response.text()
  } catch (cause) {
    fail('response_read', cause)
  }

  let raw: unknown
  try {
    raw = text === '' ? null : JSON.parse(text)
  } catch (cause) {
    fail('body_decode', cause)
  }

  const result = v.safeParse(schema, raw)
  if (!result.success) {
    fail('schema_validation', result.issues)
  }

  reportEvent('api/succeeded', url, { method, status, duration: elapsed() })
  return result.output
}
