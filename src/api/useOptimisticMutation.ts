import { useMutation } from '@tanstack/react-query'
import { queryClient } from './queryClient'

/** DO not use timestamp to track mutation because multiple mutations can have the same timestamp */
const seqMap = new Map<string, number>()

function trackMutation(queryKey: readonly unknown[]) {
  const key = JSON.stringify(queryKey)
  const seq = (seqMap.get(key) ?? 0) + 1
  seqMap.set(key, seq)
  return { isLatest: () => seqMap.get(key) === seq }
}

export function useOptimisticMutation<TVar, TData = TVar>({
  mutationFn,
  queryKey,
}: {
  mutationFn: (variables: TVar) => Promise<TData>
  queryKey: readonly unknown[]
}) {
  return useMutation({
    mutationFn,
    onMutate: (variables) => {
      const { isLatest } = trackMutation(queryKey)
      queryClient.setQueryData(queryKey, variables)
      return { isLatest }
    },
    onSuccess: (data, _variables, context) => {
      if (context.isLatest()) {
        queryClient.setQueryData(queryKey, data)
      }
    },
    onError: (_err, _variables, context) => {
      if (context?.isLatest()) {
        queryClient.invalidateQueries({ queryKey })
      }
    },
  })
}
