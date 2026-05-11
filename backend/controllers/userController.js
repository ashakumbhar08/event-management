/**
 * USER CONTROLLER
 * 
 * This file contains all the logic for user-related operations:
 * - Signup (create new user account)
 * - Login (authenticate existing user)
 * - Logout (end user session)
 * - Get current user info
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * SIGNUP FUNCTION
 * 
 * Creates a new user account
 * Steps:
 * 1. Get name, email, password from request body
 * 2. Validate all fields are provided
 * 3. Check if email already exists
 * 4. Hash the password (never store plain text!)
 * 5. Save new user to database
 * 6. Return success message
 */
const signup = async (req, res) => {
    try {
        // Step 1: Extract data from request body
        // req.body contains the data sent from the frontend form
        const { name, email, password } = req.body;
        
        // Step 2: Validate all fields exist
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields'
            });
        }
        
        // Step 3: Check if email already used
        // findOne() searches for a document matching the condition
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }
        
        // Step 4: Hash the password
        // bcrypt.hash() scrambles the password — 10 is the number of hashing rounds
        // The higher the number, the more secure but slower
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Step 5: Create and save new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword  // Save hashed password, not plain text
        });
        
        await newUser.save();  // Save to MongoDB
        
        // Step 6: Return success response
        return res.status(201).json({
            success: true,
            message: 'Account created successfully! You can now log in.'
        });
        
    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
};

/**
 * LOGIN FUNCTION
 * 
 * Authenticates an existing user
 * Steps:
 * 1. Get email and password from request
 * 2. Find user by email
 * 3. Compare entered password with stored hash
 * 4. If match, create session and return success
 */
const login = async (req, res) => {
    try {
        // Step 1: Extract login credentials
        const { email, password } = req.body;
        
        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        
        // Step 2: Find user by email
        const foundUser = await User.findOne({ email });
        
        if (!foundUser) {
            return res.status(400).json({
                success: false,
                message: 'No account found with this email'
            });
        }
        
        // Step 3: Compare passwords
        // bcrypt.compare() checks if entered password matches the stored hash
        const isMatch = await bcrypt.compare(password, foundUser.password);
        
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            });
        }
        
        // Step 4: Create session
        // Save user info to session — this keeps them logged in
        req.session.userId = foundUser._id;
        req.session.userName = foundUser.name;
        req.session.userEmail = foundUser.email;
        req.session.userRole = 'user';
        
        // Return success with user data
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email
            }
        });
        
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * LOGOUT FUNCTION
 * 
 * Ends the user's session
 * Clears all session data but keeps localStorage (Remember Me) intact
 */
const logout = (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error during logout'
            });
        }
        
        // Clear the session cookie
        res.clearCookie('connect.sid');
        
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    });
};

/**
 * GET CURRENT USER FUNCTION
 * 
 * Returns information about the currently logged-in user
 * Protected route — only works if user is logged in
 */
const getMe = async (req, res) => {
    try {
        // req.session.userId was set during login
        const user = await User.findById(req.session.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
        
    } catch (error) {
        console.error('Get User Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Export all functions so routes can use them
module.exports = {
    signup,
    login,
    logout,
    getMe
};
