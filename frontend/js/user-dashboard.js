/* ===================================
   EventHub - User Dashboard Module
   
   This file handles:
   - Session guard (redirects if not logged in)
   - Loading user data from backend
   - Displaying dashboard statistics
   - Loading upcoming events
   
   Used on: user/dashboard.html
   For college project - beginner friendly code
   =================================== */

// ===================================
// Session Guard — check if user is logged in before loading page content
// If not logged in, redirect to login page immediately
// This MUST run first when the page loads
// =================================== */
(async function checkUserSession() {
    try {
        // Call backend to verify user session
        // GET request to /api/users/me
        // credentials: "include" sends the session cookie
        const response = await fetch(API_BASE + '/users/me', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            // Not logged in - redirect to login page
            window.location.href = '../login.html';
            return;
        }
        
        // Parse user data from response
        const data = await response.json();
        
        // Store name for display on this page
        sessionStorage.setItem('userName', data.user.name);
        sessionStorage.setItem('userEmail', data.user.email);
        
        // Update the welcome message with the real name from the backend session
        displayUserName(data.user.name);
        
        // Load dashboard data
        await loadDashboardData();
        
    } catch (error) {
        console.error('Session check error:', error);
        // On error, redirect to login for security
        window.location.href = '../login.html';
    }
})();

// ===================================
// Display User Name
// Updates all elements showing the user's name
// =================================== */
function displayUserName(userName) {
    // Find all elements with class 'user-name'
    const userNameElements = document.querySelectorAll('.user-name');
    
    // Update each element with the user's name
    userNameElements.forEach(function(element) {
        element.textContent = userName;
    });
}

// ===================================
// Load Dashboard Data
// Fetches and displays all dashboard information
// =================================== */
async function loadDashboardData() {
    try {
        // Load all data in parallel for better performance
        await Promise.all([
            loadUpcomingEvents(),
            loadUserStatistics()
        ]);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard data', 'error');
    }
}

// ===================================
// Load Upcoming Events
// Fetches events from backend and displays the first 3 upcoming ones
// =================================== */
async function loadUpcomingEvents() {
    try {
        // Show loading state
        const container = document.getElementById('upcoming-events');
        if (!container) return;
        
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Loading events...</p>';
        
        // Fetch all events from MongoDB via backend API
        // GET request — no credentials needed, events are public
        const response = await fetch(API_BASE + '/events', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load events');
        }
        
        const data = await response.json();
        const allEvents = data.events;
        
        // Filter to only show events whose date is in the future
        const now = new Date();
        const upcomingEvents = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate > now;
        });
        
        // Sort by date (earliest first)
        upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Take only the first 3 events
        const eventsToShow = upcomingEvents.slice(0, 3);
        
        // If no upcoming events
        if (eventsToShow.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;">No upcoming events at the moment.</p>';
            return;
        }
        
        // Build event cards with real data — same HTML structure as before
        container.innerHTML = '';
        eventsToShow.forEach(event => {
            const card = createEventCard(event);
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading upcoming events:', error);
        const container = document.getElementById('upcoming-events');
        if (container) {
            container.innerHTML = '<p style="text-align: center; padding: 20px; color: #EF4444;">Error loading events. Please refresh the page.</p>';
        }
    }
}

// ===================================
// Create Event Card Element
// Builds an event card with real data from MongoDB
// =================================== */
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Format the date
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const fullDate = formatDate(event.date);
    
    // Determine badge class based on category
    const badgeClass = `badge-${event.category.toLowerCase()}`;
    
    card.innerHTML = `
        <div class="event-image">
            <span class="event-badge ${badgeClass}">${event.category}</span>
            <div class="event-date-badge">
                <span class="date-day">${day}</span>
                <span class="date-month">${month}</span>
            </div>
        </div>
        <div class="event-content">
            <h3>${event.title}</h3>
            <div class="event-info">
                <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span>${fullDate}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>${event.time}</span>
                </div>
            </div>
            <p class="event-description">${event.description.substring(0, 100)}...</p>
            <button class="btn btn-outline" onclick="viewEventDetail('${event._id}')">View Details</button>
        </div>
    `;
    
    return card;
}

// ===================================
// View Event Detail
// Redirects to event detail page with event ID
// =================================== */
function viewEventDetail(eventId) {
    window.location.href = `event-detail.html?id=${eventId}`;
}

// ===================================
// Load User Statistics
// Fetches user's registration and certificate counts
// =================================== */
async function loadUserStatistics() {
    try {
        // Fetch user's registrations
        // This API returns only registrations belonging to the logged-in user
        const regResponse = await fetch(API_BASE + '/registrations/my', {
            credentials: 'include'
        });
        
        if (regResponse.ok) {
            const regData = await regResponse.json();
            const registrationCount = regData.count || 0;
            
            // Update the "My Registered Events" stat card
            updateStatCard(0, registrationCount);
            
            // Count upcoming events from registrations
            const now = new Date();
            const upcomingCount = regData.registrations.filter(reg => {
                return reg.eventId && new Date(reg.eventId.date) > now;
            }).length;
            
            // Update the "Upcoming Events" stat card
            updateStatCard(1, upcomingCount);
        }
        
        // Fetch user's certificates
        const certResponse = await fetch(API_BASE + '/certificates/my', {
            credentials: 'include'
        });
        
        if (certResponse.ok) {
            const certData = await certResponse.json();
            const certificateCount = certData.count || 0;
            
            // Update the "Certificates Earned" stat card
            updateStatCard(2, certificateCount);
        }
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Keep default values if error occurs
    }
}

// ===================================
// Update Stat Card
// Updates a specific statistics card with real number
// =================================== */
function updateStatCard(index, value) {
    const cards = document.querySelectorAll('.summary-card h3');
    if (cards[index]) {
        cards[index].textContent = value;
    }
}

// ===================================
// Handle User Logout
// Clears session and redirects to login page
// =================================== */
async function handleLogout() {
    try {
        // Call backend to destroy the session
        // Even if API call fails, clear local session and redirect for security
        await fetch(API_BASE + '/users/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear sessionStorage (but NOT localStorage - Remember Me persists)
        sessionStorage.clear();
        
        // Show logout message
        showToast('Logged out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 500);
    }
}
