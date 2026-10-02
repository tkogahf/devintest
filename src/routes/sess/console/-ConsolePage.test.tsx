import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ConsolePage } from './-ConsolePage'

describe('ConsolePage', () => {
  it('renders a labelled console section with its heading', () => {
    render(<ConsolePage />)

    expect(screen.getByRole('heading', { level: 2, name: 'Console' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Console' })).toBeInTheDocument()
  })
})
