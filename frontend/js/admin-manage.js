/* ===================================
   EventHub - Admin Manage Events Module
   
   This file handles:
   - Displaying all events in cards
   - Searching/filtering events
   - Editing events inline
   - Deleting events with confirmation
   
   Used on: admin-manage-events.html
   For college project - beginner friendly code
   =================================== */

// Store all events globally for search
let allEvents = [];

// ===================================
// Load and Display All Events
// Gets events from localStorage and renders them as cards
// =================================== */
function loadManageEvents() {
    allEvents = getAdminEvents();
    renderEventCards(allEvents);
}

// ===================================
// Render Event Cards
// Creates card elements for each event
// =================================== */
function renderEventCards(events) {
    const container = document.getElementById('events-container');
    const emptyState = document.getElementById('empty-state');
    
    // Clear container
    container.innerHTML = '';
    
    // Check if there are any events
    if (events.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    // Show container and hide empty state
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Create card for each event
    events.forEach(event => {
        const card = createEventCard(event);
        container.appendChild(card);
    });
}

// ===================================
// Create Single Event Card
// Returns a card element for one event
// =================================== */
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'admin-event-card';
    card.id = `event-card-${event.id}`;
    
    // Determine status badge class
    let statusClass = 'status-active';
    if (event.status === 'Upcoming') statusClass = 'status-upcoming';
    if (event.status === 'Completed') statusClass = 'status-completed';
    
    card.innerHTML = `
        <div class="event-card-header">
            <h3>${event.name}</h3>
            <span class="status-badge ${statusClass}">${event.status}</span>
        </div>
        <div class="event-card-body">
            <div class="event-card-info">
                <i class="fas fa-tag"></i>
                <span>${event.category}</span>
            </div>
            <div class="event-card-info">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(event.date)}</span>
            </div>
            <div class="event-card-info">
                <i class="fas fa-clock"></i>
                <span>${formatTime(event.time)}</span>
            </div>
            <div class="event-card-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
            </div>
            ${event.maxParticipants ? `
            <div class="event-card-info">
                <i class="fas fa-users"></i>
                <span>Max: ${event.maxParticipants} participants</span>
            </div>
            ` : ''}
        </div>
        <div class="event-card-description">
            <p>${event.description}</p>
        </div>
        <div class="event-card-actions" id="actions-${event.id}">
            <button class="btn-icon btn-edit" onclick="startEditEvent(${event.id})" title="Edit">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-icon btn-delete" onclick="confirmDeleteEvent(${event.id})" title="Delete">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

// ===================================
// Handle Search Events
// Filters events based on search input
// =================================== */
function handleSearchEvents() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    
    // Filter events by name
    const filteredEvents = allEvents.filter(event => 
        event.name.toLowerCase().includes(searchQuery)
    );
    
    // Re-render with filtered events
    renderEventCards(filteredEvents);
}

// ===================================
// Start Edit Event
// Shows inline edit form for an event
// =================================== */
function startEditEvent(eventId) {
    const event = getAdminEventById(eventId);
    if (!event) return;
    
    const card = document.getElementById(`event-card-${eventId}`);
    
    // Replace card content with edit form
    card.innerHTML = `
        <div class="event-edit-form">
            <h3>Edit Event</h3>
            <form onsubmit="saveEditEvent(event, ${eventId})">
                <div class="form-group">
                    <label>Event Name <span class="required">*</span></label>
                    <input type="text" id="edit-name-${eventId}" value="${event.name}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Category <span class="required">*</span></label>
                        <select id="edit-category-${eventId}" required>
                            <option value="Tech" ${event.category === 'Tech' ? 'selected' : ''}>Tech</option>
                            <option value="Cultural" ${event.category === 'Cultural' ? 'selected' : ''}>Cultural</option>
                            <option value="Sports" ${event.category === 'Sports' ? 'selected' : ''}>Sports</option>
                            <option value="Workshop" ${event.category === 'Workshop' ? 'selected' : ''}>Workshop</option>
                            <option value="Other" ${event.category === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status <span class="required">*</span></label>
                        <select id="edit-status-${eventId}" required>
                            <option value="Upcoming" ${event.status === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
                            <option value="Active" ${event.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Completed" ${event.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date <span class="required">*</span></label>
                        <input type="date" id="edit-date-${eventId}" value="${event.date}" required>
                    </div>
                    <div class="form-group">
                        <label>Time <span class="required">*</span></label>
                        <input type="time" id="edit-time-${eventId}" value="${event.time}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Location <span class="required">*</span></label>
                        <input type="text" id="edit-location-${eventId}" value="${event.location}" required>
                    </div>
                    <div class="form-group">
                        <label>Max Participants</label>
                        <input type="number" id="edit-max-${eventId}" value="${event.maxParticipants || ''}" min="1">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description <span class="required">*</span></label>
                    <textarea id="edit-description-${eventId}" rows="3" required>${event.description}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-admin-secondary" onclick="cancelEditEvent(${eventId})">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-admin-primary">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;
}

// ===================================
// Save Edit Event
// Updates event with new data
// =================================== */
function saveEditEvent(event, eventId) {
    event.preventDefault();
    
    // Get updated values
    const updatedData = {
        name: document.getElementById(`edit-name-${eventId}`).value.trim(),
        category: document.getElementById(`edit-category-${eventId}`).value,
        status: document.getElementById(`edit-status-${eventId}`).value,
        date: document.getElementById(`edit-date-${eventId}`).value,
        time: document.getElementById(`edit-time-${eventId}`).value,
        location: document.getElementById(`edit-location-${eventId}`).value.trim(),
        maxParticipants: document.getElementById(`edit-max-${eventId}`).value || null,
        description: document.getElementById(`edit-description-${eventId}`).value.trim()
    };
    
    // Update event in localStorage
    updateAdminEvent(eventId, updatedData);
    
    // Show success message
    showAdminToast('✔ Event updated successfully!', 'success');
    
    // Reload events
    loadManageEvents();
}

// ===================================
// Cancel Edit Event
// Closes edit form and shows original card
// =================================== */
function cancelEditEvent(eventId) {
    loadManageEvents();
}

// ===================================
// Confirm Delete Event
// Shows inline confirmation before deleting
// =================================== */
function confirmDeleteEvent(eventId) {
    const actionsDiv = document.getElementById(`actions-${eventId}`);
    
    // Replace action buttons with confirmation
    actionsDiv.innerHTML = `
        <span style="color: var(--admin-danger); font-weight: 600;">Sure?</span>
        <button class="btn-icon btn-confirm-yes" onclick="executeDeleteEvent(${eventId})">
            <i class="fas fa-check"></i> Yes
        </button>
        <button class="btn-icon btn-confirm-no" onclick="cancelDeleteEvent(${eventId})">
            <i class="fas fa-times"></i> No
        </button>
    `;
}

// ===================================
// Execute Delete Event
// Actually deletes the event
// =================================== */
function executeDeleteEvent(eventId) {
    // Delete from localStorage
    deleteAdminEvent(eventId);
    
    // Show success message
    showAdminToast('Event deleted successfully', 'success');
    
    // Reload events
    loadManageEvents();
}

// ===================================
// Cancel Delete Event
// Restores original action buttons
// =================================== */
function cancelDeleteEvent(eventId) {
    const actionsDiv = document.getElementById(`actions-${eventId}`);
    
    // Restore original buttons
    actionsDiv.innerHTML = `
        <button class="btn-icon btn-edit" onclick="startEditEvent(${eventId})" title="Edit">
            <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-icon btn-delete" onclick="confirmDeleteEvent(${eventId})" title="Delete">
            <i class="fas fa-trash"></i> Delete
        </button>
    `;
}
