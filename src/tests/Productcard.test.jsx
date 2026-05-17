import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

// Mock product data for tests
const mockProduct = {
  id: 1,
  name: 'Vanilla Bean',
  description: 'Medium roast with nutty flavor.',
  origin: 'Colombia',
  roast: 'Medium',
  price: 10.00,
  stock: 42,
  image: '',
}

/**
 * Unit tests for ProductCard component.
 * Wraps in MemoryRouter because ProductCard uses useNavigate.
 */
describe('ProductCard', () => {
  const renderCard = () =>
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    )

  it('renders the product name', () => {
    renderCard()
    expect(screen.getByText('Vanilla Bean')).toBeInTheDocument()
  })

  it('renders the product price formatted to 2 decimals', () => {
    renderCard()
    expect(screen.getByText('$10.00')).toBeInTheDocument()
  })

  it('renders the product origin', () => {
    renderCard()
    expect(screen.getByText(/colombia/i)).toBeInTheDocument()
  })

  it('renders the roast badge', () => {
    renderCard()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('renders stock count', () => {
    renderCard()
    expect(screen.getByText(/42 in stock/i)).toBeInTheDocument()
  })

  it('has a button role for accessibility', () => {
    renderCard()
    const card = screen.getByRole('button', { name: /view details for vanilla bean/i })
    expect(card).toBeInTheDocument()
  })
})