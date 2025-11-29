# EventEase Deployment Guide

## Step 1: Setup Database (PlanetScale - Free)
1. Go to https://planetscale.com
2. Sign up and create new database named `eventease`
3. Get connection string from dashboard
4. Update your backend .env with the new DATABASE_URL

## Step 2: Deploy Backend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. In backend folder: `vercel`
3. Follow prompts, set environment variables:
   - DATABASE_URL: (your PlanetScale connection string)
4. Note the deployed URL

## Step 3: Deploy Frontend (Vercel)
1. Update frontend/.env with your backend URL
2. In frontend folder: `vercel`
3. Set environment variable:
   - VITE_API_URL: (your backend Vercel URL)

## Alternative: Deploy to Railway (Easier)
1. Go to https://railway.app
2. Connect GitHub repo
3. Deploy both backend and frontend
4. Add MySQL database service
5. Set environment variables

## Quick Commands:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend && vercel

# Deploy frontend  
cd frontend && vercel
```