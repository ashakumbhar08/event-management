/* ===================================
   EventHub - Authentication Module
   
   This file handles:
   - User login with Remember Me functionality
   - Logout functionality
   - Pre-filling login form from localStorage
   - Session management using sessionStorage
   
   For college project - beginner friendly code
   =================================== */

// ===================================
// Check for Remembered Credentials on Page Load
// This runs when the login page loads
// =================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Only run this code if we're on the login page
    const loginForm = document.getElementById('userLoginForm');
    if (loginForm) {
        loadRememberedCredentials();
    }
});

// ===================================
// Load Remembered Credentials
// Checks localStorage for saved email and name
// If found, pre-fills the login form
// =================================== */
function loadRememberedCredentials() {
    // Get saved credentials from localStorage
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedName = localStorage.getItem('rememberedName');
    
    // If we have saved credentials, fill in the form
    if (rememberedEmail && rememberedName) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('fullname').value = rememberedName;
        document.getElementById('remember-me').checked = true;
    }
}

// ===================================
// Handle User Login
// This function runs when the login form is submitted
// =================================== */
function handleUserLogin(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    
    // Get values from the form
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate that name is not empty
    if (fullName === '') {
        // Show error message below the name field
        const errorElement = document.getElementById('name-error');
        errorElement.textContent = 'Please enter your name';
        errorElement.style.display = 'block';
        return; // Stop here, don't proceed with login
    }
    
    // Handle Remember Me functionality
    if (rememberMe) {
        // Save email and name to localStorage (persists even after browser closes)
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedName', fullName);
    } else {
        // If Remember Me is not checked, remove any saved credentials
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedName');
    }
    
    // Save user data to sessionStorage (only lasts for this browser session)
    sessionStorage.setItem('userName', fullName);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userRole', 'user');
    sessionStorage.setItem('isLoggedIn', 'true');
    
    // Show success message
    showToast('Login successful! Welcome ' + fullName);
    
    // Redirect to user dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'user/dashboard.html';
    }, 1000);
}

// ===================================
// Handle Admin Login
// Similar to user login but for admin role
// =================================== */
function handleAdminLogin(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me') ? document.getElementById('remember-me').checked : false;
    
    // Validate name
    if (fullName === '') {
        const errorElement = document.getElementById('name-error');
        if (errorElement) {
            errorElement.textContent = 'Please enter your name';
            errorElement.style.display = 'block';
        }
        return;
    }
    
    // Handle Remember Me
    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedName', fullName);
    } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedName');
    }
    
    // Save to sessionStorage
    sessionStorage.setItem('userName', fullName);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userRole', 'admin');
    sessionStorage.setItem('isLoggedIn', 'true');
    
    showToast('Admin login successful!');
    
    setTimeout(() => {
        window.location.href = 'admin/dashboard.html';
    }, 1000);
}

// ===================================
// Handle Signup
// Saves user data and redirects based on role
// =================================== */
function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('role').value;
    
    // Validate role selection
    if (!role) {
        alert('Please select a role');
        return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Save to sessionStorage
    sessionStorage.setItem('userName', fullName);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('isLoggedIn', 'true');
    
    // Redirect based on role
    if (role === 'admin') {
        window.location.href = 'admin/dashboard.html';
    } else {
        window.location.href = 'user/dashboard.html';
    }
}

// ===================================
// Handle Logout
// Clears sessionStorage and redirects to home
// Note: Does NOT clear localStorage (so Remember Me data persists)
// =================================== */
function handleLogout() {
    // Clear all session data
    sessionStorage.clear();
    
    // Show logout message
    showToast('Logged out successfully');
    
    // Redirect to home page after short delay
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// ===================================
// Check if User is Logged In
// This function protects dashboard pages
// If user is not logged in, redirect to home
// =================================== */
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');
    const currentPath = window.location.pathname;
    
    // If not logged in, redirect to home page
    if (isLoggedIn !== 'true') {
        window.location.href = '../index.html';
        return false;
    }
    
    // Check if user is accessing the correct dashboard
    if (currentPath.includes('/user/') && userRole !== 'user') {
        window.location.href = '../admin/dashboard.html';
        return false;
    }
    
    if (currentPath.includes('/admin/') && userRole !== 'admin') {
        window.location.href = '../user/dashboard.html';
        return false;
    }
    
    return true;
}

// ===================================
// Display User Name
// Gets the user's name from sessionStorage
// and displays it in elements with class 'user-name'
// =================================== */
function displayUserName() {
    const userName = sessionStorage.getItem('userName') || 'User';
    const userNameElements = document.querySelectorAll('.user-name');
    
    // Update all elements that show the user's name
    userNameElements.forEach(element => {
        element.textContent = userName;
    });
}

// ===================================
// Check Login Status for Public Pages
// Returns true if user is logged in, false otherwise
// Used to show/hide content based on login status
// =================================== */
function isUserLoggedIn() {
    return sessionStorage.getItem('isLoggedIn') === 'true';
}

// ===================================
// Toast Notification
// Shows a small popup message at the bottom of the screen
// =================================== */
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
