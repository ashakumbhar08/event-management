/* ===================================
   EventHub - Signup Module
   
   This file handles user signup with backend API integration.
   Sends signup data to MongoDB via the backend API.
   
   Used on: signup.html
   For college project - beginner friendly code
   =================================== */

// ===================================
// Handle Signup Form Submission
// Validates all fields and sends data to backend API
// =================================== */
async function handleSignup(event) {
    // Prevent the page from reloading when form is submitted
    event.preventDefault();
    
    // Get form values and trim whitespace
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('role').value;
    
    // Create or get message container for displaying errors/success
    let messageContainer = document.getElementById('signup-message');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'signup-message';
        messageContainer.style.textAlign = 'center';
        messageContainer.style.marginTop = '15px';
        document.getElementById('signupForm').appendChild(messageContainer);
    }
    
    // Clear any previous messages
    hideMessage('signup-message');
    
    // ===================================
    // STEP 3: Basic frontend validation (before calling API)
    // ===================================
    
    // Validate Full Name: must not be empty
    if (fullName === '') {
        showMessage('signup-message', 'Please enter your full name', 'error');
        return;
    }
    
    // Validate Email: must not be empty and must contain "@"
    if (email === '' || !email.includes('@')) {
        showMessage('signup-message', 'Please enter a valid email address', 'error');
        return;
    }
    
    // Validate Password: must be at least 6 characters
    if (password.length < 6) {
        showMessage('signup-message', 'Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Validate Confirm Password: must match password
    if (password !== confirmPassword) {
        showMessage('signup-message', 'Passwords do not match', 'error');
        return;
    }
    
    // Validate Role: must be selected
    if (role === '') {
        showMessage('signup-message', 'Please select your role (User or Admin)', 'error');
        return;
    }
    
    // ===================================
    // STEP 4: Show loading state
    // Disable button to prevent double submission while API call is running
    // ===================================
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Creating account...';
    
    try {
        // ===================================
        // STEP 5: Call the signup API
        // Send signup data to backend — backend will validate and save to MongoDB
        // Method: POST - we are creating new data
        // URL: API_BASE + "/users/signup" or "/admins/signup" depending on role
        // Body: JSON with name, email, password
        // ===================================
        
        // Determine which API endpoint to use based on role
        const apiEndpoint = role === 'admin' ? '/admins/signup' : '/users/signup';
        
        const response = await fetch(API_BASE + apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // Tell server we are sending JSON
            },
            body: JSON.stringify({
                name: fullName,
                email: email,
                password: password
            }),
            credentials: 'include'  // Send session cookie with every request
        });
        
        // Parse the JSON response from the server
        const data = await response.json();
        
        // ===================================
        // STEP 6: Handle the response
        // ===================================
        
        if (response.ok) {
            // Success! Account created
            showMessage('signup-message', 'Account created successfully! Redirecting to login...', 'success');
            
            // Redirect to appropriate login page after 1.5 seconds
            setTimeout(() => {
                if (role === 'admin') {
                    window.location.href = 'admin-login.html';
                } else {
                    window.location.href = 'login.html';
                }
            }, 1500);
        } else {
            // Error from backend (e.g., email already exists)
            showMessage('signup-message', data.message || 'Signup failed. Please try again.', 'error');
        }
        
    } catch (error) {
        // ===================================
        // STEP 7: Handle network errors (catch block)
        // This runs if the server is offline or network fails
        // ===================================
        console.error('Signup error:', error);
        showMessage('signup-message', 'Could not connect to server. Please check your connection and try again.', 'error');
        
    } finally {
        // ===================================
        // STEP 8: Re-enable the submit button in all cases
        // This runs whether the request succeeded or failed
        // ===================================
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}
