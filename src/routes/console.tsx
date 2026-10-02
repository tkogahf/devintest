import { createFileRoute } from '@tanstack/react-router'
import { ConsolePage } from '@/features/console/ConsolePage'

export const Route = createFileRoute('/console')({
  component: ConsolePage,
})
