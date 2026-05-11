/**
 * ADMIN CONTROLLER
 * 
 * This file contains all the logic for admin-related operations:
 * - Signup (create new admin account)
 * - Login (authenticate admin — includes demo login)
 * - Logout (end admin session)
 * - Get current admin info
 * - Initialize demo admin (creates the hardcoded admin/admin123 account)
 */

const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

/**
 * INITIALIZE DEMO ADMIN
 * 
 * Creates the hardcoded demo admin account if it doesn't exist
 * Credentials: admin / admin123
 * This runs when the server starts
 */
const initializeDemoAdmin = async () => {
    try {
        // Check if demo admin already exists
        const demoAdmin = await Admin.findOne({ email: 'admin@eventhub.com', isDemo: true });
        
        if (!demoAdmin) {
            // Create demo admin
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            const newDemoAdmin = new Admin({
                name: 'Admin',
                email: 'admin@eventhub.com',
                password: hashedPassword,
                isDemo: true
            });
            
            await newDemoAdmin.save();
            console.log('✅ Demo admin account created (admin@eventhub.com / admin123)');
        } else {
            console.log('✅ Demo admin account already exists');
        }
    } catch (error) {
        console.error('Error initializing demo admin:', error);
    }
};

/**
 * ADMIN SIGNUP FUNCTION
 * 
 * Creates a new admin account (not demo)
 * Similar to user signup but creates an Admin document
 */
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate all fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields'
            });
        }
        
        // Check if email already used
        const existingAdmin = await Admin.findOne({ email });
        
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'An admin account with this email already exists'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new admin (isDemo = false by default)
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            isDemo: false
        });
        
        await newAdmin.save();
        
        return res.status(201).json({
            success: true,
            message: 'Admin account created successfully! You can now log in.'
        });
        
    } catch (error) {
        console.error('Admin Signup Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during admin signup'
        });
    }
};

/**
 * ADMIN LOGIN FUNCTION
 * 
 * Authenticates an admin
 * Supports both:
 * 1. Demo login (admin / admin123)
 * 2. Regular admin login with created accounts
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        
        // Find admin by email
        const foundAdmin = await Admin.findOne({ email });
        
        if (!foundAdmin) {
            return res.status(400).json({
                success: false,
                message: 'No admin account found with this email'
            });
        }
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, foundAdmin.password);
        
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            });
        }
        
        // Create admin session
        req.session.adminId = foundAdmin._id;
        req.session.adminName = foundAdmin.name;
        req.session.adminEmail = foundAdmin.email;
        req.session.userRole = 'admin';
        req.session.isDemo = foundAdmin.isDemo;
        
        return res.status(200).json({
            success: true,
            message: 'Admin login successful',
            admin: {
                id: foundAdmin._id,
                name: foundAdmin.name,
                email: foundAdmin.email,
                isDemo: foundAdmin.isDemo
            }
        });
        
    } catch (error) {
        console.error('Admin Login Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during admin login'
        });
    }
};

/**
 * ADMIN LOGOUT FUNCTION
 * 
 * Ends the admin's session
 */
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error during logout'
            });
        }
        
        res.clearCookie('connect.sid');
        
        return res.status(200).json({
            success: true,
            message: 'Admin logged out successfully'
        });
    });
};

/**
 * GET CURRENT ADMIN FUNCTION
 * 
 * Returns information about the currently logged-in admin
 */
const getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId).select('-password');
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                isDemo: admin.isDemo,
                createdAt: admin.createdAt
            }
        });
        
    } catch (error) {
        console.error('Get Admin Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Export all functions
module.exports = {
    initializeDemoAdmin,
    signup,
    login,
    logout,
    getMe
};
