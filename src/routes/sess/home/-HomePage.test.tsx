import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from './-HomePage'

describe('HomePage', () => {
  it('renders a labelled home section with its heading', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { level: 2, name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Home' })).toBeInTheDocument()
  })
})
