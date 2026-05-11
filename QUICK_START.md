# 🚀 Quick Start Guide

## Push to GitHub (3 Steps)

### Step 1: Create Repository on GitHub
1. Go to: https://github.com/AshaaKumbhar
2. Click **"+"** → **"New repository"**
3. Name: `EventHub`
4. Description: "A full-stack event management platform with role-based access control"
5. Visibility: **Public**
6. **DO NOT** initialize with README
7. Click **"Create repository"**

### Step 2: Push Your Code
```bash
git push -u origin main
```

### Step 3: Verify
Visit: https://github.com/AshaaKumbhar/EventHub

---

## Run Locally (4 Steps)

### Step 1: Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Or manually
mongod
```

### Step 2: Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env if needed (default values work for local development)
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Server
```bash
npm run dev
```

Visit: http://localhost:5001

---

## Demo Credentials

### Admin Login
- Email: `admin@eventhub.com`
- Password: `admin123`
- URL: http://localhost:5001/admin-login.html

### User Login
- Create account at: http://localhost:5001/signup.html
- Or use any account you create

---

## Project URLs

- **GitHub**: https://github.com/AshaaKumbhar/EventHub
- **Profile**: https://github.com/AshaaKumbhar
- **Local**: http://localhost:5001

---

## Key Files

- `README.md` - Complete documentation
- `backend/.env.example` - Environment template
- `backend/server.js` - Backend entry point
- `frontend/index.html` - Landing page
- `GITHUB_PUSH_INSTRUCTIONS.md` - Detailed push guide

---

## Tech Stack

**Frontend**: HTML5, CSS3, JavaScript  
**Backend**: Node.js, Express.js  
**Database**: MongoDB  
**Auth**: bcrypt + express-session

---

## Need Help?

1. Read `GITHUB_PUSH_INSTRUCTIONS.md` for detailed push instructions
2. Read `DEPLOYMENT_CHECKLIST.md` for deployment guide
3. Read `README.md` for complete documentation
4. Check `CONTEXT_TRANSFER_COMPLETION.md` for status summary

---

**Status**: ✅ Ready to push to GitHub!
