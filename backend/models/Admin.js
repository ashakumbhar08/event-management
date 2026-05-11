/**
 * ADMIN MODEL
 * 
 * This file defines what an "Admin" looks like in our database.
 * An Admin is someone who can create, edit, and manage events.
 * Admins have more privileges than regular users.
 */

const mongoose = require('mongoose');

/**
 * Admin Schema
 * 
 * Similar to User schema but with an additional "isDemo" field
 * to identify the hardcoded demo admin account
 */
const adminSchema = new mongoose.Schema({
    // name: The admin's full name
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    // email: Used for admin login — must be unique
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    
    // password: Stored as a hashed string for security
    password: {
        type: String,
        required: true
    },
    
    // isDemo: True only for the hardcoded demo admin (admin/admin123)
    // This helps us identify the demo account vs real admin accounts
    isDemo: {
        type: Boolean,
        default: false          // By default, new admins are not demo accounts
    },
    
    // createdAt: When this admin account was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Admin model — creates "admins" collection in MongoDB
module.exports = mongoose.model('Admin', adminSchema);
