import { boolean, number } from 'valibot'
import { API_URL } from '../endpoints'
import { request, type SignalInit } from '../request'

export async function getVacuumLevel({ signal }: SignalInit = {}) {
  return request(
    API_URL.MONICA('/vacuum/level'),
    { method: 'GET', ...(signal !== undefined && { signal }) },
    number(),
  )
}

export async function putVacuumLevel(level: number) {
  return request(
    API_URL.MONICA('/vacuum/level'),
    { method: 'PUT', body: level },
    number(),
  )
}

export async function getVacuumEnabled({ signal }: SignalInit = {}) {
  return request(
    API_URL.MONICA('/vacuum/enabled'),
    { method: 'GET', ...(signal !== undefined && { signal }) },
    boolean(),
  )
}

export async function putVacuumEnabled(enabled: boolean) {
  return request(
    API_URL.MONICA('/vacuum/enabled'),
    { method: 'PUT', body: enabled },
    boolean(),
  )
}
