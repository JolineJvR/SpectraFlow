// Import the 'express' library to create and manage the router.
const express = require("express");
// Import the 'axios' library for making HTTP requests to external APIs (like iTunes).
const axios = require("axios");
// Import the 'jsonwebtoken' library for creating and verifying JSON Web Tokens.
const jwt = require("jsonwebtoken");
// Import the custom 'verifyToken' middleware from the specified path.
// This middleware is used to protect routes, ensuring only authenticated requests proceed.
const verifyToken = require("../middleware/auth");

// Create a new Express router instance.
const router = express.Router();

router.post("/generate-token", (req, res) => {
    // Log the secret key being used for signing the JWT for debugging purposes.
    // It's crucial that process.env.JWT_SECRET is securely configured in production.
    console.log("DEBUG: secret used for Signing:", process.env.JWT_SECRET);

    // Sign a new JWT.
    // The payload is { purpose: "itunes-api-access" }, indicating the token's intent.
    // The secret key for signing comes from environment variables (process.env.JWT_SECRET).
    // The token is configured to expire in 1 hour.
    const token = jwt.sign({ purpose: "itunes-api-access" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the generated token back to the client in a JSON response.
    res.json({ token });
});

router.get('/search', verifyToken, async (req, res) => {
    // Extract 'term' and 'media' query parameters from the request.
    const { term, media } = req.query;

    try {
        // Make an asynchronous GET request to the iTunes Search API.
        const itunesResponse = await axios.get('https://itunes.apple.com/search', {
            // Define the query parameters for the iTunes API request.
            params: {
                term: term,   // The search query.
                media: media, // The type of media to search (e.g., music, movie).
                limit: 25     // Limit the number of results returned to 25.
            }
        });

        // Format the raw results received from the iTunes API.
        // This maps each item to a standardized format, handling missing data with fallbacks.
        const formattedResults = itunesResponse.data.results.map(item => {
            // Use trackId or collectionId as a unique identifier.
            const id = item.trackId || item.collectionId;
            // Prioritize various names for the title, falling back to 'Untitled'.
            const title = item.trackName || item.collectionName || item.collectionCensoredName || item.artistName || 'Untitled';
            // Use artistName, falling back to 'Unknown Artist'.
            const artist = item.artistName || 'Unknown Artist';
            // Prioritize larger artwork URLs, falling back to a placeholder image.
            const artwork = item.artworkUrl100 || item.artworkUrl60 || 'https://via.placeholder.com/100';
            // Format the release date to a local string, falling back to 'Unknown Date'.
            const releaseDate = item.releaseDate ? new Date(item.releaseDate).toLocaleDateString() : 'Unknown Date';
            // Use 'kind' to describe the media type, falling back to 'Unknown Type'.
            const kind = item.kind || 'Unknown Type';

            // Return a new object with standardized keys and formatted values.
            return {
                id: id,
                title: title,
                artist: artist,
                artwork: artwork,
                releaseDate: releaseDate,
                kind: kind,
            };
        });

        // Send the formatted results back to the client as a JSON response.
        res.json(formattedResults);

    } catch (error) {
        // Catch any errors that occur during the iTunes API request or processing.
        // Log the detailed error message to the server console.
        console.error('Error fetching data from iTunes API:', error.message);
        // Send a 500 Internal Server Error response to the client with a generic message.
        res.status(500).json({ message: 'Failed to fetch data from iTunes API due to an internal error.' });
    }
});

module.exports = router;