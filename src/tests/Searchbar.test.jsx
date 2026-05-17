import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../components/SearchBar'

/**
 * Unit tests for the SearchBar component.
 * Tests: rendering, input changes, clear button behavior.
 */
describe('SearchBar', () => {
  it('renders the search input with correct placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    const input = screen.getByPlaceholderText(/search by name/i)
    expect(input).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} />)
    const input = screen.getByPlaceholderText(/search by name/i)

    fireEvent.change(input, { target: { value: 'Ethiopia' } })
    expect(handleChange).toHaveBeenCalledWith('Ethiopia')
  })

  it('shows the clear button when value is not empty', () => {
    render(<SearchBar value="test" onChange={() => {}} />)
    const clearBtn = screen.getByLabelText(/clear search/i)
    expect(clearBtn).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    const clearBtn = screen.queryByLabelText(/clear search/i)
    expect(clearBtn).not.toBeInTheDocument()
  })

  it('calls onChange with empty string when clear button clicked', () => {
    const handleChange = vi.fn()
    render(<SearchBar value="Ethiopia" onChange={handleChange} />)
    const clearBtn = screen.getByLabelText(/clear search/i)

    fireEvent.click(clearBtn)
    expect(handleChange).toHaveBeenCalledWith('')
  })
})