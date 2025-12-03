#!/bin/bash

echo "🚀 EventEase Local Setup Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Backend Setup
echo -e "${YELLOW}Step 1: Setting up Backend...${NC}"
cd backend

# Check if .env exists and has DATABASE_URL
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env and add your DATABASE_URL${NC}"
else
    if grep -q "DATABASE_URL" .env && ! grep -q "mysql://user:password" .env; then
        echo "✅ .env file exists with DATABASE_URL"
    else
        echo -e "${YELLOW}⚠️  Please update backend/.env with your Railway MySQL DATABASE_URL${NC}"
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "Running database migrations..."
echo -e "${YELLOW}⚠️  Make sure your DATABASE_URL is correct in .env before proceeding${NC}"
read -p "Continue with migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma migrate dev --name local_setup
else
    echo "Skipping migrations. Run manually: cd backend && npx prisma migrate dev"
fi

cd ..

# Step 2: Frontend Setup
echo ""
echo -e "${YELLOW}Step 2: Setting up Frontend...${NC}"
cd frontend

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "✅ .env file exists"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Make sure backend/.env has your DATABASE_URL from Railway"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend (new terminal): cd frontend && npm run dev"
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend will run on: http://localhost:5173"

