/* ===================================
   EventHub - Events Data Module
   Stores all event data and rendering logic
   =================================== */

// ===================================
// Sample Events Data
// ===================================
const eventsData = [
    {
        id: 1,
        name: 'Tech Innovation Summit',
        description: 'Join industry leaders and innovators for a day of insights into the latest tech trends and breakthrough innovations.',
        date: '2025-06-15',
        time: '09:00 AM',
        location: 'Mumbai',
        category: 'Conference',
        maxAttendees: 300,
        currentAttendees: 250,
        status: 'Active',
        image: 'https://via.placeholder.com/400x200/667eea/ffffff?text=Tech+Summit'
    },
    {
        id: 2,
        name: 'UI/UX Design Workshop',
        description: 'Learn modern UI/UX design principles from experienced designers in this hands-on workshop.',
        date: '2025-06-20',
        time: '10:00 AM',
        location: 'Online',
        category: 'Workshop',
        maxAttendees: 50,
        currentAttendees: 45,
        status: 'Active',
        image: 'https://via.placeholder.com/400x200/10B981/ffffff?text=UI+UX+Workshop'
    },
    {
        id: 3,
        name: 'Annual College Fest',
        description: 'Experience an unforgettable celebration with music, food, and entertainment.',
        date: '2025-07-05',
        time: '05:00 PM',
        location: 'Pune',
        category: 'Party',
        maxAttendees: 1500,
        currentAttendees: 1200,
        status: 'Active',
        image: 'https://via.placeholder.com/400x200/EC4899/ffffff?text=College+Fest'
    },
    {
        id: 4,
        name: 'Python for Beginners',
        description: 'Start your programming journey with Python in this beginner-friendly seminar.',
        date: '2025-07-10',
        time: '02:00 PM',
        location: 'Bangalore',
        category: 'Seminar',
        maxAttendees: 100,
        currentAttendees: 85,
        status: 'Active',
        image: 'https://via.placeholder.com/400x200/F59E0B/ffffff?text=Python+Seminar'
    },
    {
        id: 5,
        name: 'Startup Pitch Night',
        description: 'Watch innovative startups pitch their ideas to investors and industry experts.',
        date: '2025-07-18',
        time: '06:00 PM',
        location: 'Delhi',
        category: 'Conference',
        maxAttendees: 200,
        currentAttendees: 150,
        status: 'Pending',
        image: 'https://via.placeholder.com/400x200/8B5CF6/ffffff?text=Startup+Pitch'
    },
    {
        id: 6,
        name: 'Web Dev Bootcamp',
        description: 'Master web development with HTML, CSS, and JavaScript in this intensive bootcamp.',
        date: '2025-08-02',
        time: '09:00 AM',
        location: 'Online',
        category: 'Workshop',
        maxAttendees: 75,
        currentAttendees: 60,
        status: 'Active',
        image: 'https://via.placeholder.com/400x200/06B6D4/ffffff?text=Web+Bootcamp'
    },
    {
        id: 7,
        name: 'Photography Expo',
        description: 'Explore stunning photography from talented artists and learn new techniques.',
        date: '2025-08-14',
        time: '11:00 AM',
        location: 'Chennai',
        category: 'Exhibition',
        maxAttendees: 500,
        currentAttendees: 320,
        status: 'Active',
        image: 'https://via.placeholder.com/400x200/EF4444/ffffff?text=Photo+Expo'
    },
    {
        id: 8,
        name: 'Hackathon 2025',
        description: 'Compete with developers nationwide to build innovative solutions in 48 hours.',
        date: '2025-08-20',
        time: '08:00 AM',
        location: 'Hyderabad',
        category: 'Competition',
        maxAttendees: 150,
        currentAttendees: 95,
        status: 'Active',
        image: 'https://via.placeholder.com/400x200/14B8A6/ffffff?text=Hackathon'
    }
];

// ===================================
// Get All Events
// ===================================
function getAllEvents() {
    return eventsData;
}

// ===================================
// Get Event by ID
// ===================================
function getEventById(id) {
    return eventsData.find(event => event.id === parseInt(id));
}

// ===================================
// Render Event Cards
// ===================================
function renderEventCards(events, containerId, isAdmin = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (events.length === 0) {
        container.innerHTML = '<p class="no-events">No events found</p>';
        return;
    }
    
    events.forEach(event => {
        const card = createEventCard(event, isAdmin);
        container.appendChild(card);
    });
}

