# EventEase - Login/Signup System

A simple Node.js application with Express, Prisma, and MySQL for user authentication.

## Setup Instructions

### Prerequisites
- Node.js installed
- MySQL Workbench installed and running
- MySQL server running on localhost:3306

### Database Setup
1. Open MySQL Workbench
2. Create a new database named `eventease`:
   ```sql
   CREATE DATABASE eventease;
   ```

### Backend Setup
1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Update the `.env` file with your MySQL credentials:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/eventease"
   ```
   Replace `username` and `password` with your MySQL credentials.

3. Run database migration:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   Server will run on http://localhost:3000

### Frontend Setup
1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Usage
- Open http://localhost:5173 for login page
- Open http://localhost:5173/signup.html for registration page
- After login, users are redirected to dashboard with:
  - Welcome message with user name
  - Event management cards
  - Profile management
  - Logout functionality
- Backend API endpoints:
  - POST `/signup` - Create new user
  - POST `/login` - Authenticate user

## Project Structure
```
eventEase/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── index.html
    ├── signup.html
    ├── dashboard.html
    ├── style.css
    ├── script.js
    ├── dashboard.js
    ├── package.json
    └── vite.config.js
```