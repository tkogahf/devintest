import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '../queryClient'
import {
  getVacuumEnabled,
  getVacuumLevel,
  putVacuumEnabled,
  putVacuumLevel,
} from './vacuum.api'

const KEYS = {
  level: ['vacuum', 'level'] as const,
  enabled: ['vacuum', 'enabled'] as const,
}

export function useVacuumLevel() {
  return useQuery({ queryKey: KEYS.level, queryFn: getVacuumLevel })
}

export function useVacuumEnabled() {
  return useQuery({ queryKey: KEYS.enabled, queryFn: getVacuumEnabled })
}

export async function setVacuumLevel(level: number) {
  const data = await putVacuumLevel(level)
  queryClient.setQueryData(KEYS.level, data)
  return data
}

export function useSetVacuumEnabled() {
  return useMutation({
    mutationFn: putVacuumEnabled,
    onSuccess: (data) => queryClient.setQueryData(KEYS.enabled, data),
  })
}
