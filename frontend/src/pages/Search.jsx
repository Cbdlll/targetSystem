import React from 'react';
import { useSearchParams } from 'react-router-dom';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div>
      <h2>Search</h2>
      
      <form method="GET" action="/search">
        <div className="form-group">
          <label htmlFor="search-input">Search Content</label>
          <input
            id="search-input"
            name="q"
            type="search"
            className="form-control"
            defaultValue={query}
            placeholder="Enter search term..."
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {query && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Search Results</h3>
          <p>
            You searched for:
            {/* VULNERABLE: The query from the URL is rendered without sanitization */}
            <strong dangerouslySetInnerHTML={{ __html: query }}></strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default Search;
