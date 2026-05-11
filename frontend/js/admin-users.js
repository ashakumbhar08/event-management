/* ===================================
   EventHub - Admin Users Module
   
   This file handles:
   - Sample user/participant data
   - Displaying users in a table
   - Searching/filtering users
   
   Used on: admin-users.html
   For college project - beginner friendly code
   =================================== */

// ===================================
// SAMPLE DATA — Replace with real data later
// This is hardcoded sample data for demonstration
// In a real app, this would come from a database
// =================================== */
const SAMPLE_USERS = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        registeredEvent: 'Tech Innovation Summit',
        registrationDate: '2025-05-01',
        status: 'Confirmed'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        registeredEvent: 'UI/UX Design Workshop',
        registrationDate: '2025-05-03',
        status: 'Confirmed'
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        registeredEvent: 'Annual College Fest',
        registrationDate: '2025-05-05',
        status: 'Pending'
    },
    {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        registeredEvent: 'Python for Beginners',
        registrationDate: '2025-05-07',
        status: 'Confirmed'
    },
    {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@example.com',
        registeredEvent: 'Startup Pitch Night',
        registrationDate: '2025-05-10',
        status: 'Confirmed'
    },
    {
        id: 6,
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        registeredEvent: 'Web Dev Bootcamp',
        registrationDate: '2025-05-12',
        status: 'Pending'
    },
    {
        id: 7,
        name: 'Chris Wilson',
        email: 'chris.wilson@example.com',
        registeredEvent: 'Photography Expo',
        registrationDate: '2025-05-15',
        status: 'Confirmed'
    },
    {
        id: 8,
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        registeredEvent: 'Hackathon 2025',
        registrationDate: '2025-05-18',
        status: 'Confirmed'
    }
];

// Store all users globally for search
let allUsers = SAMPLE_USERS;

// ===================================
// Load Users Page Data
// Loads statistics and user table
// =================================== */
function loadUsersData() {
    // Calculate statistics
    const totalUsers = allUsers.length;
    const confirmedUsers = allUsers.filter(u => u.status === 'Confirmed').length;
    const pendingUsers = allUsers.filter(u => u.status === 'Pending').length;
    
    // Update statistics
    document.getElementById('total-registered').textContent = totalUsers;
    document.getElementById('confirmed-participants').textContent = confirmedUsers;
    document.getElementById('pending-registrations').textContent = pendingUsers;
    
    // Load users table
    renderUsersTable(allUsers);
}

// ===================================
// Render Users Table
// Creates table rows for each user
// =================================== */
function renderUsersTable(users) {
    const tbody = document.getElementById('users-tbody');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Check if there are any users
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--admin-text-light);">
                    No users found
                </td>
            </tr>
        `;
        return;
    }
    
    // Create table row for each user
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        
        // Determine status badge class
        const statusClass = user.status === 'Confirmed' ? 'status-active' : 'status-upcoming';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.registeredEvent}</td>
            <td>${formatDate(user.registrationDate)}</td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// ===================================
// Handle Search Users
// Filters users based on search input
// =================================== */
function handleSearchUsers() {
    const searchQuery = document.getElementById('search-users-input').value.toLowerCase();
    
    // Filter users by name or email
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery)
    );
    
    // Re-render with filtered users
    renderUsersTable(filteredUsers);
}

// ===================================
// Format Date (reuse from admin-events.js if needed)
// =================================== */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
