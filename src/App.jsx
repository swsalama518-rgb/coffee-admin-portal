import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ProductsPage from './pages/ProductsPage'
import AddProductPage from './pages/AddProductPage'
import ProductDetailPage from './pages/ProductDetailPage'

/**
 * App.jsx — Root component
 * Defines all client-side routes using React Router v6.
 * Navbar is rendered on every page outside the Routes block.
 */
function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Landing page — store overview */}
          <Route path="/" element={<LandingPage />} />

          {/* Product listing with search */}
          <Route path="/products" element={<ProductsPage />} />

          {/* Add a new product via form */}
          <Route path="/products/new" element={<AddProductPage />} />

          {/* Single product detail + edit */}
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Fallback 404 */}
          <Route path="*" element={
            <div className="not-found">
              <h2>404 — Page not found</h2>
              <p>Check the URL or head back to the dashboard.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App