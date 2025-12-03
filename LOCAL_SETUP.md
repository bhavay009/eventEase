# Local Development Setup Guide

Follow these steps to run EventEase on your local machine for testing.

## Prerequisites

- Node.js (v16 or higher) installed
- MySQL database (can use Railway MySQL connection string)
- npm or yarn

## Step 1: Database Setup

You have two options:

### Option A: Use Railway MySQL (Easiest - Recommended)

1. Go to Railway dashboard → Your MySQL service
2. Copy the connection string (DATABASE_URL)
3. You'll use this in Step 2

### Option B: Local MySQL

1. Install MySQL locally
2. Create a database:
   ```sql
   CREATE DATABASE eventease;
   ```
3. Your connection string will be: `mysql://root:password@localhost:3306/eventease`

## Step 2: Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your database URL:**
   ```env
   DATABASE_URL="mysql://user:password@host:port/database"
   JWT_SECRET="your-secret-key-for-local-testing"
   PORT=3001
   ```

5. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev
   ```
   This will create all tables in your database.

6. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

7. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Or if you don't have nodemon:
   ```bash
   node server.js
   ```

   ✅ Backend should be running on `http://localhost:3001`
   ✅ Test it: Visit `http://localhost:3001/` - should see API message

## Step 3: Frontend Setup

1. **Open a NEW terminal window** (keep backend running)

2. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

5. **Edit `.env` file:**
   ```env
   VITE_API_URL=http://localhost:3001
   ```

6. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

   ✅ Frontend should be running on `http://localhost:5173`
   ✅ Browser should open automatically

## Step 4: Test the Application

1. **Sign Up:**
   - Go to `http://localhost:5173/signup`
   - Create a new account

2. **Login:**
   - Go to `http://localhost:5173/login`
   - Login with your credentials

3. **Create Admin User (for testing admin features):**
   ```sql
   -- Connect to your database and run:
   UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

4. **Test Features:**
   - Browse events (Home page)
   - View event details
   - Book an event (as regular user)
   - Create/edit events (as admin)
   - View analytics (as admin)

## Troubleshooting

### Backend Issues

**Error: "Cannot find module"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error: "Prisma Client not generated"**
```bash
npx prisma generate
```

**Error: "Database connection failed"**
- Check your DATABASE_URL in `.env`
- Verify database is accessible
- Test connection string format

**Error: "Port 3001 already in use"**
- Change PORT in `.env` to another number (e.g., 3002)
- Or kill the process using port 3001

### Frontend Issues

**Error: "Cannot find module"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: "API connection failed"**
- Check VITE_API_URL in `.env` is `http://localhost:3001`
- Verify backend is running
- Check browser console for CORS errors

**Port 5173 already in use**
- Vite will automatically use next available port
- Or specify: `npm run dev -- --port 3000`

### Database Issues

**Error: "Table doesn't exist"**
```bash
cd backend
npx prisma migrate dev
```

**Error: "Migration failed"**
- Check database connection
- Verify DATABASE_URL format
- Check Prisma schema for errors

## Quick Commands Reference

### Backend
```bash
cd backend
npm install              # Install dependencies
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma client
npm run dev             # Start dev server
```

### Frontend
```bash
cd frontend
npm install             # Install dependencies
npm run dev            # Start dev server
npm run build          # Build for production
```

## Next Steps

Once everything works locally:
1. Test all features thoroughly
2. Create some test events (as admin)
3. Make some test bookings (as user)
4. Then proceed with deployment (see QUICK_DEPLOY.md)

