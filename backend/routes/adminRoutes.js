/**
 * ADMIN ROUTES
 * 
 * This file defines all the API endpoints for admin operations.
 * 
 * Routes defined here:
 * POST   /api/admins/signup  → Create new admin account
 * POST   /api/admins/login   → Login admin (includes demo login)
 * POST   /api/admins/logout  → Logout admin
 * GET    /api/admins/me      → Get current admin info (protected)
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const { signup, login, logout, getMe } = require('../controllers/adminController');

// Import authentication middleware
const { requireAdminAuth } = require('../middleware/authMiddleware');

/**
 * POST /api/admins/signup
 * 
 * Public route
 * Creates a new admin account
 */
router.post('/signup', signup);

/**
 * POST /api/admins/login
 * 
 * Public route
 * Authenticates admin and creates session
 * Supports both demo login and regular admin login
 */
router.post('/login', login);

/**
 * POST /api/admins/logout
 * 
 * Public route
 * Destroys admin session
 */
router.post('/logout', logout);

/**
 * GET /api/admins/me
 * 
 * Protected route — requires admin login
 * Returns current admin's information
 */
router.get('/me', requireAdminAuth, getMe);

// Export router
module.exports = router;
