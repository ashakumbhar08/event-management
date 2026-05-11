/**
 * EVENT ROUTES
 * 
 * This file defines all the API endpoints for event operations.
 * 
 * Routes defined here:
 * POST   /api/events              → Create event (admin only)
 * GET    /api/events              → Get all events (public)
 * GET    /api/events/stats        → Get event statistics (admin only)
 * GET    /api/events/:id          → Get single event (public)
 * PUT    /api/events/:id          → Update event (admin only)
 * DELETE /api/events/:id          → Delete event (admin only)
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventStats
} = require('../controllers/eventController');

// Import authentication middleware
const { requireAdminAuth } = require('../middleware/authMiddleware');

/**
 * GET /api/events/stats
 * 
 * Protected route — admin only
 * Returns event statistics for admin dashboard
 * MUST be defined BEFORE /:id route to avoid conflict
 */
router.get('/stats', requireAdminAuth, getEventStats);

/**
 * POST /api/events
 * 
 * Protected route — admin only
 * Creates a new event
 */
router.post('/', requireAdminAuth, createEvent);

/**
 * GET /api/events
 * 
 * Public route — anyone can view events
 * Returns all events (with optional filtering)
 */
router.get('/', getAllEvents);

/**
 * GET /api/events/:id
 * 
 * Public route — anyone can view event details
 * Returns single event by ID
 */
router.get('/:id', getEventById);

/**
 * PUT /api/events/:id
 * 
 * Protected route — admin only
 * Updates an existing event
 */
router.put('/:id', requireAdminAuth, updateEvent);

/**
 * DELETE /api/events/:id
 * 
 * Protected route — admin only
 * Deletes an event and all its registrations
 */
router.delete('/:id', requireAdminAuth, deleteEvent);

// Export router
module.exports = router;
