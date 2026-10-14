import { useQuery } from '@tanstack/react-query'
import { useOptimisticMutation } from '../useOptimisticMutation'
import { HARDWARE_KEYS } from './queryKeys'
import {
  getVacuumEnabled,
  getVacuumLevel,
  putVacuumEnabled,
  putVacuumLevel,
} from './vacuum.api'

const KEYS = HARDWARE_KEYS.vacuum

export function useVacuumLevel() {
  return useQuery({
    queryKey: KEYS.level,
    queryFn: ({ signal }) => getVacuumLevel(signal),
  })
}

export function useVacuumEnabled() {
  return useQuery({
    queryKey: KEYS.enabled,
    queryFn: ({ signal }) => getVacuumEnabled(signal),
  })
}

export function useSetVacuumLevel() {
  return useOptimisticMutation({
    mutationFn: putVacuumLevel,
    queryKey: KEYS.level,
  })
}

export function useSetVacuumEnabled() {
  return useOptimisticMutation({
    mutationFn: putVacuumEnabled,
    queryKey: KEYS.enabled,
  })
}
