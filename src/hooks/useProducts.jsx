import { useState, useEffect, useCallback } from 'react'

// Base URL for our simulated backend (JSON Server)
const API_BASE = 'http://localhost:3001'

/**
 * useProducts — Custom hook
 *
 * Centralizes all product data fetching and mutations.
 * Provides: products list, store info, loading/error state,
 * and CRUD functions (add, update, remove).
 *
 * Usage:
 *   const { products, loading, addProduct, updateProduct } = useProducts()
 */
function useProducts() {
  const [products, setProducts] = useState([])
  const [storeInfo, setStoreInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── GET all products ─────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [productsRes, storeRes] = await Promise.all([
        fetch(`${API_BASE}/coffee`),
        fetch(`${API_BASE}/store_info`),
      ])

      if (!productsRes.ok) throw new Error('Failed to fetch products')
      if (!storeRes.ok) throw new Error('Failed to fetch store info')

      const productsData = await productsRes.json()
      const storeData = await storeRes.json()

      setProducts(productsData)
      setStoreInfo(storeData[0]) // store_info is an array; grab the first
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ── GET single product ───────────────────────────────────────────────────
  const fetchProduct = useCallback(async (id) => {
    const res = await fetch(`${API_BASE}/coffee/${id}`)
    if (!res.ok) throw new Error('Product not found')
    return res.json()
  }, [])

  // ── POST — Add new product ───────────────────────────────────────────────
  const addProduct = useCallback(async (newProduct) => {
    const res = await fetch(`${API_BASE}/coffee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
    if (!res.ok) throw new Error('Failed to add product')
    const added = await res.json()
    // Optimistically update local state
    setProducts((prev) => [...prev, added])
    return added
  }, [])

  // ── PATCH — Update existing product ─────────────────────────────────────
  const updateProduct = useCallback(async (id, changes) => {
    const res = await fetch(`${API_BASE}/coffee/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    })
    if (!res.ok) throw new Error('Failed to update product')
    const updated = await res.json()
    // Sync local state after successful PATCH
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
    return updated
  }, [])

  // ── DELETE — Remove a product ────────────────────────────────────────────
  const removeProduct = useCallback(async (id) => {
    const res = await fetch(`${API_BASE}/coffee/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete product')
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return {
    products,
    storeInfo,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    removeProduct,
  }
}

export default useProducts