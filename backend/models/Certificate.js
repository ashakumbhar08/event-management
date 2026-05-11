/**
 * CERTIFICATE MODEL
 * 
 * This file defines what a "Certificate" looks like in our database.
 * A Certificate is issued to a user after they complete an event.
 * 
 * Certificates are proof of participation/completion.
 */

const mongoose = require('mongoose');

/**
 * Certificate Schema
 * 
 * Records which users earned certificates for which events
 */
const certificateSchema = new mongoose.Schema({
    // userId: Links to the User who earned this certificate
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // eventId: Links to the Event this certificate is for
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    
    // userName: User's name printed on the certificate
    userName: {
        type: String,
        required: true
    },
    
    // eventTitle: Event name printed on the certificate
    eventTitle: {
        type: String,
        required: true
    },
    
    // completedDate: The date the event was completed
    // This is the date that appears on the certificate
    completedDate: {
        type: Date,
        required: true
    },
    
    // issuedAt: When the certificate was generated in the system
    issuedAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Compound Index
 * 
 * Ensures a user gets only one certificate per event
 * Cannot issue duplicate certificates for the same user and event
 */
certificateSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// Export the Certificate model — creates "certificates" collection in MongoDB
module.exports = mongoose.model('Certificate', certificateSchema);
