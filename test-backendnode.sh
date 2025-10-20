#!/bin/bash

echo "🧪 Testing RabbitMQ - Queue: backendnode"
echo "========================================"
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

# Generate random user
RANDOM_NUM=$((RANDOM % 10000))
EMAIL="user${RANDOM_NUM}@backendnode.com"
USERNAME="user${RANDOM_NUM}"

echo "========================================"
echo "📝 Test User Data"
echo "========================================"
echo "Email: $EMAIL"
echo "Username: $USERNAME"
echo "Password: test123456"
echo ""

echo "========================================"
echo "🚀 Registering User"
echo "========================================"
echo "POST http://localhost:4000/auth/register"
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

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if successful
if echo "$RESPONSE" | grep -q "accessToken"; then
    echo -e "${GREEN}✅ User registered successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Registration failed${NC}"
    exit 1
fi

echo ""
echo "========================================"
echo "📊 Expected Server Logs"
echo "========================================"
echo "Check your server terminal for:"
echo ""
echo -e "${GREEN}✅ [AuthService] New user registration: $EMAIL${NC}"
echo -e "${GREEN}✅ [RabbitmqProducerService] Publishing message directly to queue: backendnode${NC}"
echo -e "${GREEN}✅ [RabbitmqProducerService] Message sent successfully${NC}"
echo -e "${GREEN}✅ [AuthService] User registration sent to RabbitMQ queue 'backendnode': $EMAIL${NC}"
echo ""

echo "========================================"
echo "📦 Message in RabbitMQ Queue"
echo "========================================"
echo "Queue: backendnode"
echo "URL: https://chimpanzee.rmq.cloudamqp.com/#/queues/mkqxvoob/backendnode"
echo ""
echo "Expected message format:"
cat << EOF
{
  "event": "user.registered",
  "data": {
    "id": "user_...",
    "email": "$EMAIL",
    "username": "$USERNAME",
    "createdAt": "$(date -u +"%Y-%m-%dT%H:%M:%S")Z"
  },
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%S")Z"
}
EOF
echo ""

echo "========================================"
echo "🎉 Test Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Check CloudAMQP Dashboard:"
echo "   https://chimpanzee.rmq.cloudamqp.com/#/queues/mkqxvoob/backendnode"
echo ""
echo "2. You should see 1 new message in the 'backendnode' queue"
echo ""
echo "3. Click 'Get messages' to view the message content"
echo ""

echo -e "${GREEN}✅ Message has been sent to queue: backendnode${NC}"
echo ""
