import { Link, createRootRoute } from '@tanstack/react-router'
import { DevPreview } from './-dev/DevPreview'
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

function Root() {
  if (import.meta.env.DEV) {
    return (
      <DevPreview>
        <RootLayout />
      </DevPreview>
    )
  }
  return <RootLayout />
}

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
})
