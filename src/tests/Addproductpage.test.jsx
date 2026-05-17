import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AddProductPage from '../pages/AddProductPage'

vi.mock('../hooks/useProducts', () => ({
  default: () => ({
    products: [],
    storeInfo: null,
    loading: false,
    error: null,
    addProduct: vi.fn().mockResolvedValue({ id: 99, name: 'Test Coffee' }),
    updateProduct: vi.fn(),
    removeProduct: vi.fn(),
    fetchProduct: vi.fn(),
  }),
}))

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/products/new']}>
      <Routes>
        <Route path="/products/new" element={<AddProductPage />} />
        <Route path="/products" element={<div>Products Page</div>} />
        <Route path="/products/:id" element={<div>Detail Page</div>} />
      </Routes>
    </MemoryRouter>
  )

describe('AddProductPage', () => {
  it('renders the form heading', () => {
    renderPage()
    expect(screen.getByText('Add New Product')).toBeInTheDocument()
  })

  it('renders all required form fields', () => {
    renderPage()
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /add product/i }))
    await waitFor(() => {
      expect(screen.getByText('Product name is required.')).toBeInTheDocument()
    })
  })

  it('shows price validation error for invalid price', async () => {
    renderPage()
    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'Test Coffee' },
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Great taste' },
    })
    fireEvent.change(screen.getByLabelText(/origin/i), {
      target: { value: 'Brazil' },
    })
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '-5' },
    })
    fireEvent.change(screen.getByLabelText(/stock quantity/i), {
      target: { value: '10' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add product/i }))
    await waitFor(() => {
      expect(screen.getByText(/valid positive price/i)).toBeInTheDocument()
    })
  })
})