/* ===================================
   EventHub - Utility Functions Module
   
   This file contains small reusable helper functions used across the project.
   These functions help with common tasks like showing messages, redirecting, etc.
   
   For college project - beginner friendly code
   =================================== */

// ===================================
// showMessage — displays an inline message inside a container element
// elementId: the id of the HTML element to put the message in
// message: the text to show
// type: "success" (green) or "error" (red)
// =================================== */
function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    el.textContent = message;
    el.style.color = type === "success" ? "#10B981" : "#EF4444";
    el.style.display = "block";
    el.style.marginTop = "10px";
    el.style.fontSize = "14px";
}

// ===================================
// hideMessage — hides an inline message element
// =================================== */
function hideMessage(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.style.display = "none";
        el.textContent = "";
    }
}

// ===================================
// redirectTo — navigates to a new page
// =================================== */
function redirectTo(page) {
    window.location.href = page;
}

// ===================================
// isUserLoggedIn — checks if a user session exists by calling the /me endpoint
// Returns true if logged in, false if not
// =================================== */
async function isUserLoggedIn() {
    try {
        // Call the backend to check if user session exists
        // credentials: "include" sends the session cookie
        const response = await fetch(API_BASE + "/users/me", {
            credentials: "include"
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// ===================================
// isAdminLoggedIn — checks if an admin session exists
// =================================== */
async function isAdminLoggedIn() {
    try {
        // Call the backend to check if admin session exists
        const response = await fetch(API_BASE + "/admins/me", {
            credentials: "include"
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// ===================================
// formatDate — formats a date string to readable format
// =================================== */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===================================
// formatTime — formats time to 12-hour format
// =================================== */
function formatTime(timeString) {
    // If already formatted, return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
    }
    
    // Otherwise, parse and format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// ===================================
// showToast — shows a temporary notification message
// =================================== */
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
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
// disableButton — disables a button and shows loading text
// =================================== */
function disableButton(buttonId, loadingText) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = true;
        button.setAttribute('data-original-text', button.textContent);
        button.textContent = loadingText;
    }
}

// ===================================
// enableButton — re-enables a button and restores original text
// =================================== */
function enableButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
        }
    }
}
