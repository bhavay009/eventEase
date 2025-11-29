# Deployment Instructions

## Deploy on Render

### Backend:
1. Go to https://render.com
2. Connect GitHub repo
3. Create Web Service
4. Settings:
   - Build Command: `cd backend && npm install && npx prisma generate`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `DATABASE_URL`: Your database connection string

### Frontend:
1. Create Static Site
2. Settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Environment Variables:
     - `VITE_API_URL`: Your backend Render URL

## Deploy on Vercel

### Backend:
```bash
cd backend
vercel
```
Environment Variables:
- `DATABASE_URL`: Your database connection string

### Frontend:
```bash
cd frontend
vercel
```
Environment Variables:
- `VITE_API_URL`: Your backend Vercel URL

## Database Options:
1. **Railway**: Free MySQL (easiest)
2. **PlanetScale**: Free MySQL
3. **Render PostgreSQL**: Free tier available