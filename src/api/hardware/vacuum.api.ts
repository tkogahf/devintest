import { boolean, number } from 'valibot'
import { API_URL } from '../endpoints'
import { request } from '../request'

export async function getVacuumLevel(signal?: AbortSignal) {
  return request({
    url: API_URL.MONICA('/vacuum/level'),
    method: 'GET',
    schema: number(),
    ...(signal && { signal }),
  })
}

export async function putVacuumLevel(level: number) {
  return request({
    url: API_URL.MONICA('/vacuum/level'),
    method: 'PUT',
    body: level,
    schema: number(),
  })
}

export async function getVacuumEnabled(signal?: AbortSignal) {
  return request({
    url: API_URL.MONICA('/vacuum/enabled'),
    method: 'GET',
    schema: boolean(),
    ...(signal && { signal }),
  })
}

export async function putVacuumEnabled(enabled: boolean) {
  return request({
    url: API_URL.MONICA('/vacuum/enabled'),
    method: 'PUT',
    body: enabled,
    schema: boolean(),
  })
}
