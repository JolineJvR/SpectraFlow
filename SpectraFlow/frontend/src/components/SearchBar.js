// Import from React
import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, mediaType, setMediaType, onSearch }) => {
  // Define an array of media types to populate the dropdown select element.
  // Each object has a 'value' (for internal use/API) and a 'label' (for display to the user).
  const mediaTypes = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movie" },
    { value: "podcast", label: "Podcast" },
    { value: "music", label: "Music" },
    { value: "audiobook", label: "Audiobook" },
    { value: "shortFilm", label: "Short Film" },
    { value: "tvShow", label: "TV Show" },
    { value: "software", label: "Software" },
    { value: "ebook", label: "eBook" },
  ];

  return (
    // The main container div for the search bar elements.
    <div className='search-bar'>
      {/* Text input field for the search term */}
      <input
        type="text"
        placeholder='Enter search term...' // Placeholder text for user guidance
        value={searchTerm} // Binds the input value to the `searchTerm` prop (controlled component)
        onChange={(e) => setSearchTerm(e.target.value)} // Updates `searchTerm` state as the user types
        // Note: The `onClick` handler for "Enter" key is usually done with `onKeyPress` or `onKeyDown`.
        // `onClick` fires on a mouse click, not a key press.
        // For 'Enter' key, consider: `onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}`
        onClick={(e) => { if (e.key === "Enter") onSearch(); }}
      />
      {/* Dropdown (select) for choosing the media type */}
      <select
        value={mediaType} // Binds the selected value to the `mediaType` prop (controlled component)
        onChange={(e) => setMediaType(e.target.value)} // Updates `mediaType` state when a new option is selected
      >
        {/* Map over the `mediaTypes` array to create an <option> for each type */}
        {mediaTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label} {/* Display label for the user */}
          </option>
        ))}
      </select>
      {/* Button to trigger the search */}
      <button onClick={onSearch}> {/* Calls the `onSearch` function when clicked */}
        Search
      </button>
    </div>
  );
};

export default SearchBar;