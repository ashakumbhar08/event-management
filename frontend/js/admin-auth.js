/* ===================================
   EventHub - Admin Authentication Module
   
   This file handles:
   - Admin login with backend API integration
   - Support for demo credentials (admin/admin123)
   - Admin logout functionality
   - Session guard for admin pages
   
   Used on: admin-login.html and all admin pages
   For college project - beginner friendly code
   =================================== */

// ===================================
// Handle Admin Login
// Validates credentials and sends to backend API
// =================================== */
async function handleAdminLogin(event) {
    // STEP 1: Prevent form from submitting normally (page reload)
    event.preventDefault();
    
    // STEP 2: Get form values
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;
    
    // Hide any previous error messages
    const errorBox = document.getElementById('login-error');
    if (errorBox) {
        errorBox.style.display = 'none';
    }
    
    // Clear field errors
    clearFieldError('username-error');
    clearFieldError('password-error');
    
    // STEP 3: Frontend validation
    let isValid = true;
    
    if (username === '') {
        showFieldError('username-error', 'Please enter admin username');
        isValid = false;
    }
    
    if (password === '') {
        showFieldError('password-error', 'Please enter admin password');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // STEP 4: Disable button with loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    try {
        // STEP 5: Call the admin login API
        // Send admin credentials to backend — backend checks MongoDB and creates a session
        // Method: POST - we are sending credentials
        // URL: API_BASE + "/admins/login"
        // Body: JSON with email (username) and password
        // credentials: "include" - MUST be included to send/receive session cookie
        
        // For admin, username is typically the email
        // Demo admin email is admin@eventhub.com
        const email = username.includes('@') ? username : 'admin@eventhub.com';
        
        const response = await fetch(API_BASE + '/admins/login', {
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
            // Store admin name for display (optional - backend session is the source of truth)
            sessionStorage.setItem('adminName', data.admin.name);
            sessionStorage.setItem('adminEmail', data.admin.email);
            sessionStorage.setItem('isDemo', data.admin.isDemo);
            
            // Show success message
            showAdminToast('Login successful! Welcome ' + data.admin.name, 'success');
            
            // Redirect to admin dashboard after 500ms
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 500);
            
        } else {
            // Login failed - show error message from backend
            if (errorBox) {
                errorBox.querySelector('span').textContent = data.message || 'Invalid admin credentials. Please try again.';
                errorBox.style.display = 'flex';
            }
            
            // Clear password field for security
            document.getElementById('admin-password').value = '';
        }
        
    } catch (error) {
        // STEP 7: Handle network errors (catch block)
        console.error('Admin login error:', error);
        
        if (errorBox) {
            errorBox.querySelector('span').textContent = 'Could not connect to server. Please check your connection and try again.';
            errorBox.style.display = 'flex';
        }
        
    } finally {
        // STEP 8: Re-enable submit button in finally block
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// ===================================
// Check Admin Authentication
// Session guard — redirects to admin login if not authenticated as admin
// Call this at the top of every admin page
// =================================== */
async function checkAdminAuth() {
    try {
        // Call backend to verify admin session
        // GET request to /api/admins/me
        // credentials: "include" sends the session cookie
        const response = await fetch(API_BASE + '/admins/me', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            // Not logged in as admin - redirect to admin login page
            window.location.href = 'admin-login.html';
            return false;
        }
        
        // Parse admin data from response
        const data = await response.json();
        
        // Store name for display on this page
        sessionStorage.setItem('adminName', data.admin.name);
        sessionStorage.setItem('adminEmail', data.admin.email);
        
        return true;
        
    } catch (error) {
        console.error('Admin session check error:', error);
        // On error, redirect to login for security
        window.location.href = 'admin-login.html';
        return false;
    }
}

// ===================================
// Display Admin Name
// Gets the admin's name from sessionStorage
// and displays it in elements with class 'admin-name'
// =================================== */
function displayAdminName() {
    const adminName = sessionStorage.getItem('adminName') || 'Admin';
    const adminNameElements = document.querySelectorAll('.admin-name');
    
    // Update all elements that show the admin's name
    adminNameElements.forEach(element => {
        element.textContent = adminName;
    });
}

// ===================================
// Handle Admin Logout
// Clears session and redirects to admin login page
// =================================== */
async function handleAdminLogout() {
    try {
        // Call backend to destroy the session
        // Even if API call fails, clear local session and redirect for security
        await fetch(API_BASE + '/admins/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
    } catch (error) {
        console.error('Admin logout error:', error);
    } finally {
        // Clear sessionStorage (but NOT localStorage - Remember Me persists)
        sessionStorage.clear();
        
        // Show logout message
        showAdminToast('Logged out successfully', 'success');
        
        // Redirect to admin login page
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 500);
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
// Admin Toast Notification
// Shows a small popup message at the top-right of the screen
// type can be: 'success', 'error', 'info'
// =================================== */
function showAdminToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    
    // Add icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Style the toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 100);
    
    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ===================================
// Page Fade-In Animation
// Adds smooth fade-in effect when page loads
// =================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class to body if it has page-fade-in class
    const body = document.body;
    if (body.classList.contains('page-fade-in')) {
        setTimeout(() => {
            body.style.opacity = '1';
        }, 50);
    }
});
