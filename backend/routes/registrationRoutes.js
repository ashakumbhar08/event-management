/**
 * REGISTRATION ROUTES
 * 
 * This file defines all the API endpoints for registration operations.
 * 
 * Routes defined here:
 * POST   /api/registrations              → Register for event (user only)
 * GET    /api/registrations/my           → Get my registrations (user only)
 * GET    /api/registrations/stats        → Get registration stats (admin only)
 * GET    /api/registrations/event/:eventId → Get registrations for event (admin only)
 * DELETE /api/registrations/:eventId     → Cancel registration (user only)
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    registerForEvent,
    getMyRegistrations,
    getEventRegistrations,
    cancelRegistration,
    getRegistrationStats
} = require('../controllers/registrationController');

// Import authentication middleware
const { requireUserAuth, requireAdminAuth } = require('../middleware/authMiddleware');

/**
 * GET /api/registrations/my
 * 
 * Protected route — user only
 * Returns all events the logged-in user has registered for
 * MUST be defined BEFORE /:eventId route to avoid conflict
 */
router.get('/my', requireUserAuth, getMyRegistrations);

/**
 * GET /api/registrations/stats
 * 
 * Protected route — admin only
 * Returns registration statistics for admin dashboard
 */
router.get('/stats', requireAdminAuth, getRegistrationStats);

/**
 * POST /api/registrations
 * 
 * Protected route — user only
 * Registers the logged-in user for an event
 */
router.post('/', requireUserAuth, registerForEvent);

/**
 * GET /api/registrations/event/:eventId
 * 
 * Protected route — admin only
 * Returns all users registered for a specific event
 */
router.get('/event/:eventId', requireAdminAuth, getEventRegistrations);

/**
 * DELETE /api/registrations/:eventId
 * 
 * Protected route — user only
 * Cancels user's registration for an event
 */
router.delete('/:eventId', requireUserAuth, cancelRegistration);

// Export router
module.exports = router;
