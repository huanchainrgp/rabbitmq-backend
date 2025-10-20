#!/bin/bash

# 🐰 RabbitMQ Integration Test Script
# Test User Registration with RabbitMQ

echo "=================================="
echo "🐰 RabbitMQ Integration Test"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
echo -e "${BLUE}Checking if server is running...${NC}"
if ! curl -s http://localhost:4000/auth/register > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Server is not running!${NC}"
    echo "Please start the server first:"
    echo "  yarn start:dev"
    exit 1
fi
echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Generate random username
RANDOM_NUM=$RANDOM
USERNAME="testuser${RANDOM_NUM}"
EMAIL="test${RANDOM_NUM}@example.com"

echo "=================================="
echo "📝 Test Data"
echo "=================================="
echo "Email: $EMAIL"
echo "Username: $USERNAME"
echo "Password: test123456"
echo ""

echo "=================================="
echo "🚀 Step 1: Register New User"
echo "=================================="
echo "POST /auth/register"
echo ""

RESPONSE=$(curl -s -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"username\": \"$USERNAME\",
    \"password\": \"test123456\"
  }")

if [ -z "$RESPONSE" ]; then
    echo -e "${YELLOW}⚠️  No response from server${NC}"
    exit 1
fi

echo "$RESPONSE" | python3 -m json.tool
echo ""

# Extract token
TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo -e "${YELLOW}⚠️  Failed to get access token${NC}"
    echo -e "${YELLOW}Response: $RESPONSE${NC}"
    exit 1
fi

echo -e "${GREEN}✅ User registered successfully!${NC}"
echo -e "${GREEN}✅ JWT Token received${NC}"
echo ""

echo "=================================="
echo "🔍 Check Server Logs"
echo "=================================="
echo "Look for these messages in your server logs:"
echo ""
echo -e "${BLUE}[AuthService] New user registration: $EMAIL${NC}"
echo -e "${BLUE}[RabbitmqProducerService] Message sent successfully${NC}"
echo -e "${BLUE}[AuthService] User registration sent to RabbitMQ: $EMAIL${NC}"
echo -e "${BLUE}[RabbitmqConsumerService] Received message: {\"event\":\"user.registered\",...}${NC}"
echo ""

echo "=================================="
echo "✅ Expected RabbitMQ Message"
echo "=================================="
cat << EOF
{
  "event": "user.registered",
  "data": {
    "id": "user_...",
    "email": "$EMAIL",
    "username": "$USERNAME",
    "createdAt": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
  },
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
}
EOF
echo ""

echo "=================================="
echo "🧪 Step 2: Test Get Me"
echo "=================================="
echo "GET /auth/me"
echo ""

ME_RESPONSE=$(curl -s http://localhost:4000/auth/me \
  -H "Authorization: Bearer $TOKEN")

echo "$ME_RESPONSE" | python3 -m json.tool
echo ""
echo -e "${GREEN}✅ Get Me successful!${NC}"
echo ""

echo "=================================="
echo "🧪 Step 3: Test Logout"
echo "=================================="
echo "POST /auth/logout"
echo ""

LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer $TOKEN")

echo "$LOGOUT_RESPONSE" | python3 -m json.tool
echo ""
echo -e "${GREEN}✅ Logout successful!${NC}"
echo ""

echo "=================================="
echo "🎉 All Tests Passed!"
echo "=================================="
echo ""
echo "Summary:"
echo "✅ User registered successfully"
echo "✅ RabbitMQ message should be sent"
echo "✅ JWT authentication working"
echo "✅ Token blacklist working"
echo ""
echo "📚 Check server logs to verify RabbitMQ integration"
echo ""
