/* ===================================
   EventHub - Admin Sidebar Module
   
   This file handles:
   - Sidebar toggle for mobile
   - Active menu item highlighting
   - Sidebar navigation interactions
   
   Used on: All admin pages with sidebar
   For college project - beginner friendly code
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Sidebar Toggle (Mobile)
    // Opens and closes sidebar on mobile devices
    // =================================== */
    const sidebarToggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const sidebarBackdrop = document.getElementById('admin-sidebar-backdrop');
    
    if (sidebarToggle && sidebar) {
        // Toggle sidebar when button is clicked
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            if (sidebarBackdrop) {
                sidebarBackdrop.classList.toggle('active');
            }
        });
        
        // Close sidebar when clicking backdrop
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', function() {
                sidebar.classList.remove('active');
                sidebarBackdrop.classList.remove('active');
            });
        }
        
        // Close sidebar when clicking a link on mobile
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    if (sidebarBackdrop) {
                        sidebarBackdrop.classList.remove('active');
                    }
                }
            });
        });
    }
    
    // ===================================
    // Highlight Active Sidebar Link
    // Automatically highlights the current page in sidebar menu
    // =================================== */
    function highlightActiveSidebarLink() {
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop();
        
        // Get all sidebar links
        const sidebarLinks = document.querySelectorAll('.admin-sidebar-nav a');
        
        // Loop through links and add active class to matching one
        sidebarLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            
            // Remove active class from all links first
            link.classList.remove('active');
            
            // Add active class to current page link
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    // Call the function to highlight active link
    highlightActiveSidebarLink();
});
