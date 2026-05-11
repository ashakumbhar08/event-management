/**
 * REGISTRATION MODEL
 * 
 * This file defines what a "Registration" looks like in our database.
 * A Registration is created when a user signs up for an event.
 * 
 * It links a User to an Event and records when they registered.
 */

const mongoose = require('mongoose');

/**
 * Registration Schema
 * 
 * This creates a relationship between Users and Events
 * It answers the question: "Which users registered for which events?"
 */
const registrationSchema = new mongoose.Schema({
    // userId: Links to the User who registered
    // ObjectId is MongoDB's way of creating unique IDs for documents
    // ref: "User" means this ID points to a document in the Users collection
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',            // Reference to User model
        required: true
    },
    
    // eventId: Links to the Event the user registered for
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',           // Reference to Event model
        required: true
    },
    
    // userName: Stored separately for easy display
    // We could look it up from userId, but storing it here makes queries faster
    userName: {
        type: String,
        required: true
    },
    
    // userEmail: Also stored separately for convenience
    userEmail: {
        type: String,
        required: true
    },
    
    // eventTitle: Event name stored here
    // Even if the event is deleted later, we still know what event this was
    eventTitle: {
        type: String,
        required: true
    },
    
    // registeredAt: When the user registered for this event
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Compound Index
 * 
 * This ensures a user cannot register for the same event twice
 * MongoDB will reject any attempt to create duplicate userId + eventId combinations
 */
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// Export the Registration model — creates "registrations" collection in MongoDB
module.exports = mongoose.model('Registration', registrationSchema);
