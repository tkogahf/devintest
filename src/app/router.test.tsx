import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { routeTree } from '@/routeTree.gen'

function renderAt(initialPath: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })

  return render(<RouterProvider router={router} />)
}

describe('app router', () => {
  it('renders the home page inside the app shell at the index route', async () => {
    renderAt('/')

    expect(await screen.findByRole('heading', { level: 2, name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('navigates to the about route from the primary navigation', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(await screen.findByRole('link', { name: 'About' }))

    expect(await screen.findByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument()
  })

  it('renders the not-found component for an unknown path', async () => {
    renderAt('/does-not-exist')

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
