import { createFileRoute } from '@tanstack/react-router'
import { ConsolePage } from './-ConsolePage'

export const Route = createFileRoute('/sess/console/')({
  component: ConsolePage,
})
