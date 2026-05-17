import { useState, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import useProducts from '../hooks/useProducts'

/**
 * AddProductPage — Form to POST a new product to JSON Server.
 * All fields are controlled inputs with validation.
 * useId() generates unique accessible IDs for each label/input pair.
 */
function AddProductPage() {
  const { addProduct } = useProducts()
  const navigate = useNavigate()

  // useId for accessibility — avoids hardcoded IDs colliding
  const nameId = useId()
  const descId = useId()
  const originId = useId()
  const roastId = useId()
  const priceId = useId()
  const stockId = useId()
  const imageId = useId()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    origin: '',
    roast: 'Medium',
    price: '',
    stock: '',
    image: '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Generic change handler for all controlled inputs
  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear individual field error on change
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Validate all fields before submission
  function validate() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Product name is required.'
    if (!formData.description.trim()) newErrors.description = 'Description is required.'
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required.'
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = 'Enter a valid positive price.'
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = 'Enter a valid stock quantity.'
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        // Fallback image if user left it blank
        image: formData.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      }

      const added = await addProduct(newProduct)
      setSuccessMsg(`"${added.name}" added successfully!`)

      // Redirect to the new product's detail page after a short delay
      setTimeout(() => navigate(`/products/${added.id}`), 1200)
    } catch (err) {
      setErrors({ form: 'Failed to add product. Is JSON Server running on port 3001?' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Add New Product</h1>
          <p className="page-sub">Fill out all fields to create a new coffee listing.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/products')}>
          ← Back to Products
        </button>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor={nameId}>Product Name *</label>
            <input
              id={nameId}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ethiopian Sunrise"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor={descId}>Description *</label>
            <textarea
              id={descId}
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the flavor profile…"
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={originId}>Origin *</label>
              <input
                id={originId}
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. Ethiopia"
              />
              {errors.origin && <span className="field-error">{errors.origin}</span>}
            </div>

            <div className="form-group">
              <label htmlFor={roastId}>Roast Level</label>
              <select
                id={roastId}
                name="roast"
                value={formData.roast}
                onChange={handleChange}
              >
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Dark">Dark</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={priceId}>Price ($) *</label>
              <input
                id={priceId}
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor={stockId}>Stock Quantity *</label>
              <input
                id={stockId}
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
              {errors.stock && <span className="field-error">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={imageId}>Image URL (optional)</label>
            <input
              id={imageId}
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://…"
            />
          </div>

          {errors.form && <p className="form-error">{errors.form}</p>}
          {successMsg && <p className="form-success">{successMsg}</p>}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/products')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductPage