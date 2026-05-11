/* ===================================
   EventHub - Certificates Module
   
   This file handles:
   - Displaying completed event certificates
   - Viewing certificates in a modal
   - Simulating certificate download
   
   For college project - beginner friendly code
   =================================== */

// ===================================
// Sample Certificate Data
// In a real app, this would come from a database
// =================================== */
const completedEvents = [
    {
        id: 1,
        eventName: 'Tech Innovation Summit',
        dateCompleted: '2025-06-15',
        category: 'Conference'
    },
    {
        id: 2,
        eventName: 'UI/UX Design Workshop',
        dateCompleted: '2025-06-20',
        category: 'Workshop'
    }
];

// ===================================
// Load Certificates
// Displays all completed event certificates
// =================================== */
function loadCertificates() {
    const container = document.getElementById('certificates-container');
    
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if there are any certificates
    if (completedEvents.length === 0) {
        container.innerHTML = '<p class="no-events">No certificates yet. Complete events to earn certificates!</p>';
        return;
    }
    
    // Create certificate card for each completed event
    completedEvents.forEach(event => {
        const card = createCertificateCard(event);
        container.appendChild(card);
    });
}

// ===================================
// Create Certificate Card
// Creates a single certificate card element
// =================================== */
function createCertificateCard(event) {
    const card = document.createElement('div');
    card.className = 'certificate-card';
    
    card.innerHTML = `
        <div class="certificate-badge">
            <i class="fas fa-award"></i>
        </div>
        <h3>${event.eventName}</h3>
        <p class="certificate-category">${event.category}</p>
        <p class="certificate-date">Completed: ${formatDate(event.dateCompleted)}</p>
        <div class="certificate-actions">
            <button class="btn btn-primary" onclick="viewCertificate(${event.id})">
                <i class="fas fa-eye"></i> View Certificate
            </button>
            <button class="btn btn-outline" onclick="downloadCertificate(${event.id})">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `;
    
    return card;
}

// ===================================
// View Certificate
// Opens a modal showing the certificate
// =================================== */
function viewCertificate(eventId) {
    // Find the event
    const event = completedEvents.find(e => e.id === eventId);
    if (!event) return;
    
    // Get user name from session
    const userName = sessionStorage.getItem('userName') || 'User';
    
    // Get modal elements
    const modal = document.getElementById('certificate-modal');
    const certificateView = document.getElementById('certificate-view');
    
    // Create certificate HTML
    certificateView.innerHTML = `
        <div class="certificate-content">
            <div class="certificate-header">
                <i class="fas fa-award certificate-icon"></i>
                <h1>Certificate of Completion</h1>
            </div>
            <div class="certificate-body">
                <p class="certificate-text">This is to certify that</p>
                <h2 class="certificate-name">${userName}</h2>
                <p class="certificate-text">has successfully completed</p>
                <h3 class="certificate-event">${event.eventName}</h3>
                <p class="certificate-text">on ${formatDate(event.dateCompleted)}</p>
            </div>
            <div class="certificate-footer">
                <div class="certificate-signature">
                    <div class="signature-line"></div>
                    <p>Event Organizer</p>
                </div>
                <div class="certificate-seal">
                    <i class="fas fa-certificate"></i>
                    <p>EventHub</p>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
}

// ===================================
// Close Certificate Modal
// Hides the certificate modal
// =================================== */
function closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    modal.style.display = 'none';
}

// ===================================
// Download Certificate
// Simulates downloading a certificate
// In a real app, this would generate a PDF
// =================================== */
function downloadCertificate(eventId) {
    const event = completedEvents.find(e => e.id === eventId);
    if (!event) return;
    
    // Show message
    alert('Certificate download will be available soon.\n\nFor now, you can view and print the certificate.');
    
    // Optionally, open the certificate view
    viewCertificate(eventId);
}

// ===================================
// Format Date
// Converts date string to readable format
// =================================== */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('certificate-modal');
    if (event.target === modal) {
        closeCertificateModal();
    }
}
