import { useNavigate } from 'react-router-dom'

/**
 * ProductCard — Displays a single product summary.
 * Receives the product object as a prop and navigates to detail page on click.
 *
 * Props:
 *   product {Object} — the coffee product data
 */
function ProductCard({ product }) {
  const navigate = useNavigate()

  const roastColor = {
    Light: 'badge-light',
    Medium: 'badge-medium',
    Dark: 'badge-dark',
  }

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/products/${product.id}`)}
      aria-label={`View details for ${product.name}`}
    >
      <div className="card-img-wrap">
        <img
          src={product.image || 'https://via.placeholder.com/400x200?text=Coffee'}
          alt={product.name}
          className="card-img"
        />
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{product.name}</h3>
          <span className={`roast-badge ${roastColor[product.roast] || ''}`}>
            {product.roast}
          </span>
        </div>

        <p className="card-origin">🌍 {product.origin}</p>
        <p className="card-desc">{product.description}</p>

        <div className="card-footer">
          <span className="card-price">${Number(product.price).toFixed(2)}</span>
          <span className="card-stock">{product.stock} in stock</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard