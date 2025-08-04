// Load environment variables from a .env file into process.env.
// This should be called as early as possible in your application.
require("dotenv").config();

// Import the 'express' library to create and configure the server.
const express = require("express");
// Import the 'cors' middleware, which enables Cross-Origin Resource Sharing.
// This is crucial for allowing requests from different origins (e.g., your frontend running on a different port).
const cors = require("cors");
// Import the custom iTunes routes defined in './routes/itunes.js'.
// These routes handle specific API endpoints related to iTunes searches and token generation.
const itunesRoutes = require("./routes/itunes");
// Import the 'path' module, a core Node.js module for working with file and directory paths.
const path = require("path");

// Initialize the Express application.
const app = express();
// Define the port the server will listen on.
// It uses the PORT environment variable if available (common in deployment environments like Heroku),
// otherwise, it defaults to 5000 for local development.
const PORT = process.env.PORT || 5000;

// Middleware: Enable CORS for all routes.
// This allows requests from any origin to access your API.
app.use(cors());
// Middleware: Parse incoming JSON requests.
// This makes JSON data sent in the request body available on `req.body`.
app.use(express.json());

// Middleware: Serve static files from the 'frontend/build' directory.
// This is typically where a React, Angular, or Vue frontend's compiled assets are located.
// `path.join(__dirname, "../frontend/build")` constructs the absolute path to that directory.
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Route Middleware: Mount the itunesRoutes under the '/api/tunes' base path.
// Any requests starting with '/api/tunes' will be handled by the routes defined in itunesRoutes.
app.use("/api/tunes", itunesRoutes);

// Catch-all Route: Serve the frontend's index.html for any unhandled routes.
// This is essential for Single Page Applications (SPAs) where client-side routing is used.
// The `/.*/` regex matches any path.
// It ensures that if a user directly accesses a route like '/dashboard', the server
// sends the main HTML file, allowing the client-side router to take over.
app.get(/.*/, (req, res) => {
    // Send the index.html file from the frontend build directory.
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Start the server and listen for incoming requests on the specified port.
app.listen(PORT, () => {
    // Log a message to the console indicating that the server is running and on which port.
    console.log(`Server is running on port http://localhost:${PORT}`);
});