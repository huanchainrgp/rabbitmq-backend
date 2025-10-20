#!/bin/bash

echo "🚀 Testing RabbitMQ Integration on User Registration"
echo "===================================================="
echo ""

# Generate random user
RANDOM_NUM=$((RANDOM % 10000))
EMAIL="user${RANDOM_NUM}@test.com"
USERNAME="user${RANDOM_NUM}"

echo "📝 Creating user:"
echo "   Email: $EMAIL"
echo "   Username: $USERNAME"
echo ""

echo "🔥 Sending POST request to /auth/register..."
echo ""

# Make the request
RESPONSE=$(curl -s -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"username\":\"$USERNAME\",\"password\":\"test123456\"}")

echo "✅ Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

echo "===================================================="
echo "📊 Check your server logs for these messages:"
echo ""
echo "   [AuthService] New user registration: $EMAIL"
echo "   [RabbitmqProducerService] Message sent successfully"
echo "   [AuthService] User registration sent to RabbitMQ: $EMAIL"
echo "   [RabbitmqConsumerService] Received message: {...}"
echo ""
echo "===================================================="
