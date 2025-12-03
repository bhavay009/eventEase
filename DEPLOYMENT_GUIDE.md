# Deployment Guide for EventEase

Since you already have deployments on Vercel (frontend), Render (backend), and Railway (database), follow these steps to update your existing deployments.

## Step 1: Update Database Schema (Railway MySQL)

Your database already exists, but you need to run migrations for the new schema.

### Option A: Using Prisma Migrate (Recommended)

1. **Get your Railway MySQL connection string:**
   - Go to Railway dashboard → Your MySQL service
   - Copy the connection string (it should look like: `mysql://user:password@host:port/database`)

2. **Update your local `.env` file:**
   ```bash
   cd backend
   ```
   
   Create/update `.env`:
   ```env
   DATABASE_URL="your-railway-mysql-connection-string"
   JWT_SECRET="your-secret-key-change-this"
   PORT=3001
   ```

3. **Run Prisma migrations locally:**
   ```bash
   cd backend
   npx prisma migrate dev --name update_schema
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

### Option B: Manual SQL (If Prisma migrate doesn't work)

Run the SQL from `mysql/schema.sql` in your Railway MySQL database:

1. Go to Railway → Your MySQL service → Connect → Query
2. Copy and run the SQL statements from `mysql/schema.sql`

**Important:** If tables already exist, you may need to either:
- Drop existing tables (⚠️ this will delete data)
- Or manually alter tables to add missing columns

## Step 2: Update Backend on Render

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Restructure project with React frontend and improved backend"
   git push origin master
   ```

2. **Update Render service environment variables:**
   - Go to Render dashboard → Your backend service → Environment
   - Add/Update these variables:
     ```
     DATABASE_URL=your-railway-mysql-connection-string
     JWT_SECRET=your-secret-key-make-it-strong
     NODE_ENV=production
     PORT=3001
     ```

3. **Update Render build settings:**
   - Go to Render → Your service → Settings
   - Build Command: `cd backend && npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `cd backend && npm start`

4. **Deploy:**
   - Render will auto-deploy from your GitHub push, OR
   - Click "Manual Deploy" → "Deploy latest commit"

## Step 3: Update Frontend on Vercel

1. **Update Vercel environment variables:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add/Update:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
   (Replace with your actual Render backend URL)

2. **Update Vercel build settings:**
   - Go to Vercel → Your project → Settings → General
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy:**
   - Push to GitHub (Vercel auto-deploys), OR
   - Go to Vercel dashboard → Deployments → Redeploy

## Step 4: Verify Everything Works

1. **Check backend health:**
   - Visit: `https://your-backend.onrender.com/`
   - Should return: `{ message: 'EventEase Backend API is running!' }`

2. **Test API endpoints:**
   - Try signing up: `POST https://your-backend.onrender.com/api/auth/signup`
   - Try getting events: `GET https://your-backend.onrender.com/api/events`

3. **Check frontend:**
   - Visit your Vercel URL
   - Should load the React app
   - Try logging in/signing up

## Step 5: Database Migration Notes

Since you're updating an existing database:

### If you have existing data:

1. **Backup first!** Export your current database from Railway

2. **Check what tables/columns exist:**
   ```sql
   SHOW TABLES;
   DESCRIBE User;
   DESCRIBE Event;
   ```

3. **Add missing columns if needed:**
   ```sql
   -- If User table exists but missing 'role' column
   ALTER TABLE User ADD COLUMN role VARCHAR(50) DEFAULT 'attendee';
   
   -- If Event table exists but missing columns
   ALTER TABLE Event ADD COLUMN total_seats INT;
   ALTER TABLE Event ADD COLUMN image_url VARCHAR(500);
   ```

4. **Create missing tables:**
   - If `Session` table doesn't exist, create it
   - If `Booking` table doesn't exist, create it

### If starting fresh:

Just run Prisma migrations as described in Step 1.

## Step 6: Create Admin User (Important!)

After deployment, create an admin user:

1. **Sign up normally** through your frontend
2. **Then run this SQL in Railway MySQL:**
   ```sql
   UPDATE User SET role = 'admin' WHERE email = 'your-admin-email@example.com';
   ```

Or create directly via SQL:
```sql
INSERT INTO User (email, password, name, role) 
VALUES ('admin@example.com', '$2a$10$hashedpasswordhere', 'Admin User', 'admin');
```
(Use bcrypt to hash the password first, or use your signup endpoint then update role)

## Common Issues & Solutions

### Issue: "Table doesn't exist"
**Solution:** Run Prisma migrations or manually create tables using `mysql/schema.sql`

### Issue: "Prisma Client not generated"
**Solution:** In Render build command, ensure `npx prisma generate` runs before `npm start`

### Issue: "CORS errors"
**Solution:** Check that your Render backend URL is in the CORS allowed origins in `backend/server.js`

### Issue: "Connection refused"
**Solution:** 
- Verify `DATABASE_URL` in Render environment variables
- Check Railway MySQL is accessible (not on localhost)
- Verify MySQL service is running in Railway

### Issue: "Frontend can't connect to backend"
**Solution:**
- Verify `VITE_API_URL` in Vercel environment variables
- Make sure backend is deployed and accessible
- Check browser console for actual API calls

## Quick Checklist

- [ ] Database schema updated (Prisma migrations or SQL)
- [ ] Railway MySQL connection string copied
- [ ] Render backend environment variables set
- [ ] Render build/start commands updated
- [ ] Backend deployed on Render
- [ ] Vercel frontend environment variables set
- [ ] Frontend deployed on Vercel
- [ ] Admin user created
- [ ] Tested login/signup
- [ ] Tested creating events (admin)
- [ ] Tested booking events (user)

## Need Help?

If you encounter issues:
1. Check Render logs: Render → Your service → Logs
2. Check Vercel logs: Vercel → Your deployment → Functions/Logs
3. Check Railway logs: Railway → Your MySQL service → Logs
4. Check browser console for frontend errors

