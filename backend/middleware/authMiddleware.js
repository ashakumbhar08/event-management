/**
 * AUTHENTICATION MIDDLEWARE
 * 
 * Middleware is code that runs BEFORE your route handler functions.
 * Think of it as a security guard that checks if someone is allowed to enter.
 * 
 * This file contains two middleware functions:
 * 1. requireUserAuth — checks if a regular user is logged in
 * 2. requireAdminAuth — checks if an admin is logged in
 * 
 * How it works:
 * - When a request comes in, middleware checks the session
 * - If session has userId/adminId, the user is logged in → allow access
 * - If session is empty, the user is NOT logged in → block access
 */

/**
 * requireUserAuth Middleware
 * 
 * Protects routes that only logged-in users should access
 * Example: viewing "My Events", registering for events, viewing certificates
 * 
 * @param {Object} req - The request object (contains session data)
 * @param {Object} res - The response object (used to send responses)
 * @param {Function} next - Call this to move to the next function
 */
const requireUserAuth = (req, res, next) => {
    // Check if session has userId (set during login)
    if (req.session && req.session.userId) {
        // User is logged in — allow them to proceed
        next();
    } else {
        // User is NOT logged in — block access
        return res.status(401).json({
            success: false,
            message: 'Please log in to access this page'
        });
    }
};

/**
 * requireAdminAuth Middleware
 * 
 * Protects routes that only logged-in admins should access
 * Example: creating events, managing events, viewing analytics
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Call this to move to the next function
 */
const requireAdminAuth = (req, res, next) => {
    // Check if session has adminId (set during admin login)
    if (req.session && req.session.adminId) {
        // Admin is logged in — allow them to proceed
        next();
    } else {
        // Admin is NOT logged in — block access
        return res.status(401).json({
            success: false,
            message: 'Admin access required. Please log in as admin.'
        });
    }
};

// Export both middleware functions so routes can use them
module.exports = {
    requireUserAuth,
    requireAdminAuth
};
