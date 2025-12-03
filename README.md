# EventEase - Event & Booking Management System

A full-stack event management platform built with React, Node.js, Express, and MySQL.

## Features

- 🔐 **Authentication**: JWT-based login/signup with role-based access (Admin/Attendee)
- 📅 **Event Management**: Create, view, edit, and delete events (Admin)
- 🎫 **Booking System**: Book tickets for events with seat selection
- 📊 **Analytics Dashboard**: Comprehensive analytics for admins
- 🎨 **Modern UI**: Built with React and TailwindCSS
- 🔒 **Protected Routes**: Route protection based on authentication and roles

## Tech Stack

### Frontend
- React 18
- React Router
- TailwindCSS
- Recharts (for analytics)
- Vite

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL (compatible with PlanetScale, Railway)
- JWT Authentication
- bcryptjs for password hashing
- express-validator for validation

## Project Structure

```
eventEase/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── bookingController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── role.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── analyticsRoutes.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
└── mysql/
    └── schema.sql
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL database (or use PlanetScale/Railway)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database URL and JWT secret:
```env
DATABASE_URL="mysql://user:password@localhost:3306/eventease"
JWT_SECRET="your-secret-key"
PORT=3001
```

5. Run Prisma migrations:
```bash
npx prisma migrate dev
```

6. Generate Prisma client:
```bash
npx prisma generate
```

7. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL:
```env
VITE_API_URL=http://localhost:3001
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events (public)
- `GET /api/events/:id` - Get event by ID (public)
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Bookings
- `POST /api/bookings` - Create booking (Authenticated)
- `GET /api/bookings/:id` - Get booking by ID (Authenticated)
- `GET /api/bookings/user/:id` - Get user bookings (Authenticated)

### Analytics
- `GET /api/analytics` - Get analytics data (Admin only)

## Deployment

### Backend (Railway)

1. Connect your repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically deploy

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Set environment variables (VITE_API_URL)
3. Vercel will automatically deploy

## Default Admin Account

To create an admin account, you can either:
1. Update a user's role directly in the database: `UPDATE User SET role='admin' WHERE email='your-email@example.com';`
2. Or sign up normally and manually change the role in the database

## License

MIT
