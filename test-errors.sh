#!/bin/bash

echo "=== Testing Standardized Error Responses ==="
echo ""

# Test 1: Successful registration
echo "1. Testing successful registration..."
curl -s -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","username":"newuser","password":"password123"}' | python3 -m json.tool
echo ""
echo ""

# Test 2: Duplicate email (USER_2002)
echo "2. Testing duplicate email error (USER_2002)..."
curl -s -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","username":"anotheruser","password":"password123"}' | python3 -m json.tool
echo ""
echo ""

# Test 3: Invalid credentials (AUTH_1001)
echo "3. Testing invalid credentials error (AUTH_1001)..."
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"newuser@test.com","password":"wrongpassword"}' | python3 -m json.tool
echo ""
echo ""

# Test 4: Validation error
echo "4. Testing validation error..."
curl -s -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","username":"ab","password":"123"}' | python3 -m json.tool
echo ""
echo ""

# Test 5: Successful login
echo "5. Testing successful login..."
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"newuser@test.com","password":"password123"}' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['access_token'])")
echo "Token obtained: ${TOKEN:0:50}..."
echo ""

# Test 6: Get user profile with token
echo "6. Testing GET /me with valid token..."
curl -s -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""
echo ""

# Test 7: Get user profile without token (401)
echo "7. Testing GET /me without token (AUTH_1003)..."
curl -s -X GET http://localhost:4000/auth/me | python3 -m json.tool
echo ""
echo ""

# Test 8: Logout
echo "8. Testing logout..."
curl -s -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""
echo ""

# Test 9: Use token after logout (AUTH_1004)
echo "9. Testing token after logout (AUTH_1004)..."
curl -s -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

echo ""
echo "=== Testing Complete ==="
