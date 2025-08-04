// Import from React
import React from 'react';

// Import JS files
import ResultItem from "./ResultItem";

const SearchResults = ({ results, onAddToFavourites }) => {
  // Conditional rendering: If the 'results' array is empty, display a message.
  if (results.length === 0) {
    return <p>No results found. Try a different search!</p>;
  }

  // If there are results, render them inside a div.
  return (
    // The main container for the search results list.
    <div className='search-results'>
      {/* Map over the 'results' array to render a ResultItem for each item. */}
      {results.map((item) => (
        // Render the ResultItem component for each search result.
        // `key={item.id}`: Provides a unique key for each list item, crucial for React's reconciliation.
        // `item={item}`: Passes the current item object to the ResultItem component.
        // `onAction={onAddToFavourites}`: Passes the function to call when the "Add to Favourites" action is triggered.
        // `actionLabel="Add to Favourites"`: Specifies the text for the action button within the ResultItem.
        <ResultItem
          key={item.id}
          item={item}
          onAction={onAddToFavourites}
          actionLabel="Add to Favourites"
        />
      ))}
    </div>
  );
};

export default SearchResults; // Exports the SearchResults component for use in other parts of the application.