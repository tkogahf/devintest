import { boolean, number } from 'valibot'
import { API_URL } from '../endpoints'
import { request } from '../request'

export async function getVacuumLevel() {
  return request(API_URL.MONICA('/vacuum/level'), { method: 'GET' }, number())
}

export async function putVacuumLevel(level: number) {
  return request(
    API_URL.MONICA('/vacuum/level'),
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(level),
    },
    number(),
  )
}

export async function getVacuumEnabled() {
  return request(
    API_URL.MONICA('/vacuum/enabled'),
    { method: 'GET' },
    boolean(),
  )
}

export async function putVacuumEnabled(enabled: boolean) {
  return request(
    API_URL.MONICA('/vacuum/enabled'),
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enabled),
    },
    boolean(),
  )
}
