import { NavLink } from 'react-router-dom'

/**
 * Navbar — Persistent navigation bar
 * Uses NavLink so active route gets the 'active' CSS class automatically.
 */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">☕</span>
        <span className="brand-name">Coffee R Us</span>
        <span className="brand-tag">Admin</span>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        <li>
          <NavLink to="/products/new" className="nav-cta">+ Add Product</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar