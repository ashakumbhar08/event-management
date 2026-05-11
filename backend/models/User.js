/**
 * USER MODEL
 * 
 * This file defines what a "User" looks like in our database.
 * A User is someone who signs up to browse and register for events.
 * 
 * Think of this as a blueprint or template for user data.
 * Every user document in MongoDB will follow this structure.
 */

// Import mongoose to create the model
const mongoose = require('mongoose');

/**
 * User Schema
 * 
 * A schema defines the structure of documents in a MongoDB collection.
 * It's like creating a form that says "every user must have these fields".
 */
const userSchema = new mongoose.Schema({
    // name: The user's full name entered during signup
    name: {
        type: String,           // This field stores text
        required: true,         // This field is mandatory — cannot be empty
        trim: true              // Remove extra spaces from beginning and end
    },
    
    // email: Used for login — must be unique (no two users can have same email)
    email: {
        type: String,
        required: true,
        unique: true,           // MongoDB ensures no duplicate emails
        lowercase: true,        // Convert to lowercase before saving
        trim: true
    },
    
    // password: Stored as a hashed string — NEVER store plain text passwords
    password: {
        type: String,
        required: true
    },
    
    // createdAt: Automatically records when the account was created
    createdAt: {
        type: Date,
        default: Date.now       // If not provided, use current date/time
    }
});

/**
 * Create and export the User model
 * 
 * mongoose.model() creates a model from the schema
 * First argument "User" becomes collection name "users" in MongoDB
 * (Mongoose automatically makes it lowercase and plural)
 */
module.exports = mongoose.model('User', userSchema);
