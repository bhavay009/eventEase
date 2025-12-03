# Start EventEase on Localhost

## Quick Start Guide

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```

✅ Backend will run on: `http://localhost:3001`
✅ You should see: "Server running on port 3001"

### Terminal 2: Frontend Server
```bash
cd frontend
npm run dev
```

✅ Frontend will run on: `http://localhost:5173`
✅ Browser will open automatically

---

## Testing Checklist

1. **Check Backend Health:**
   - Visit: `http://localhost:3001/`
   - Should see: `{"message":"EventEase Backend API is running!"}`

2. **Test Frontend:**
   - Visit: `http://localhost:5173`
   - Should see the EventEase homepage

3. **Sign Up:**
   - Click "Sign Up" or visit `/signup`
   - Create a new account

4. **Login:**
   - Login with your credentials
   - Should redirect to dashboard

5. **Browse Events:**
   - Visit `/events` to see all events
   - Click on an event to see details

6. **Admin Features (Optional):**
   - After signing up, make yourself admin:
   ```sql
   -- Connect to your local MySQL and run:
   UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
   - Then you can access:
     - `/admin/events` - Manage events
     - `/admin/analytics` - View analytics

---

## Troubleshooting

### Backend not starting?
- Check if port 3001 is available
- Verify DATABASE_URL in `backend/.env` is correct
- Check if MySQL is running locally

### Frontend not connecting to backend?
- Verify `frontend/.env` has: `VITE_API_URL=http://localhost:3001`
- Make sure backend is running on port 3001
- Check browser console for CORS errors

### Database connection errors?
- Verify MySQL is running: `mysql -u root -p`
- Check DATABASE_URL format in `backend/.env`
- Try: `npx prisma migrate dev` to ensure tables exist

---

## Environment Files

### Backend `.env` (backend/.env)
```
DATABASE_URL="mysql://root:password@localhost:3306/eventease"
JWT_SECRET="my-local-test-secret"
PORT=3001
```

### Frontend `.env` (frontend/.env)
```
VITE_API_URL=http://localhost:3001
```

✅ Both are now configured for localhost testing!

