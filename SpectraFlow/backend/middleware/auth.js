// Import the 'jsonwebtoken' library, which is used for creating, signing, and verifying JWTs.
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Attempt to retrieve the token from the 'x-access-token' header of the incoming request.
    const token = req.header('x-access-token');

    // --- Debugging logs ---
    // These lines were likely used during development to inspect the token's presence and type.
    // console.log('DEBUG (Backend): --- Incoming Token Check ---');
    // console.log('DEBUG (Backend): Raw x-access-token header value:', token);
    // console.log('DEBUG (Backend): Type of token variable:', typeof token);
    // console.log('DEBUG (Backend): Is token strictly null or undefined?', token === null || typeof token === 'undefined');
    // console.log('DEBUG (Backend): Is token an empty string?', token === '');
    // console.log('DEBUG (Backend): --- End Token Check ---');

    // Check if no token was provided or if the token string is empty.
    if (!token) {
        // Log a warning message to the console.
        console.warn('DEBUG (Backend): No token or empty token provided in x-access-token header. Returning 401.');
        // If no token is found, return a 401 Unauthorized status with an error message.
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try {
        // Log the attempt to verify the token, including the secret being used (from environment variables).
        console.log('DEBUG (Backend): Attempting JWT verification with secret:', process.env.JWT_SECRET);

        // Attempt to verify the token using the secret key stored in environment variables (process.env.JWT_SECRET).
        // If verification is successful, 'decoded' will contain the payload from the JWT.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the request object.
        // This makes the user's information available to subsequent middleware or route handlers.
        req.user = decoded;

        // Log a success message.
        console.log('DEBUG (Backend): Token successfully verified. Proceeding to next middleware/route.');

        // Call the 'next' function to pass control to the next middleware in the stack
        // or the final route handler.
        next();
    } catch (e) {
        // If token verification fails (e.g., invalid signature, expired token), catch the error.
        // Log the error message to the console.
        console.error('ERROR (Backend): Token verification failed due to:', e.message);

        // Send a 403 Forbidden status with an error message indicating the token is invalid or expired.
        res.status(403).json({ message: 'Token is not valid or expired.' });
    }
};

module.exports = verifyToken;