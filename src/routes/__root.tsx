import { Link, createRootRoute } from '@tanstack/react-router'
import { RootLayout } from './-RootLayout'

function NotFound() {
  return (
    <section aria-labelledby="not-found-heading">
      <h2 id="not-found-heading">Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/">Go to the home page</Link>
    </section>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})
