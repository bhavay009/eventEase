# Adding Events to EventEase

Since you have no events visible, here are two ways to add events:

## Option 1: Seed Sample Events (Quick & Easy)

Run the seed script to add 6 sample events:

```bash
cd backend
node seedEvents.js
```

This will create 6 sample events that you can see immediately!

## Option 2: Create Events via Admin Panel

1. **Make yourself an admin:**
   - First, sign up normally through the frontend
   - Then run this SQL in your MySQL database:
   ```sql
   UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

2. **Access Admin Panel:**
   - Logout and login again (to refresh your role)
   - Go to: `http://localhost:5173/admin/events`
   - Click "Create Event" button
   - Fill in the form and save

3. **Required fields:**
   - Title
   - Description
   - Date & Time
   - Location
   - Price
   - Total Seats
   - Image URL (optional)

## Option 3: Create via API (for testing)

You can also create events directly via API if you're an admin:

```bash
# First get your JWT token by logging in
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'

# Copy the token from response, then:
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Test Event",
    "description": "This is a test event",
    "date": "2024-12-20T10:00:00",
    "location": "Test Location",
    "price": 50,
    "total_seats": 100,
    "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
  }'
```

## Recommended: Use Option 1 (Seed Script)

The easiest way is to run:
```bash
cd backend
node seedEvents.js
```

Then refresh your frontend and you should see 6 events!

