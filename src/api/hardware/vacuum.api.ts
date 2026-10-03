import { number } from 'valibot'
import { API_URL } from '../endpoints'
import { request } from '../request'

const VacuumLevelSchema = number()

export async function getVacuumLevel() {
  return request(
    API_URL.MONICA('/vacuum/level'),
    { method: 'GET' },
    VacuumLevelSchema,
  )
}
