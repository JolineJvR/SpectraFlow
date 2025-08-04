# SpectraFlow

This is a full-stack web application that allows users to search for various media types using the official iTunes Search API. The application is built with a React front-end and a Node.js/Express back-end. It provides a clean, responsive interface for searching and managing a temporary list of favorite items.

Project Description
The purpose of this application is to demonstrate a full-stack architecture, including:

A responsive front-end built with React for a user-friendly experience.

A back-end server using Node.js and Express to handle API requests and serve the front-end.

Secure communication between the front-end and back-end using JWT for API authorization.

Asynchronous data fetching from a third-party API (iTunes Search API).

Key Features
Attractive User Interface: An intuitive and responsive design built with modern React components.

Comprehensive Search: Users can search for a specific term and filter results by media type, including:

All

Movies

Podcasts

Music

Audiobooks

Short Films

TV Shows

Software

eBooks

Dynamic Results Display: Search results are attractively displayed, showing key information like album name, artist, album cover, and release date.

Favorites List: Users can add and remove items from a favorites list. This list is session-based and is not saved to a database.

Secure API Communication: All API requests from the front-end to the back-end are secured and authorized using JSON Web Tokens (JWT).

Technologies Used
Front-end
React: The core library for building the user interface.

HTML & CSS: For structuring and styling the components.

Back-end
Node.js: The server-side JavaScript runtime environment.

Express.js: A web application framework for Node.js, used to build the server and API endpoints.

JWT (JSON Web Tokens): A standard for creating access tokens that assert a claim. Used here for securing API routes.

Getting Started
Follow these steps to set up and run the application on your local machine.

Prerequisites
Node.js and npm installed on your system.

Installation
Clone the repository:

git clone [repository-url]
cd [project-folder]

Install dependencies for the server:
Navigate into the server directory and install the required packages.

cd server
npm install

Install dependencies for the client:
Navigate into the client directory and install its dependencies.

cd ../client
npm install

Running the Application
This is a full-stack application, so you will need to start both the server and the client separately.

Start the back-end server:
Open a terminal, navigate to the server directory, and run the server.

cd server
npm start

The server will typically run on http://localhost:5000.

Start the front-end client:
Open a second terminal, navigate to the client directory, and start the React development server.

cd ../client
npm start

The client will automatically open in your web browser at http://localhost:3000. If it doesn't, you can navigate there manually.

You can now use the application to search for media and manage your favorites.
