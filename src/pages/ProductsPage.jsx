import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useProducts from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'

/**
 * ProductsPage — Lists all products with dynamic search filtering.
 * Search filters by name, origin, and roast level simultaneously.
 */
function ProductsPage() {
  const { products, loading, error } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // Dynamic filter: match name, origin, or roast
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q) ||
      p.roast.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  })

  if (loading) return <div className="status-msg">Loading products…</div>
  if (error) return <div className="status-msg error">Error: {error}</div>

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-sub">{filteredProducts.length} of {products.length} showing</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/products/new')}>
          + Add Product
        </button>
      </div>

      {/* Search bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products match "<strong>{searchQuery}</strong>"</p>
          <button className="btn-secondary" onClick={() => setSearchQuery('')}>
            Clear Search
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage