/* ===================================
   EventHub - Admin Analytics Module
   
   This file handles:
   - Initializing Chart.js charts
   - Displaying analytics data
   - Sample/dummy data for charts
   
   Used on: admin-analytics.html
   For college project - beginner friendly code
   =================================== */

// ===================================
// DUMMY DATA FOR CHARTS
// This is hardcoded sample data for demonstration
// In a real app, this would come from database analytics
// =================================== */

// Event Category Distribution Data
const CATEGORY_DATA = {
    labels: ['Tech', 'Cultural', 'Sports', 'Workshop', 'Other'],
    data: [4, 3, 2, 2, 1]
};

// Monthly Registrations Data
const MONTHLY_DATA = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    data: [12, 19, 8, 24, 15, 30]
};

// Event Status Data
const STATUS_DATA = {
    labels: ['Active', 'Upcoming', 'Completed'],
    data: [5, 4, 3]
};

// ===================================
// Initialize All Charts
// Called when page loads
// =================================== */
function initializeCharts() {
    initCategoryChart();
    initMonthlyChart();
    initStatusChart();
}

// ===================================
// Initialize Category Pie Chart
// Shows distribution of events by category
// =================================== */
function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: CATEGORY_DATA.labels,
            datasets: [{
                data: CATEGORY_DATA.data,
                backgroundColor: [
                    '#5c6bc0',  // Indigo
                    '#ec407a',  // Pink
                    '#42a5f5',  // Blue
                    '#66bb6a',  // Green
                    '#ffa726'   // Orange
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Poppins'
                        }
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
}

// ===================================
// Initialize Monthly Registrations Bar Chart
// Shows user registrations per month
// =================================== */
function initMonthlyChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: MONTHLY_DATA.labels,
            datasets: [{
                label: 'Registrations',
                data: MONTHLY_DATA.data,
                backgroundColor: 'rgba(92, 107, 192, 0.7)',
                borderColor: '#5c6bc0',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ===================================
// Initialize Status Doughnut Chart
// Shows breakdown of event statuses
// =================================== */
function initStatusChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: STATUS_DATA.labels,
            datasets: [{
                data: STATUS_DATA.data,
                backgroundColor: [
                    '#00bfa5',  // Teal (Active)
                    '#5c6bc0',  // Indigo (Upcoming)
                    '#9e9e9e'   // Gray (Completed)
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Poppins'
                        }
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
}
