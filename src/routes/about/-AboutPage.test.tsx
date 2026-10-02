import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutPage } from './-AboutPage'

describe('AboutPage', () => {
  it('renders a labelled about section with its heading', () => {
    render(<AboutPage />)

    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'About' })).toBeInTheDocument()
  })
})
