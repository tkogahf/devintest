import * as v from 'valibot'
import { reportEvent } from './reportEvent'

// ─── Error ────────────────────────────────────────────────────────────────────

export type ApiErrorStage =
  | 'request_encode'
  | 'fetch'
  | 'response_read'
  | 'response_decode'
  | 'response_validation'

export class ApiError extends Error {
  readonly stage: ApiErrorStage

  constructor(stage: ApiErrorStage, cause?: unknown) {
    super('API request failed', { cause })
    this.name = 'ApiError'
    this.stage = stage
  }
}

// ─── Request ──────────────────────────────────────────────────────────────────

type AnySchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type SignalInit = { signal?: AbortSignal }

export type ApiRequestInit =
  | ({ method: 'GET' } & SignalInit)
  | { method: Exclude<RequestMethod, 'GET'>; body?: unknown }

export async function request<TSchema extends AnySchema>(
  url: string,
  init: ApiRequestInit,
  schema: TSchema,
): Promise<v.InferOutput<TSchema>> {
  const { method } = init
  const body = 'body' in init ? init.body : undefined
  const signal = 'signal' in init ? init.signal : undefined

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

  const fetchInit: RequestInit = { method }
  if (signal !== undefined) fetchInit.signal = signal
  if (body !== undefined) {
    try {
      fetchInit.body = JSON.stringify(body)
    } catch (cause) {
      fail('request_encode', cause)
    }
    fetchInit.headers = { 'Content-Type': 'application/json' }
  }

  let response: Response
  try {
    response = await fetch(url, fetchInit)
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      reportEvent('api/aborted', url, { method, duration: elapsed() })
      throw cause
    }
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
    fail('response_decode', cause)
  }

  const result = v.safeParse(schema, raw)
  if (!result.success) {
    fail('response_validation', result.issues)
  }

  reportEvent('api/succeeded', url, { method, status, duration: elapsed() })
  return result.output
}
