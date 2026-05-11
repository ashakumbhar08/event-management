/* ===================================
   EventHub - Main JavaScript File
   Shared functionality for navigation and UI
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Mobile Navigation Toggle (Pre-Login)
    // ===================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    
    // ===================================
    // Sidebar Toggle (Post-Login)
    // ===================================
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    
    if (sidebarToggle && sidebar) {
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
    // ===================================
    function highlightActiveSidebarLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        
        sidebarLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    highlightActiveSidebarLink();
    
    // ===================================
    // Smooth Scrolling for Anchor Links
    // ===================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#users') {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ===================================
    // Loading State Simulation
    // ===================================
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 1000);
    }
    
    // ===================================
    // Console Message
    // ===================================
    console.log('EventHub - Event Management System');
    console.log('Functional Frontend Prototype');
    console.log('Built with HTML5, CSS3, and Vanilla JavaScript');
});

// ===================================
// Back Button Handler
// ===================================
function goBack() {
    window.history.back();
}
