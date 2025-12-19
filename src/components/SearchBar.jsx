import React, { useState, useCallback, memo } from 'react'
import './SearchBar.css'

const SEARCH_ENGINES = {
  google: 'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  startpage: 'https://www.startpage.com/sp/search?query=',
  ecosia: 'https://www.ecosia.org/search?q=',
  bing: 'https://www.bing.com/search?q='
}

function SearchBar({ searchEngine }) {
  const [query, setQuery] = useState('')

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (query.trim()) {
      const searchUrl = SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.google
      window.open(searchUrl + encodeURIComponent(query), '_self')
    }
  }, [query, searchEngine])

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
      <button type="submit" className="search-button" aria-label="Search">
        🔍
      </button>
    </form>
  )
}

export default memo(SearchBar)

