/**
 * REGISTRATION CONTROLLER
 * 
 * This file handles user registrations for events:
 * - Register for an event
 * - Get user's registrations (My Events)
 * - Get all registrations for an event (admin view)
 * - Cancel registration
 * - Get registration statistics
 */

const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

/**
 * REGISTER FOR EVENT
 * 
 * User registers for an event
 * Checks if event is full and if user already registered
 */
const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.session.userId;
        
        // Validate event ID
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }
        
        // Check if event exists
        const event = await Event.findById(eventId);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Check if user already registered
        const existingRegistration = await Registration.findOne({ userId, eventId });
        
        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }
        
        // Check if event is full
        const currentRegistrations = await Registration.countDocuments({ eventId });
        
        if (currentRegistrations >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'This event is full. Registration closed.'
            });
        }
        
        // Get user details
        const user = await User.findById(userId);
        
        // Create registration
        const newRegistration = new Registration({
            userId,
            eventId,
            userName: user.name,
            userEmail: user.email,
            eventTitle: event.title
        });
        
        await newRegistration.save();
        
        return res.status(201).json({
            success: true,
            message: 'Successfully registered for event',
            registration: newRegistration
        });
        
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * GET USER'S REGISTRATIONS
 * 
 * Returns all events the logged-in user has registered for
 * Used for "My Events" page
 */
const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.session.userId;
        
        // Find all registrations for this user
        // Populate event details
        const registrations = await Registration.find({ userId })
            .populate('eventId')
            .sort({ registeredAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: registrations.length,
            registrations
        });
        
    } catch (error) {
        console.error('Get Registrations Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching registrations'
        });
    }
};

/**
 * GET REGISTRATIONS FOR AN EVENT
 * 
 * Admin view: see all users registered for a specific event
 */
const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        // Find all registrations for this event
        const registrations = await Registration.find({ eventId })
            .populate('userId', 'name email')
            .sort({ registeredAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: registrations.length,
            registrations
        });
        
    } catch (error) {
        console.error('Get Event Registrations Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching event registrations'
        });
    }
};

/**
 * CANCEL REGISTRATION
 * 
 * User cancels their registration for an event
 */
const cancelRegistration = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.session.userId;
        
        // Find and delete registration
        const registration = await Registration.findOneAndDelete({ userId, eventId });
        
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Registration cancelled successfully'
        });
        
    } catch (error) {
        console.error('Cancel Registration Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while cancelling registration'
        });
    }
};

/**
 * GET REGISTRATION STATISTICS
 * 
 * Returns statistics for admin dashboard:
 * - Total registrations
 * - Registrations by event
 * - Recent registrations
 */
const getRegistrationStats = async (req, res) => {
    try {
        // Total registrations
        const totalRegistrations = await Registration.countDocuments();
        
        // Registrations by event
        const registrationsByEvent = await Registration.aggregate([
            {
                $group: {
                    _id: '$eventTitle',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        // Recent registrations
        const recentRegistrations = await Registration.find()
            .populate('eventId', 'title')
            .sort({ registeredAt: -1 })
            .limit(10);
        
        return res.status(200).json({
            success: true,
            stats: {
                total: totalRegistrations,
                byEvent: registrationsByEvent,
                recent: recentRegistrations
            }
        });
        
    } catch (error) {
        console.error('Get Registration Stats Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
};

// Export all functions
module.exports = {
    registerForEvent,
    getMyRegistrations,
    getEventRegistrations,
    cancelRegistration,
    getRegistrationStats
};
