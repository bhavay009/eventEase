# Quick Deployment Steps for EventEase

Since you already have deployments on **Vercel (frontend)**, **Render (backend)**, and **Railway (database)**, here's what to do:

## 🚀 Quick Steps

### 1. Database Migration (Railway MySQL)

**Option A: Using Prisma (Recommended)**
```bash
# In your local project
cd backend
# Set DATABASE_URL in .env to your Railway MySQL connection string
npx prisma migrate deploy
npx prisma generate
```

**Option B: Manual SQL**
- Go to Railway → Your MySQL service → Connect → Query
- Run the SQL from `mysql/schema.sql`
- Or manually add missing columns if tables exist

### 2. Update Backend on Render

**Update Environment Variables:**
Go to Render Dashboard → Your backend service → Environment:
```
DATABASE_URL=your-railway-mysql-connection-string
JWT_SECRET=your-strong-secret-key-here
NODE_ENV=production
```

**Update Build Command:**
Render → Settings → Build Command:
```
cd backend && npm install && npx prisma generate && npx prisma migrate deploy
```

**Update Start Command:**
```
cd backend && npm start
```

**Then deploy:**
```bash
git add .
git commit -m "Update to new structure"
git push origin master
```
Render will auto-deploy!

### 3. Update Frontend on Vercel

**Update Environment Variable:**
Vercel Dashboard → Your project → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-name.onrender.com
```
(Replace with your actual Render backend URL)

**Update Build Settings:**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

**Then deploy:**
- Push to GitHub (auto-deploys), OR
- Vercel Dashboard → Deployments → Redeploy

### 4. Create Admin User

After everything is deployed, create an admin:

1. Sign up through your frontend
2. Run this SQL in Railway:
```sql
UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
```

## ✅ Verify Deployment

1. **Backend health check:**
   - Visit: `https://your-backend.onrender.com/`
   - Should see: `{"message":"EventEase Backend API is running!"}`

2. **Test frontend:**
   - Visit your Vercel URL
   - Try signing up and logging in

3. **Test API:**
   - Check browser console for API calls
   - Should connect to your Render backend

## 🔧 If Something Breaks

**Backend Issues:**
- Check Render logs: Render Dashboard → Your service → Logs
- Verify DATABASE_URL is correct
- Check Prisma client is generated

**Frontend Issues:**
- Check Vercel logs
- Verify VITE_API_URL points to Render backend
- Check browser console for errors

**Database Issues:**
- Check Railway MySQL logs
- Verify connection string format
- Test connection manually

## 📝 Important Notes

- **CORS**: Updated to allow Vercel frontend + Render backend
- **Database**: Make sure to run migrations or update schema manually
- **Environment Variables**: Must be set in both Render and Vercel
- **Build Commands**: Updated for Prisma migrations

That's it! Your project should be live with the new structure! 🎉

