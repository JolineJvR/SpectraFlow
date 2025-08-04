// Import from React
import React from 'react';
import { useState, useEffect } from 'react';

// Import axios
import axios from "axios";

// Import JS files
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import FavouriteList from "./components/FavouriteList";

// Import logo image.
import SpectraFlow from "./image/SpectraFlow.png";

// Import CSS
import "./App.css";

const App = () => {
  // State variables using the useState hook:
  // searchTerm: Stores the text entered by the user in the search bar.
  const [searchTerm, setSearchTerm] = useState("");
  // mediaType: Stores the selected media type from the dropdown (e.g., "all", "music").
  const [mediaType, setMediaType] = useState("all");
  // searchResults: An array to store the data fetched from the iTunes API.
  const [searchResults, setSearchResults] = useState([]);
  // favourites: An array to store items added to the user's favourites list.
  const [favourites, setFavourites] = useState(() => {
    // Initialize favourites from localStorage on component mount to persist data.
    const storedFavourites = localStorage.getItem('favourites');
    return storedFavourites ? JSON.parse(storedFavourites) : [];
  });
  // jwtToken: Stores the JSON Web Token obtained from the backend for API authorization.
  const [jwtToken, setJwtToken] = useState("");
  // loading: Boolean state to indicate if an API request is in progress.
  const [loading, setLoading] = useState(false);
  // error: Stores any error messages to be displayed to the user.
  const [error, setError] = useState("");

  // Define the base URL for the backend API.
  const API_BASE_URL = "http://localhost:5000/api/tunes";

  // useEffect hook for side effects:
  // This effect runs once when the component mounts (due to the empty dependency array `[]`).
  // Its purpose is to fetch a JWT token from the backend for authentication.
  useEffect(() => {
    const getJwt = async () => {
      try {
        console.log("Attempting to get JWT from:", `${API_BASE_URL}/generate-token`);
        // Make a POST request to the backend to generate a new JWT.
        const response = await axios.post(`${API_BASE_URL}/generate-token`);
        // Store the received token in the `jwtToken` state.
        setJwtToken(response.data.token);
        console.log("SUCCESS: JWT Token obtained:", response.data.token);
      } catch (e) {
        // If there's an error generating the token, log it and set an error message.
        console.error("Error generating JWT:", e);
        setError("Failed to get authorization token. Please ensure the backend is running.");
      }
    };
    getJwt(); // Call the async function to execute the JWT generation.
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // useEffect hook to persist favourites to localStorage whenever the `favourites` state changes.
  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const handleSearch = async () => {
    // Input validation: Check if a search term is provided.
    if (!searchTerm) {
      setError("Please enter a search term.");
      return; // Stop execution if no search term.
    }
    // Authorization check: Ensure a JWT token is available before making the search request.
    if (!jwtToken) {
      console.error("Frontend: No JWT token found when attempting search. This should not happen if initial token generation was successful.");
      setError("Authorization token not available. Please refresh or try again.");
      return; // Stop execution if no JWT token.
    }

    // Set loading state to true and clear previous errors and search results.
    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      // Debugging logs (commented out):
      // console.log('Frontend: Attempting to send search request.');
      // console.log('Frontend: The jwtToken value right now is:', jwtToken);
      // console.log('Frontend: Type of jwtToken is:', typeof jwtToken);
      // console.log('Frontend: Sending search request to:', `${API_BASE_URL}/search`);
      // console.log('Frontend: Sending x-access-token header with token:', jwtToken);

      // Make a GET request to the backend's search endpoint.
      // Pass `searchTerm` and `mediaType` as query parameters.
      // Include the JWT in the 'x-access-token' header for authorization.
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { term: searchTerm, media: mediaType },
        headers: {
          "x-access-token": jwtToken, // Attach the JWT for verification by the backend.
        },
      });
      // Update the `searchResults` state with the data received from the backend.
      setSearchResults(response.data);
      console.log('Frontend: Search successful. Results:', response.data);
    } catch (e) {
      // Handle errors during the API call.
      console.error("Error fetching search results:", e);
      // Set a user-friendly error message.
      setError("Error fetching search results. Please try again.");
    } finally {
      // This block always executes, regardless of try or catch.
      // Set loading state back to false once the request is complete.
      setLoading(false);
    }
  };

  const addToFavourites = (item) => {
    // Check if the item (identified by its `id`) is already in the `favourites` list.
    if (!favourites.some(fave => fave.id === item.id)) {
      // If not present, create a new array with existing favourites and the new item, then update state.
      setFavourites([...favourites, item]);
      console.log("Item added to favourites:", item);
    } else {
      console.log("Item already in favourites:", item);
    }
  };

  const removeFromFavourites = (itemToRemove) => {
    // Filter out the item with the matching ID from the `favourites` array
    // and update the state with the new array.
    setFavourites(favourites.filter(item => item.id !== itemToRemove.id));
    console.log("Item removed from favourites:", itemToRemove);
  };

  return (
    // The main container for the entire application.
    <div className='App'>
      {/* Application logo */}
      <img src={SpectraFlow} alt="SpectraFlow logo" className='app-logo' />

      {/* SearchBar component: passes state variables and handlers as props. */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        mediaType={mediaType}
        setMediaType={setMediaType}
        onSearch={handleSearch}
      />

      {/* Conditional rendering for loading and error messages. */}
      {loading && <p>Loading search results...</p>}
      {error && <p className='error'>{error}</p>}

      {/* Container for the search results and favourites sections. */}
      <div className='content-container'>
        {/* Section for displaying search results. */}
        <div className='search-results-section'>
          <h2>Search Results</h2>
          {/* SearchResults component: displays fetched items and provides a function to add to favourites. */}
          <SearchResults results={searchResults} onAddToFavourites={addToFavourites} />
        </div>

        {/* Section for displaying favourite items. */}
        <div className='favourites-section'>
          <h2>My Favourites</h2>
          {/* FavouriteList component: displays favourite items and provides a function to remove them. */}
          <FavouriteList favourites={favourites} onRemoveFromFavourites={removeFromFavourites} />
        </div>
      </div>
    </div>
  );
};

export default App;