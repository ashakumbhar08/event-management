/* ===================================
   EventHub - Login Authentication Module
   
   This file handles:
   - User login with Full Name, Email, Password
   - Remember Me functionality
   - Form validation with inline errors
   - Backend API integration with session management
   
   Used on: login.html
   For college project - beginner friendly code
   =================================== */

// ===================================
// Page Load: Check for Remembered Credentials
// Runs when the login page loads
// =================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Only run if we're on the login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loadRememberedCredentials();
        setupFieldValidation();
    }
});

// ===================================
// Load Remembered Credentials from localStorage
// Pre-fills the form if user previously checked "Remember Me"
// =================================== */
function loadRememberedCredentials() {
    // Check if Remember Me was previously enabled
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (rememberMe === 'true') {
        // Get saved credentials
        const rememberedName = localStorage.getItem('rememberedName');
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        
        // Pre-fill the form fields
        if (rememberedName) {
            document.getElementById('fullname').value = rememberedName;
        }
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
        }
        
        // Check the Remember Me checkbox
        document.getElementById('remember-me').checked = true;
    }
}

// ===================================
// Setup Field Validation
// Clears error messages when user starts typing
// =================================== */
function setupFieldValidation() {
    // Get all input fields
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Clear error when user types in Full Name field
    if (fullnameInput) {
        fullnameInput.addEventListener('input', function() {
            clearFieldError('fullname-error');
        });
    }
    
    // Clear error when user types in Email field
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            clearFieldError('email-error');
        });
    }
    
    // Clear error when user types in Password field
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            clearFieldError('password-error');
        });
    }
}

// ===================================
// Clear Field Error
// Hides the error message for a specific field
// =================================== */
function clearFieldError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// ===================================
// Show Field Error
// Displays an error message below a specific field
// =================================== */
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#EF4444';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
    }
}

// ===================================
// Validate Email Format
// Checks if email matches basic email pattern
// =================================== */
function isValidEmail(email) {
    // Simple email regex: something@something.something
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
}

// ===================================
// Handle Login Form Submission
// Validates all fields and sends credentials to backend API
// =================================== */
async function handleLogin(event) {
    // STEP 1: Prevent form from submitting normally (page reload)
    event.preventDefault();
    
    // STEP 2: Get form values
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Clear all previous errors
    clearFieldError('fullname-error');
    clearFieldError('email-error');
    clearFieldError('password-error');
    
    // STEP 3: Frontend validation
    let isValid = true;
    
    // Validate Full Name: required, not empty or whitespace
    if (fullName === '') {
        showFieldError('fullname-error', 'Please enter your full name.');
        isValid = false;
    }
    
    // Validate Email: required and valid format
    if (email === '') {
        showFieldError('email-error', 'Please enter your email address.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email-error', 'Please enter a valid email address.');
        isValid = false;
    }
    
    // Validate Password: required, not empty
    if (password === '') {
        showFieldError('password-error', 'Please enter your password.');
        isValid = false;
    }
    
    // If validation failed, stop here
    if (!isValid) {
        return;
    }
    
    // STEP 4: Disable button with loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    
    try {
        // STEP 5: Call the login API
        // Send login credentials to backend — backend checks MongoDB and creates a session
        // Method: POST - we are sending credentials
        // URL: API_BASE + "/users/login"
        // Body: JSON with email and password
        // credentials: "include" - MUST be included to send/receive session cookie
        const response = await fetch(API_BASE + '/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: 'include'  // Send session cookie with every request
        });
        
        // Parse the JSON response from the server
        const data = await response.json();
        
        // STEP 6: Handle response
        if (response.ok) {
            // Login successful!
            // Store name for display (optional - backend session is the source of truth)
            sessionStorage.setItem('userName', data.user.name);
            sessionStorage.setItem('userEmail', data.user.email);
            
            // Handle Remember Me
            if (rememberMe) {
                // Save credentials to localStorage (persists after browser close)
                localStorage.setItem('rememberedName', fullName);
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberMe', 'true');
            } else {
                // Remove saved credentials from localStorage
                localStorage.removeItem('rememberedName');
                localStorage.removeItem('rememberedEmail');
                localStorage.setItem('rememberMe', 'false');
            }
            
            // Show success message
            showToast('Login successful! Welcome ' + data.user.name, 'success');
            
            // Redirect to dashboard after 500ms
            setTimeout(function() {
                window.location.href = 'user/dashboard.html';
            }, 500);
            
        } else {
            // Login failed - show error message from backend
            showFieldError('password-error', data.message || 'Login failed. Please check your credentials.');
        }
        
    } catch (error) {
        // STEP 7: Handle network errors (catch block)
        console.error('Login error:', error);
        showFieldError('password-error', 'Could not connect to server. Please check your connection and try again.');
        
    } finally {
        // STEP 8: Re-enable submit button in finally block
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}
