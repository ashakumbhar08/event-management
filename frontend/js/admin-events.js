/* ===================================
   EventHub - Admin Events Module
   
   This file handles:
   - Creating new events
   - Reading events from localStorage
   - Updating existing events
   - Deleting events
   - Rendering events in tables and cards
   
   Used on: admin-dashboard.html, admin-create-event.html, admin-manage-events.html
   For college project - beginner friendly code
   =================================== */

// ===================================
// Get All Admin Events from localStorage
// Returns an array of all events created by admin
// =================================== */
function getAdminEvents() {
    // Try to get events from localStorage
    const eventsJSON = localStorage.getItem('adminEvents');
    
    // If no events exist, return empty array
    if (!eventsJSON) {
        return [];
    }
    
    // Parse JSON string back to array
    return JSON.parse(eventsJSON);
}

// ===================================
// Save Admin Events to localStorage
// Takes an array of events and saves it
// =================================== */
function saveAdminEvents(events) {
    // Convert array to JSON string and save
    localStorage.setItem('adminEvents', JSON.stringify(events));
}

// ===================================
// Get Single Event by ID
// Returns one event object matching the ID
// =================================== */
function getAdminEventById(eventId) {
    const events = getAdminEvents();
    return events.find(event => event.id === parseInt(eventId));
}

// ===================================
// Create New Event
// Adds a new event to localStorage
// =================================== */
function createAdminEvent(eventData) {
    // Get existing events
    const events = getAdminEvents();
    
    // Create new event object with unique ID
    const newEvent = {
        id: Date.now(), // Use timestamp as unique ID
        ...eventData,
        createdAt: new Date().toISOString()
    };
    
    // Add to array
    events.push(newEvent);
    
    // Save back to localStorage
    saveAdminEvents(events);
    
    return newEvent;
}

// ===================================
// Update Existing Event
// Updates an event by ID
// =================================== */
function updateAdminEvent(eventId, updatedData) {
    const events = getAdminEvents();
    
    // Find index of event to update
    const index = events.findIndex(event => event.id === parseInt(eventId));
    
    if (index !== -1) {
        // Update the event (keep the ID and createdAt)
        events[index] = {
            ...events[index],
            ...updatedData,
            id: events[index].id,
            createdAt: events[index].createdAt,
            updatedAt: new Date().toISOString()
        };
        
        // Save back to localStorage
        saveAdminEvents(events);
        return true;
    }
    
    return false;
}

// ===================================
// Delete Event
// Removes an event from localStorage
// =================================== */
function deleteAdminEvent(eventId) {
    const events = getAdminEvents();
    
    // Filter out the event to delete
    const filteredEvents = events.filter(event => event.id !== parseInt(eventId));
    
    // Save back to localStorage
    saveAdminEvents(filteredEvents);
    
    return true;
}

// ===================================
// Load Dashboard Data
// Loads statistics and recent events for dashboard
// =================================== */
function loadDashboardData() {
    const events = getAdminEvents();
    
    // Update statistics
    document.getElementById('total-events').textContent = events.length;
    
    // Count upcoming events (events with status "Upcoming" or "Active")
    const upcomingCount = events.filter(e => e.status === 'Upcoming' || e.status === 'Active').length;
    document.getElementById('upcoming-events').textContent = upcomingCount;
    
    // Load recent events table (show last 4 events)
    loadRecentEventsTable(events.slice(-4).reverse());
}

// ===================================
// Load Recent Events Table
// Displays recent events in dashboard table
// =================================== */
function loadRecentEventsTable(events) {
    const tbody = document.getElementById('recent-events-tbody');
    const emptyState = document.getElementById('empty-state');
    const table = document.getElementById('recent-events-table');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Check if there are any events
    if (events.length === 0) {
        // Show empty state
        table.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    // Hide empty state and show table
    table.style.display = 'table';
    emptyState.style.display = 'none';
    
    // Create table rows for each event
    events.forEach(event => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        let statusClass = 'status-active';
        if (event.status === 'Upcoming') statusClass = 'status-upcoming';
        if (event.status === 'Completed') statusClass = 'status-completed';
        
        row.innerHTML = `
            <td><strong>${event.name}</strong></td>
            <td>${event.category}</td>
            <td>${formatDate(event.date)}</td>
            <td><span class="status-badge ${statusClass}">${event.status}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// ===================================
// Format Date
// Converts date string to readable format
// =================================== */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===================================
// Format Time
// Converts 24-hour time to 12-hour format
// =================================== */
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
}
