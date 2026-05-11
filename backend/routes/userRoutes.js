/**
 * USER ROUTES
 * 
 * This file defines all the API endpoints (URLs) for user operations.
 * Each route is connected to a controller function that handles the logic.
 * 
 * Routes defined here:
 * POST   /api/users/signup  → Create new user account
 * POST   /api/users/login   → Login existing user
 * POST   /api/users/logout  → Logout user
 * GET    /api/users/me      → Get current user info (protected)
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const { signup, login, logout, getMe } = require('../controllers/userController');

// Import authentication middleware
const { requireUserAuth } = require('../middleware/authMiddleware');

/**
 * POST /api/users/signup
 * 
 * Public route — anyone can access
 * Creates a new user account
 */
router.post('/signup', signup);

/**
 * POST /api/users/login
 * 
 * Public route — anyone can access
 * Authenticates user and creates session
 */
router.post('/login', login);

/**
 * POST /api/users/logout
 * 
 * Public route — anyone can access
 * Destroys user session
 */
router.post('/logout', logout);

/**
 * GET /api/users/me
 * 
 * Protected route — requires login
 * Returns current user's information
 * requireUserAuth middleware runs first to check if user is logged in
 */
router.get('/me', requireUserAuth, getMe);

// Export router so server.js can use it
module.exports = router;
