import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { AppShell } from '@/app/AppShell'

function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

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
