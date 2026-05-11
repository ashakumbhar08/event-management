/**
 * EVENTHUB BACKEND SERVER
 * 
 * This is the main entry point for the EventHub backend application.
 * Everything starts here when you run "npm run dev" or "npm start".
 * 
 * What this file does:
 * 1. Loads environment variables from .env file
 * 2. Connects to MongoDB database
 * 3. Sets up Express server with middleware
 * 4. Registers all API routes
 * 5. Serves the frontend files
 * 6. Starts listening for requests on port 5000
 */

// STEP 1: Load environment variables
// This MUST be the very first thing — it loads values from .env file
require('dotenv').config();

// STEP 2: Import required packages
const express = require('express');           // Web framework for building APIs
const mongoose = require('mongoose');         // MongoDB connection tool
const session = require('express-session');   // Session management for login
const cors = require('cors');                 // Allows frontend to call backend
const path = require('path');                 // Helps with file paths

// STEP 3: Import database connection function
const connectDB = require('./config/db');

// STEP 4: Import route files
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

// STEP 5: Import admin controller to initialize demo admin
const { initializeDemoAdmin } = require('./controllers/adminController');

// STEP 6: Create Express application
const app = express();

// STEP 7: Connect to MongoDB
// This function is defined in config/db.js
connectDB();

// STEP 8: Configure middleware
// Middleware runs before every request — it processes the request before it reaches our routes

// CORS — allows frontend (running on different port) to call our API
app.use(cors({
    origin: 'http://localhost:5001',  // Allow requests from our frontend
    credentials: true                  // Allow cookies to be sent
}));

// Parse JSON data from request body
// This lets us read data sent from frontend forms as req.body
app.use(express.json());

// Parse URL-encoded data (HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// Session middleware — keeps track of who is logged in
app.use(session({
    secret: process.env.SESSION_SECRET,     // Secret key to sign session cookie
    resave: false,                          // Don't save session if nothing changed
    saveUninitialized: false,               // Don't create session until user logs in
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,        // Session lasts 24 hours (in milliseconds)
        httpOnly: true,                      // Cookie cannot be accessed by JavaScript
        secure: false                        // Set to true in production with HTTPS
    }
}));

// STEP 9: Serve static frontend files
// This makes our HTML, CSS, and JS files accessible
// When someone visits http://localhost:5000, they see index.html
app.use(express.static(path.join(__dirname, '../frontend')));

// STEP 10: Register API routes
// All routes starting with /api/ are handled by our backend
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/certificates', certificateRoutes);

// STEP 11: Initialize demo admin account
// This creates the hardcoded admin/admin123 account if it doesn't exist
mongoose.connection.once('open', async () => {
    console.log('🔄 Initializing demo admin account...');
    await initializeDemoAdmin();
});

// STEP 12: Start the server
// Get port from .env file (default 5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(60));
    console.log('🚀 EventHub Backend Server is Running!');
    console.log('='.repeat(60));
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API Base: http://localhost:${PORT}/api`);
    console.log('='.repeat(60));
    console.log('');
    console.log('📋 Available API Endpoints:');
    console.log('   Users:         /api/users');
    console.log('   Admins:        /api/admins');
    console.log('   Events:        /api/events');
    console.log('   Registrations: /api/registrations');
    console.log('   Certificates:  /api/certificates');
    console.log('');
    console.log('🔐 Demo Admin Credentials:');
    console.log('   Email:    admin@eventhub.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('💡 Press Ctrl+C to stop the server');
    console.log('='.repeat(60));
});

/**
 * EXPLANATION FOR VIVA:
 * 
 * Q: What is Express.js?
 * A: Express is a web framework for Node.js that makes it easy to create web servers
 *    and APIs. It handles routing, middleware, and HTTP requests/responses.
 * 
 * Q: What is middleware?
 * A: Middleware is code that runs between receiving a request and sending a response.
 *    Examples: parsing JSON, checking if user is logged in, logging requests.
 * 
 * Q: What is a session?
 * A: A session keeps track of a user's login state across multiple requests.
 *    When a user logs in, we save their ID in the session. On future requests,
 *    we check the session to see if they're still logged in.
 * 
 * Q: Why do we hash passwords?
 * A: Hashing converts passwords into scrambled strings that cannot be reversed.
 *    Even if someone steals our database, they cannot read the actual passwords.
 *    We use bcrypt which is specifically designed for password hashing.
 * 
 * Q: What is MongoDB?
 * A: MongoDB is a NoSQL database that stores data in JSON-like documents.
 *    Unlike SQL databases with tables and rows, MongoDB uses collections and documents.
 *    It's flexible and works well with JavaScript/Node.js.
 * 
 * Q: What is Mongoose?
 * A: Mongoose is a library that makes working with MongoDB easier in Node.js.
 *    It provides schemas (structure), models (blueprints), and validation.
 */
