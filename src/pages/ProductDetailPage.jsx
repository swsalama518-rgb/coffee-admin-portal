import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useProducts from '../hooks/useProducts'
import EditModal from '../components/EditModal'

/**
 * ProductDetailPage — Shows a single product's full details.
 * Allows the admin to:
 *   - Edit product fields via EditModal (PATCH request)
 *   - Delete the product (DELETE request)
 *
 * useParams() grabs the :id from the URL.
 */
function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchProduct, updateProduct, removeProduct } = useProducts()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Fetch this specific product when the component mounts or id changes
  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const data = await fetchProduct(id)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id, fetchProduct])

  // PATCH — called by EditModal on save
  async function handleSave(changes) {
    const updated = await updateProduct(product.id, changes)
    setProduct(updated)
  }

  // DELETE — remove product and redirect
  async function handleDelete() {
    try {
      await removeProduct(product.id)
      navigate('/products')
    } catch (err) {
      setError('Delete failed. Check your server connection.')
    }
  }

  const roastColor = { Light: '#e8d5b0', Medium: '#c8956c', Dark: '#5c3317' }
  const roastText = { Light: '#6b4c1e', Medium: '#fff', Dark: '#fff' }

  if (loading) return <div className="status-msg">Loading product…</div>
  if (error) return <div className="status-msg error">Error: {error}</div>
  if (!product) return <div className="status-msg">Product not found.</div>

  return (
    <div className="page">
      {/* Back button */}
      <button className="btn-secondary back-btn" onClick={() => navigate('/products')}>
        ← Back to Products
      </button>

      <div className="detail-layout">
        {/* Product image */}
        <div className="detail-img-wrap">
          <img
            src={product.image || 'https://via.placeholder.com/600x400?text=Coffee'}
            alt={product.name}
            className="detail-img"
          />
        </div>

        {/* Product info */}
        <div className="detail-info">
          <div className="detail-header">
            <h1 className="detail-title">{product.name}</h1>
            <span
              className="detail-roast"
              style={{
                background: roastColor[product.roast] || '#ccc',
                color: roastText[product.roast] || '#333',
              }}
            >
              {product.roast} Roast
            </span>
          </div>

          <p className="detail-origin">🌍 Origin: <strong>{product.origin}</strong></p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Price</span>
              <span className="meta-value price">${Number(product.price).toFixed(2)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock</span>
              <span className={`meta-value ${product.stock < 20 ? 'low-stock' : ''}`}>
                {product.stock} units {product.stock < 20 && '⚠️'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Product ID</span>
              <span className="meta-value">#{product.id}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="detail-actions">
            <button className="btn-primary" onClick={() => setShowEditModal(true)}>
              ✏️ Edit Product
            </button>

            {!deleteConfirm ? (
              <button className="btn-danger" onClick={() => setDeleteConfirm(true)}>
                🗑 Delete
              </button>
            ) : (
              <div className="delete-confirm">
                <span>Are you sure?</span>
                <button className="btn-danger" onClick={handleDelete}>Yes, delete</button>
                <button className="btn-secondary" onClick={() => setDeleteConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal — rendered conditionally */}
      {showEditModal && (
        <EditModal
          product={product}
          onSave={handleSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}

export default ProductDetailPage