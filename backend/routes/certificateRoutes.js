/**
 * CERTIFICATE ROUTES
 * 
 * This file defines all the API endpoints for certificate operations.
 * 
 * Routes defined here:
 * POST   /api/certificates                    → Issue single certificate (admin only)
 * POST   /api/certificates/event/:eventId     → Issue certificates for all event participants (admin only)
 * GET    /api/certificates/my                 → Get my certificates (user only)
 * GET    /api/certificates                    → Get all certificates (admin only)
 * DELETE /api/certificates/:id                → Delete certificate (admin only)
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    issueCertificate,
    issueCertificatesForEvent,
    getMyCertificates,
    getAllCertificates,
    deleteCertificate
} = require('../controllers/certificateController');

// Import authentication middleware
const { requireUserAuth, requireAdminAuth } = require('../middleware/authMiddleware');

/**
 * GET /api/certificates/my
 * 
 * Protected route — user only
 * Returns all certificates earned by the logged-in user
 * MUST be defined BEFORE /:id route to avoid conflict
 */
router.get('/my', requireUserAuth, getMyCertificates);

/**
 * POST /api/certificates/event/:eventId
 * 
 * Protected route — admin only
 * Issues certificates to all users registered for an event
 */
router.post('/event/:eventId', requireAdminAuth, issueCertificatesForEvent);

/**
 * POST /api/certificates
 * 
 * Protected route — admin only
 * Issues a single certificate to a specific user for a specific event
 */
router.post('/', requireAdminAuth, issueCertificate);

/**
 * GET /api/certificates
 * 
 * Protected route — admin only
 * Returns all issued certificates
 */
router.get('/', requireAdminAuth, getAllCertificates);

/**
 * DELETE /api/certificates/:id
 * 
 * Protected route — admin only
 * Deletes/revokes a certificate
 */
router.delete('/:id', requireAdminAuth, deleteCertificate);

// Export router
module.exports = router;
