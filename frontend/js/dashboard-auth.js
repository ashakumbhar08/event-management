/* ===================================
   EventHub - Dashboard Authentication Module
   
   This file handles:
   - Session guard (redirects if not logged in)
   - Dynamic user name display
   - Logout functionality
   
   Used on: dashboard.html and all user post-login pages
   For college project - beginner friendly code
   =================================== */

// ===================================
// Session Guard: Check if User is Logged In
// This MUST run first when any post-login page loads
// Redirects to login page if user is not logged in
// =================================== */
(function checkUserSession() {
    // Get userName from sessionStorage
    const userName = sessionStorage.getItem('userName');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    // If user is not logged in, redirect to login page
    if (!userName || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // If logged in, display the user's name
    displayUserName(userName);
})();

// ===================================
// Display User Name
// Updates the welcome heading with the user's name
// =================================== */
function displayUserName(userName) {
    // Find the welcome heading element
    const welcomeHeading = document.getElementById('welcome-heading');
    
    if (welcomeHeading) {
        // Update the text to include user's name
        welcomeHeading.textContent = 'Welcome, ' + userName + '!';
    }
    
    // Also update any other elements with class 'user-name'
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(function(element) {
        element.textContent = userName;
    });
}

// ===================================
// Handle User Logout
// Clears session and redirects to login page
// Call this function when logout button is clicked
// =================================== */
function handleUserLogout() {
    // Clear all session data (but NOT localStorage - Remember Me persists)
    sessionStorage.clear();
    
    // Show logout message if toast function exists
    if (typeof showToast === 'function') {
        showToast('Logged out successfully');
    }
    
    // Redirect to login page after short delay
    setTimeout(function() {
        window.location.href = 'login.html';
    }, 1000);
}
