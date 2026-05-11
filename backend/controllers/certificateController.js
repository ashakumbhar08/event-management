/**
 * CERTIFICATE CONTROLLER
 * 
 * This file handles certificate operations:
 * - Issue certificate (when event is completed)
 * - Get user's certificates
 * - Get all certificates (admin view)
 * - Delete certificate
 */

const Certificate = require('../models/Certificate');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

/**
 * ISSUE CERTIFICATE
 * 
 * Creates a certificate for a user who completed an event
 * Can be triggered by admin or automatically when event status changes to "Completed"
 */
const issueCertificate = async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        
        // Validate required fields
        if (!userId || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Event ID are required'
            });
        }
        
        // Check if certificate already issued
        const existingCertificate = await Certificate.findOne({ userId, eventId });
        
        if (existingCertificate) {
            return res.status(400).json({
                success: false,
                message: 'Certificate already issued for this user and event'
            });
        }
        
        // Check if user was registered for this event
        const registration = await Registration.findOne({ userId, eventId });
        
        if (!registration) {
            return res.status(400).json({
                success: false,
                message: 'User was not registered for this event'
            });
        }
        
        // Get event and user details
        const event = await Event.findById(eventId);
        const user = await User.findById(userId);
        
        if (!event || !user) {
            return res.status(404).json({
                success: false,
                message: 'Event or User not found'
            });
        }
        
        // Create certificate
        const newCertificate = new Certificate({
            userId,
            eventId,
            userName: user.name,
            eventTitle: event.title,
            completedDate: event.date  // Use event date as completion date
        });
        
        await newCertificate.save();
        
        return res.status(201).json({
            success: true,
            message: 'Certificate issued successfully',
            certificate: newCertificate
        });
        
    } catch (error) {
        console.error('Issue Certificate Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while issuing certificate'
        });
    }
};

/**
 * ISSUE CERTIFICATES FOR COMPLETED EVENT
 * 
 * Issues certificates to all registered users when an event is marked as completed
 * This is called by admin after an event finishes
 */
const issueCertificatesForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        // Get event
        const event = await Event.findById(eventId);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Get all registrations for this event
        const registrations = await Registration.find({ eventId });
        
        if (registrations.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No registrations found for this event'
            });
        }
        
        // Issue certificate to each registered user
        let issuedCount = 0;
        let alreadyIssuedCount = 0;
        
        for (const registration of registrations) {
            // Check if certificate already exists
            const existingCert = await Certificate.findOne({
                userId: registration.userId,
                eventId: eventId
            });
            
            if (!existingCert) {
                // Create new certificate
                const newCertificate = new Certificate({
                    userId: registration.userId,
                    eventId: eventId,
                    userName: registration.userName,
                    eventTitle: registration.eventTitle,
                    completedDate: event.date
                });
                
                await newCertificate.save();
                issuedCount++;
            } else {
                alreadyIssuedCount++;
            }
        }
        
        return res.status(200).json({
            success: true,
            message: `Certificates processed: ${issuedCount} issued, ${alreadyIssuedCount} already existed`,
            issued: issuedCount,
            alreadyIssued: alreadyIssuedCount
        });
        
    } catch (error) {
        console.error('Issue Certificates Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while issuing certificates'
        });
    }
};

/**
 * GET USER'S CERTIFICATES
 * 
 * Returns all certificates earned by the logged-in user
 * Used for "Certificates" page
 */
const getMyCertificates = async (req, res) => {
    try {
        const userId = req.session.userId;
        
        // Find all certificates for this user
        const certificates = await Certificate.find({ userId })
            .populate('eventId')
            .sort({ issuedAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: certificates.length,
            certificates
        });
        
    } catch (error) {
        console.error('Get Certificates Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching certificates'
        });
    }
};

/**
 * GET ALL CERTIFICATES
 * 
 * Admin view: see all issued certificates
 */
const getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find()
            .populate('userId', 'name email')
            .populate('eventId', 'title category')
            .sort({ issuedAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: certificates.length,
            certificates
        });
        
    } catch (error) {
        console.error('Get All Certificates Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching certificates'
        });
    }
};

/**
 * DELETE CERTIFICATE
 * 
 * Admin can revoke/delete a certificate
 */
const deleteCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedCertificate = await Certificate.findByIdAndDelete(id);
        
        if (!deletedCertificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Certificate deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete Certificate Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting certificate'
        });
    }
};

// Export all functions
module.exports = {
    issueCertificate,
    issueCertificatesForEvent,
    getMyCertificates,
    getAllCertificates,
    deleteCertificate
};
