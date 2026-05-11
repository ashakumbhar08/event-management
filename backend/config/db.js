/**
 * DATABASE CONNECTION FILE
 * 
 * This file is responsible for connecting our Node.js application to MongoDB.
 * It uses Mongoose, which is a tool that makes working with MongoDB easier.
 * 
 * What happens here:
 * 1. We import mongoose (the MongoDB connector)
 * 2. We create a function called connectDB
 * 3. Inside that function, we tell mongoose to connect to our database
 * 4. If connection succeeds, we log a success message
 * 5. If connection fails, we log the error and stop the server
 */

// Import mongoose — this is the tool that connects Node.js to MongoDB
const mongoose = require('mongoose');

/**
 * connectDB Function
 * 
 * This function connects to MongoDB using the connection string from .env file
 * It's an async function because connecting to a database takes time
 */
const connectDB = async () => {
    try {
        // Try to connect to MongoDB using the MONGO_URI from our .env file
        // process.env.MONGO_URI reads the value we set in .env
        await mongoose.connect(process.env.MONGO_URI);
        
        // If connection works, print success message to console
        console.log('✅ MongoDB Connected Successfully');
        console.log(`📦 Database: ${mongoose.connection.name}`);
        
    } catch (error) {
        // If connection fails, print the error message
        console.error('❌ MongoDB Connection Failed:', error.message);
        
        // Exit the application with error code 1 (means something went wrong)
        // We can't run the server without a database connection
        process.exit(1);
    }
};

// Export the connectDB function so server.js can use it
module.exports = connectDB;
