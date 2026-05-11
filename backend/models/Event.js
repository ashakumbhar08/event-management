/**
 * EVENT MODEL
 * 
 * This file defines what an "Event" looks like in our database.
 * An Event is created by an admin and can be browsed/registered by users.
 * 
 * Examples: Tech Fest 2024, Cultural Night, Sports Day, Workshop on AI
 */

const mongoose = require('mongoose');

/**
 * Event Schema
 * 
 * Defines all the information we store about each event
 */
const eventSchema = new mongoose.Schema({
    // title: The name of the event (e.g., "Tech Fest 2024")
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    // category: Type of event — helps with filtering and organization
    // Valid values: "Tech", "Cultural", "Sports", "Workshop", "Other"
    category: {
        type: String,
        required: true,
        enum: ['Tech', 'Cultural', 'Sports', 'Workshop', 'Other']  // Only these values allowed
    },
    
    // date: When the event takes place
    date: {
        type: Date,
        required: true
    },
    
    // time: Stored as a readable string (e.g., "10:00 AM", "2:30 PM")
    time: {
        type: String,
        required: true
    },
    
    // location: Where the event is held (e.g., "College Auditorium", "Sports Ground")
    location: {
        type: String,
        required: true,
        trim: true
    },
    
    // description: Full details about the event — what it's about, who can attend, etc.
    description: {
        type: String,
        required: true
    },
    
    // maxParticipants: Maximum number of people who can register
    maxParticipants: {
        type: Number,
        default: 100            // Default limit is 100 if not specified
    },
    
    // status: Current state of the event
    // "Upcoming" = hasn't happened yet
    // "Active" = happening right now
    // "Completed" = already finished
    status: {
        type: String,
        default: 'Upcoming',
        enum: ['Upcoming', 'Active', 'Completed']
    },
    
    // createdBy: Name of the admin who created this event
    createdBy: {
        type: String,
        default: 'Admin'
    },
    
    // createdAt: When this event was created in the system
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Event model — creates "events" collection in MongoDB
module.exports = mongoose.model('Event', eventSchema);
