import { useRef } from 'react'

/**
 * SearchBar — Controlled search input component.
 * Uses useRef for direct DOM access (focus management).
 *
 * Props:
 *   value    {string}   — current search value (controlled)
 *   onChange {Function} — called on every keystroke
 */
function SearchBar({ value, onChange }) {
  // useRef to programmatically focus the input (e.g., on clear)
  const inputRef = useRef(null)

  function handleClear() {
    onChange('')           // clear the value
    inputRef.current?.focus() // return focus to input
  }

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search by name, origin, or roast…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        aria-label="Search products"
      />
      {value && (
        <button
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar