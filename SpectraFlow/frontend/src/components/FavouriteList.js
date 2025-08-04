// Import from React
import React from 'react';

// Import JS files
import ResultItem from './ResultItem';

const FavouriteList = ({ favourites, onRemoveFromFavourites }) => {
  return (
    // The main container for the favourite list.
    <div className="favourite-list">
      {/* Conditional rendering: Check if the 'favourites' array is empty. */}
      {favourites.length === 0 ? (
        // If empty, display a message indicating no favourites.
        <p>No favourites yet.</p>
      ) : (
        // If not empty, map over the 'favourites' array to render each item.
        favourites.map((item, index) => {
          // Debugging log to show the ID of each favourite item being processed.
          console.log('DEBUG: Favourites item ID:', item.id);
          return (
            // Render the ResultItem component for each favourite.
            // `key={item.id}`: Provides a unique key for each list item, which is crucial for React's reconciliation process.
            // `item={item}`: Passes the current favourite item object to the ResultItem component.
            // `onAction={onRemoveFromFavourites}`: Passes the function to call when an action (e.g., "Remove") is triggered on the item.
            // `actionLabel="Remove"`: Specifies the text for the action button within the ResultItem.
            <ResultItem
              key={item.id}
              item={item}
              onAction={onRemoveFromFavourites}
              actionLabel="Remove"
            />
          );
        })
      )}
    </div>
  );
};

export default FavouriteList;