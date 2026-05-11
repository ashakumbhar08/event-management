/**
 * EVENT CONTROLLER
 * 
 * This file contains all the logic for event-related operations:
 * - Create event (admin only)
 * - Get all events (public — anyone can view)
 * - Get single event by ID
 * - Update event (admin only)
 * - Delete event (admin only)
 * - Get event statistics (for admin dashboard)
 */

const Event = require('../models/Event');
const Registration = require('../models/Registration');

/**
 * CREATE EVENT
 * 
 * Admin creates a new event
 * All event details come from the create event form
 */
const createEvent = async (req, res) => {
    try {
        const { title, category, date, time, location, description, maxParticipants } = req.body;
        
        // Validate required fields
        if (!title || !category || !date || !time || !location || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }
        
        // Create new event
        const newEvent = new Event({
            title,
            category,
            date,
            time,
            location,
            description,
            maxParticipants: maxParticipants || 100,
            createdBy: req.session.adminName || 'Admin'
        });
        
        await newEvent.save();
        
        return res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: newEvent
        });
        
    } catch (error) {
        console.error('Create Event Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating event'
        });
    }
};

/**
 * GET ALL EVENTS
 * 
 * Returns all events from the database
 * Public route — anyone can view events
 * Can be filtered by category, status, or search term
 */
const getAllEvents = async (req, res) => {
    try {
        // Get query parameters for filtering
        const { category, status, search } = req.query;
        
        // Build filter object
        let filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (status) {
            filter.status = status;
        }
        
        if (search) {
            // Search in title, description, or location
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Get events sorted by date (newest first)
        const events = await Event.find(filter).sort({ date: -1 });
        
        return res.status(200).json({
            success: true,
            count: events.length,
            events
        });
        
    } catch (error) {
        console.error('Get Events Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching events'
        });
    }
};

/**
 * GET SINGLE EVENT
 * 
 * Returns details of one specific event
 * Also includes registration count
 */
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find event by ID
        const event = await Event.findById(id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Count how many users registered for this event
        const registrationCount = await Registration.countDocuments({ eventId: id });
        
        return res.status(200).json({
            success: true,
            event,
            registrationCount
        });
        
    } catch (error) {
        console.error('Get Event Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching event'
        });
    }
};

/**
 * UPDATE EVENT
 * 
 * Admin updates an existing event
 * Can update any field except createdAt
 */
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Find and update event
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }  // Return updated doc, run validation
        );
        
        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });
        
    } catch (error) {
        console.error('Update Event Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating event'
        });
    }
};

/**
 * DELETE EVENT
 * 
 * Admin deletes an event
 * Also deletes all registrations for this event
 */
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete the event
        const deletedEvent = await Event.findByIdAndDelete(id);
        
        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Delete all registrations for this event
        await Registration.deleteMany({ eventId: id });
        
        return res.status(200).json({
            success: true,
            message: 'Event and all related registrations deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete Event Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting event'
        });
    }
};

/**
 * GET EVENT STATISTICS
 * 
 * Returns statistics for admin dashboard:
 * - Total events
 * - Events by status
 * - Events by category
 * - Recent events
 */
const getEventStats = async (req, res) => {
    try {
        // Total events
        const totalEvents = await Event.countDocuments();
        
        // Events by status
        const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
        const activeEvents = await Event.countDocuments({ status: 'Active' });
        const completedEvents = await Event.countDocuments({ status: 'Completed' });
        
        // Events by category
        const eventsByCategory = await Event.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        // Recent events (last 5)
        const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5);
        
        return res.status(200).json({
            success: true,
            stats: {
                total: totalEvents,
                upcoming: upcomingEvents,
                active: activeEvents,
                completed: completedEvents,
                byCategory: eventsByCategory,
                recent: recentEvents
            }
        });
        
    } catch (error) {
        console.error('Get Stats Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
};

// Export all functions
module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventStats
};
