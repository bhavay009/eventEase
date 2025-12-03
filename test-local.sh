#!/bin/bash

echo "🧪 Testing EventEase Locally"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Setting up database...${NC}"
cd backend

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Check if migrations needed
echo ""
echo -e "${YELLOW}Step 2: Running database migrations...${NC}"
echo "This will create all tables in your database."
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma migrate dev --name local_test
    echo -e "${GREEN}✅ Migrations complete!${NC}"
else
    echo "Skipping migrations."
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Now start the servers:"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd backend && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"

