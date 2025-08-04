// Import from React
import React from 'react';

const ResultItem = ({ item, onAction, actionLabel }) => {
  /**
   * @function formateDate
   * @description A helper function to format a date string into a more readable local date string.
   * Includes basic error handling for invalid date strings.
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string or an error message.
   */
  const formateDate = (dateString) => {
    // If the date string is null or undefined, return 'N/A'.
    if (!dateString) return 'N/A';
    // Define options for date formatting (e.g., "January 1, 2023").
    const options = { year: "numeric", month: "long", day: "numeric" };
    try {
      // Attempt to create a Date object and format it to the user's locale.
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      // If an error occurs during date formatting (e.g., invalid date string), log it.
      console.error("Error formatting date:", e, dateString);
      // Return 'Invalid Date' to the UI.
      return 'Invalid Date';
    }
  };

  return (
    // The main container div for a single result item, used for styling.
    <div className='result-item'>
      {/* Container for the item's image and an overlay. */}
      <div className="item-image-background">
        {/* Displays the item's artwork. 'alt' provides accessibility. */}
        <img src={item.artwork} alt={item.title} />
        {/* An empty div often used for visual effects like gradients or darkening on the image. */}
        <div className="item-text-overlay"></div>
      </div>

      {/* Container for the textual details of the item. */}
      <div className='item-details'>
        {/* Displays the item's title (e.g., track name, collection name). */}
        <h3>{item.title}</h3>
        {/* Displays the artist's name. */}
        <p><strong>Artist:</strong> {item.artist}</p>
        {/* Conditionally displays the album/collection name if it exists and the item is not explicitly an album. */}
        {item.collectionName && item.kind !== "album" && (
          <p><strong>Album/Collection:</strong> {item.collectionName}</p>
        )}
        {/* Conditionally displays the formatted release date if it exists. */}
        {item.releaseDate && <p><strong>Released:</strong> {formateDate(item.releaseDate)}</p>}
        {/* Displays the type of media (e.g., "song", "movie", "podcast"). */}
        <p><strong>Type:</strong> {item.kind || "N/A"}</p>
        {/* The action button. When clicked, it calls the `onAction` prop function, passing the `item` object. */}
        <button onClick={() => onAction(item)}>
          {/* The label for the button, e.g., "Add" or "Remove". */}
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default ResultItem;