// ===================================
// Create Event Card Element
// ===================================
function createEventCard(event, isAdmin = false) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const badgeClass = `badge-${event.category.toLowerCase()}`;
    const statusClass = event.status === 'Active' ? 'status-active' : 'status-pending';
    
    card.innerHTML = `
        <div class="event-image">
            <span class="event-badge ${badgeClass}">${event.category}</span>
            <div class="event-date-badge">
                <span class="date-day">${new Date(event.date).getDate()}</span>
                <span class="date-month">${new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
            </div>
        </div>
        <div class="event-content">
            <h3>${event.name}</h3>
            <div class="event-info">
                <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(event.date)}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <span>${event.currentAttendees}/${event.maxAttendees} attendees</span>
                </div>
            </div>
            <p class="event-description">${event.description.substring(0, 100)}...</p>
            <button class="btn btn-outline" onclick="viewEventDetail(${event.id})">View Details</button>
        </div>
    `;
    
    return card;
}

// ===================================
// View Event Detail
// Checks if user is logged in before showing details
// =================================== */
function viewEventDetail(eventId) {
    localStorage.setItem('selectedEventId', eventId);
    
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPath = window.location.pathname;
    
    // If not logged in and on public page, redirect to login
    if (isLoggedIn !== 'true' && !currentPath.includes('/user/') && !currentPath.includes('/admin/')) {
        // Show message and redirect to login
        alert('Please log in to view full event details.');
        window.location.href = 'login-user.html';
        return;
    }
    
    // If logged in, go to appropriate detail page
    if (currentPath.includes('/user/')) {
        window.location.href = 'event-detail.html';
    } else if (currentPath.includes('/admin/')) {
        window.location.href = 'event-detail.html';
    } else {
        // From public page but logged in
        const userRole = sessionStorage.getItem('userRole');
        if (userRole === 'admin') {
            window.location.href = 'admin/event-detail.html';
        } else {
            window.location.href = 'user/event-detail.html';
        }
    }
}

// ===================================
// Load Event Detail Page
// ===================================
function loadEventDetail() {
    const eventId = localStorage.getItem('selectedEventId');
    if (!eventId) {
        alert('No event selected');
        window.history.back();
        return;
    }
    
    const event = getEventById(eventId);
    if (!event) {
        alert('Event not found');
        window.history.back();
        return;
    }
    
    // Update page title
    document.title = `${event.name} - EventHub`;
    
    // Fill in event details
    document.getElementById('event-name').textContent = event.name;
    document.getElementById('event-description').textContent = event.description;
    document.getElementById('event-date').textContent = formatDate(event.date);
    document.getElementById('event-time').textContent = event.time;
    document.getElementById('event-location').textContent = event.location;
    document.getElementById('event-category').textContent = event.category;
    document.getElementById('event-attendees').textContent = `${event.currentAttendees} / ${event.maxAttendees}`;
    document.getElementById('event-status').textContent = event.status;
    
    // Set status badge class
    const statusBadge = document.getElementById('event-status');
    statusBadge.className = event.status === 'Active' ? 'status-badge status-active' : 'status-badge status-pending';
}

// ===================================
// Search Events
// ===================================
function searchEvents(query) {
    query = query.toLowerCase();
    return eventsData.filter(event => 
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    );
}

// ===================================
// Filter Events by Category
// ===================================
function filterEventsByCategory(category) {
    if (category === 'All' || !category) {
        return eventsData;
    }
    return eventsData.filter(event => event.category === category);
}

// ===================================
// Format Date
// ===================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===================================
// Delete Event (Admin Only)
// ===================================
function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        const index = eventsData.findIndex(event => event.id === parseInt(eventId));
        if (index > -1) {
            eventsData.splice(index, 1);
            showToast('Event deleted successfully');
            return true;
        }
    }
    return false;
}

// ===================================
// Register for Event (User)
// ===================================
function registerForEvent(eventId) {
    const event = getEventById(eventId);
    if (event && event.currentAttendees < event.maxAttendees) {
        event.currentAttendees++;
        showToast('Successfully registered for ' + event.name);
        
        // Update button text
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.textContent = 'Registered ✓';
            registerBtn.disabled = true;
            registerBtn.classList.add('btn-success');
        }
    } else {
        alert('Event is full or not available');
    }
}
