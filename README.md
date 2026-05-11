# 🎯 EventHub - Event Management System

[![Node.js](https://img.shields.io/badge/Node.js-v22.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.x-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack event management platform with role-based access control, enabling users to discover and register for events while administrators manage event creation, tracking, and analytics.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 Overview

EventHub is a comprehensive event management system built as a full-stack web application. It provides a centralized platform for event discovery, registration, and management with separate interfaces for users and administrators.

### Problem Statement
Traditional event management involves manual processes, scattered information, and lack of centralized platforms. EventHub solves this by providing a unified digital solution for both event organizers and participants.

### Key Highlights
- 🔐 Secure authentication with bcrypt password hashing
- 👥 Role-based access control (User & Admin)
- 📊 Real-time analytics dashboard
- 🎫 Digital certificate issuance
- 📱 Fully responsive design
- 🗄️ MongoDB database integration
- 🔄 RESTful API architecture

---

## ✨ Features

### User Features
- **Account Management**
  - Sign up with email and password
  - Secure login with Remember Me functionality
  - Session-based authentication (24-hour expiry)

- **Event Discovery**
  - Browse all available events
  - Filter by category (Tech, Cultural, Sports, Workshop, Other)
  - View detailed event information
  - Search functionality

- **Event Registration**
  - One-click event registration
  - View registered events
  - Track upcoming events
  - Prevent duplicate registrations

- **Certificates**
  - View earned certificates
  - Download/print certificates
  - Certificate verification

- **Dashboard**
  - Personalized welcome message
  - Statistics overview (registered events, upcoming events, certificates)
  - Quick access to upcoming events

### Admin Features
- **Admin Authentication**
  - Secure admin login
  - Demo credentials: `admin@eventhub.com` / `admin123`
  - Separate admin session management

- **Event Management**
  - Create new events with detailed information
  - Edit existing events
  - Delete events with confirmation
  - Update event status (Upcoming, Active, Completed)

- **Analytics Dashboard**
  - Total events and registrations count
  - Events by category (Pie chart)
  - Events by status (Doughnut chart)
  - Monthly trends (Bar chart)
  - Real-time data visualization with Chart.js

- **User Management**
  - View all registered users
  - Track event registrations
  - Search and filter functionality

- **Certificate Management**
  - Issue certificates to participants
  - Bulk certificate issuance for completed events
  - Track issued certificates

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure and semantic markup |
| CSS3 | Styling, animations, responsive design |
| JavaScript (ES6+) | Client-side logic and API integration |
| Font Awesome | Icons |
| Google Fonts | Typography (Poppins) |
| Chart.js | Data visualization |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime environment |
| Express.js | Web application framework |
| Mongoose | MongoDB object modeling (ODM) |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB | NoSQL database for data storage |
| MongoDB Compass | Database GUI for development |

### Security & Authentication
| Technology | Purpose |
|------------|---------|
| bcryptjs | Password hashing (10 salt rounds) |
| express-session | Session management |
| CORS | Cross-origin resource sharing |

### Development Tools
| Tool | Purpose |
|------|---------|
| nodemon | Auto-restart during development |
| dotenv | Environment variable management |
| Git | Version control |

---

## 📁 Project Structure

```
EventHub/
│
├── backend/                          # Backend server and API
│   ├── server.js                    # Main entry point
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Environment variables
│   │
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js                  # User model
│   │   ├── Admin.js                 # Admin model
│   │   ├── Event.js                 # Event model
│   │   ├── Registration.js          # Registration model
│   │   └── Certificate.js           # Certificate model
│   │
│   ├── routes/                      # API endpoints
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── registrationRoutes.js
│   │   └── certificateRoutes.js
│   │
│   ├── controllers/                 # Business logic
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   ├── eventController.js
│   │   ├── registrationController.js
│   │   └── certificateController.js
│   │
│   └── middleware/
│       └── authMiddleware.js        # Authentication guards
│
├── frontend/                         # Frontend HTML, CSS, JS
│   ├── index.html                   # Landing page
│   ├── signup.html                  # User/Admin signup
│   ├── login.html                   # User login
│   ├── admin-login.html             # Admin login
│   │
│   ├── user/                        # User pages
│   │   ├── dashboard.html
│   │   ├── browse-events.html
│   │   ├── event-detail.html
│   │   ├── my-events.html
│   │   ├── upcoming-events.html
│   │   └── certificates.html
│   │
│   ├── css/                         # Stylesheets
│   │   ├── style.css
│   │   ├── admin-style.css
│   │   ├── admin-sidebar.css
│   │   └── admin-charts.css
│   │
│   └── js/                          # JavaScript files
│       ├── config.js                # API configuration
│       ├── utils.js                 # Utility functions
│       ├── signup.js
│       ├── login-auth.js
│       ├── user-dashboard.js
│       ├── admin-auth.js
│       └── [other JS files]
│
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/ashakumbhar08/event-management.git
cd event-management
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Start MongoDB
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Windows
# Start MongoDB service from Services

# Linux
sudo systemctl start mongod
```

### Step 4: Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/eventhub
SESSION_SECRET=your_secret_key_here
```

### Step 5: Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### Step 6: Access the Application
Open your browser and navigate to:
```
http://localhost:5001
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | 5001 |
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/eventhub |
| `SESSION_SECRET` | Secret key for session encryption | (required) |

### MongoDB Setup

#### Local Development
```bash
# Start MongoDB
mongod

# Connect to MongoDB shell
mongosh

# Use eventhub database
use eventhub

# View collections
show collections
```

#### Production (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

---

## 💻 Usage

### Demo Credentials

#### Admin Access
```
Email: admin@eventhub.com
Password: admin123
```

#### User Access
Create a new account via the signup page or use any account you create.

### User Workflow
1. Visit the landing page
2. Sign up for a new account
3. Log in with credentials
4. Browse available events
5. Register for events
6. View registered events in "My Events"
7. Check certificates in "Certificates" page

### Admin Workflow
1. Log in with admin credentials
2. View dashboard statistics
3. Create new events
4. Manage existing events (edit/delete)
5. View user registrations
6. Issue certificates
7. Analyze data in analytics dashboard

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### User Authentication
```http
POST   /api/users/signup      # Create new user account
POST   /api/users/login       # Authenticate user
POST   /api/users/logout      # End user session
GET    /api/users/me          # Get current user info (protected)
```

#### Admin Authentication
```http
POST   /api/admins/signup     # Create admin account
POST   /api/admins/login      # Authenticate admin
POST   /api/admins/logout     # End admin session
GET    /api/admins/me         # Get current admin info (protected)
```

### Event Endpoints
```http
GET    /api/events            # Get all events (public)
GET    /api/events/:id        # Get single event (public)
POST   /api/events            # Create event (admin only)
PUT    /api/events/:id        # Update event (admin only)
DELETE /api/events/:id        # Delete event (admin only)
GET    /api/events/stats      # Get event statistics (admin only)
```

### Registration Endpoints
```http
POST   /api/registrations                    # Register for event (user only)
GET    /api/registrations/my                 # Get user's registrations (user only)
DELETE /api/registrations/:eventId           # Cancel registration (user only)
GET    /api/registrations/event/:eventId     # Get event registrations (admin only)
GET    /api/registrations/stats              # Get registration statistics (admin only)
```

### Certificate Endpoints
```http
GET    /api/certificates/my                  # Get user's certificates (user only)
POST   /api/certificates                     # Issue certificate (admin only)
POST   /api/certificates/event/:eventId      # Issue certificates for event (admin only)
GET    /api/certificates                     # Get all certificates (admin only)
DELETE /api/certificates/:id                 # Delete certificate (admin only)
```

### Example API Request
```javascript
// User Login
fetch('http://localhost:5001/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  }),
  credentials: 'include'  // Important: sends session cookie
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🗄️ Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date (default: now)
}
```

#### admins
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  isDemo: Boolean (default: false),
  createdAt: Date (default: now)
}
```

#### events
```javascript
{
  _id: ObjectId,
  title: String (required),
  category: String (enum: Tech, Cultural, Sports, Workshop, Other),
  date: Date (required),
  time: String (required),
  location: String (required),
  description: String (required),
  maxParticipants: Number (default: 100),
  status: String (enum: Upcoming, Active, Completed),
  createdBy: String (default: "Admin"),
  createdAt: Date (default: now)
}
```

#### registrations
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  eventId: ObjectId (ref: Event, required),
  userName: String (required),
  userEmail: String (required),
  eventTitle: String (required),
  registeredAt: Date (default: now),
  // Unique index: userId + eventId
}
```

#### certificates
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  eventId: ObjectId (ref: Event, required),
  userName: String (required),
  eventTitle: String (required),
  completedDate: Date (required),
  issuedAt: Date (default: now),
  // Unique index: userId + eventId
}
```

---

## 🔐 Authentication Flow

### User Registration
1. User submits signup form
2. Frontend validates input
3. Backend checks if email exists
4. Password hashed with bcrypt (10 rounds)
5. User saved to MongoDB
6. Success response sent to frontend

### User Login
1. User submits login credentials
2. Backend finds user by email
3. Password compared with stored hash
4. Session created and stored
5. Session cookie sent to browser
6. User redirected to dashboard

### Session Management
- Sessions stored in memory (express-session)
- Session cookie sent with every request
- 24-hour session expiry
- HttpOnly cookie flag for security

### Protected Routes
- Middleware checks session before allowing access
- Unauthorized requests return 401 status
- Frontend redirects to login if unauthorized

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing-page.png)
*Modern landing page with hero section and features*

### User Dashboard
![User Dashboard](screenshots/user-dashboard.png)
*Personalized dashboard with statistics and upcoming events*

### Event Browsing
![Browse Events](screenshots/browse-events.png)
*Browse and filter available events*

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
*Admin dashboard with analytics and statistics*

### Event Management
![Manage Events](screenshots/manage-events.png)
*Create, edit, and delete events*

### Analytics
![Analytics](screenshots/analytics.png)
*Real-time analytics with Chart.js*

> **Note**: Add actual screenshots to the `screenshots/` directory

---

## 🚀 Future Enhancements

### Short-term
- [ ] Email notifications for event registration
- [ ] Forgot password functionality
- [ ] User profile editing
- [ ] Event image upload
- [ ] QR code for event check-in
- [ ] Export certificates as PDF

### Medium-term
- [ ] Payment gateway integration
- [ ] Event calendar view
- [ ] Social media sharing
- [ ] Event reviews and ratings
- [ ] Advanced search filters
- [ ] Push notifications

### Long-term
- [ ] Mobile application (React Native)
- [ ] Real-time chat support
- [ ] AI-based event recommendations
- [ ] Google Calendar integration
- [ ] Multi-language support
- [ ] Video conferencing for virtual events
- [ ] Blockchain-based certificate verification

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code structure
- Test before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Asha Kumbhar**
- GitHub: [@ashakumbhar08](https://github.com/ashakumbhar08)
- Project: [Event Management System](https://github.com/ashakumbhar08/event-management)

---

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Chart.js for data visualization
- MongoDB for database
- Express.js community

---

## 📊 Project Statistics

- **Total Files**: 70+
- **Lines of Code**: 5,000+
- **API Endpoints**: 24
- **Database Collections**: 5
- **Development Time**: 10-11 hours

---

## 🐛 Known Issues

- Session expires after 24 hours (requires re-login)
- No email verification during signup
- Limited search functionality

Report issues at: [GitHub Issues](https://github.com/ashakumbhar08/event-management/issues)

---

## 📞 Support

For support, open an issue on GitHub.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for learning and education

</div>
