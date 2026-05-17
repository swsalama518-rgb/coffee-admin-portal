import { useState, useId } from 'react'

/**
 * EditModal — Inline editing modal for product fields.
 * Uses useId() for accessible label/input pairing.
 *
 * Props:
 *   product       {Object}   — the product being edited
 *   onSave        {Function} — called with updated fields object
 *   onClose       {Function} — closes the modal
 */
function EditModal({ product, onSave, onClose }) {
  // useId generates a stable unique ID for accessibility
  const nameId = useId()
  const priceId = useId()
  const stockId = useId()
  const descId = useId()

  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    description: product.description,
  })

  const [saving, setSaving] = useState(false)
  const [fieldError, setFieldError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Validate price
    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setFieldError('Price must be a positive number.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        description: formData.description,
      })
      onClose()
    } catch (err) {
      setFieldError('Save failed. Make sure JSON Server is running.')
    } finally {
      setSaving(false)
    }
  }

  return (
    /* Overlay */
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Edit product">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor={nameId}>Product Name</label>
            <input
              id={nameId}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={priceId}>Price ($)</label>
              <input
                id={priceId}
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={stockId}>Stock</label>
              <input
                id={stockId}
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={descId}>Description</label>
            <textarea
              id={descId}
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          {fieldError && <p className="form-error">{fieldError}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditModal