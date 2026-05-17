import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useProducts from '../hooks/useProducts'

/**
 * LandingPage — Dashboard overview.
 * Shows store info and key stats (total products, avg price, low stock).
 */
function LandingPage() {
  const { products, storeInfo, loading, error } = useProducts()
  const navigate = useNavigate()

  // Compute stats from the products array
  const totalProducts = products.length
  const avgPrice =
    products.length > 0
      ? (products.reduce((sum, p) => sum + Number(p.price), 0) / products.length).toFixed(2)
      : '0.00'
  const lowStockCount = products.filter((p) => p.stock < 20).length

  if (loading) return <div className="status-msg">Loading store data…</div>
  if (error) return <div className="status-msg error">Error: {error}</div>

  return (
    <div className="page landing-page">
      {/* Hero section */}
      <section className="hero">
        <div className="hero-text">
          <h1>{storeInfo?.name || 'Admin Portal'}</h1>
          <p className="hero-sub">{storeInfo?.description}</p>
          <p className="hero-meta">
            📞 {storeInfo?.phone_number} &nbsp;|&nbsp; ✉️ {storeInfo?.email} &nbsp;|&nbsp;
            Est. {storeInfo?.established}
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/products')}>
              View All Products
            </button>
            <button className="btn-secondary" onClick={() => navigate('/products/new')}>
              + Add Product
            </button>
          </div>
        </div>
        <div className="hero-graphic">☕</div>
      </section>

      {/* Stats cards */}
      <section className="stats-section">
        <h2 className="section-title">Store Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{totalProducts}</span>
            <span className="stat-label">Total Products</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">${avgPrice}</span>
            <span className="stat-label">Average Price</span>
          </div>
          <div className="stat-card warn">
            <span className="stat-value">{lowStockCount}</span>
            <span className="stat-label">Low Stock Items</span>
          </div>
        </div>
      </section>

      {/* Recent products preview */}
      <section className="recent-section">
        <h2 className="section-title">Recent Products</h2>
        <ul className="recent-list">
          {products.slice(0, 3).map((p) => (
            <li
              key={p.id}
              className="recent-item"
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <span className="recent-name">{p.name}</span>
              <span className="recent-origin">{p.origin}</span>
              <span className="recent-price">${Number(p.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default LandingPage