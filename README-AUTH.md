# Auth Server - RabbitMQ Backend

🔐 **Authentication Server** được xây dựng với NestJS, tích hợp RabbitMQ để publish events khi user đăng ký.

## ✨ Tính năng

- ✅ **Đăng ký (Register)** - Tạo tài khoản mới
- ✅ **Đăng nhập (Login)** - Xác thực và nhận JWT token
- ✅ **Get Me** - Lấy thông tin user hiện tại (protected)
- ✅ **Logout** - Đăng xuất và blacklist token
- 🐰 **RabbitMQ Integration** - Tự động push thông tin user lên queue khi đăng ký
- 🔒 **JWT Authentication** - Bảo mật với JWT tokens
- ✨ **Validation** - Validate dữ liệu đầu vào với class-validator
- 🔐 **Password Hashing** - Mã hóa mật khẩu với bcrypt

## 📁 Cấu trúc Project

```
src/
├── auth/                      # Authentication module
│   ├── dto/                   # Data Transfer Objects
│   │   ├── register.dto.ts
│   │   ├── login.dto.ts
│   │   └── auth-response.dto.ts
│   ├── guards/                # Auth guards
│   │   └── jwt-auth.guard.ts
│   ├── strategies/            # Passport strategies
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts     # Auth endpoints
│   ├── auth.service.ts        # Auth business logic
│   └── auth.module.ts
├── users/                     # Users module
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.service.ts       # User management
│   └── users.module.ts
├── rabbitmq/                  # RabbitMQ integration
│   ├── rabbitmq-producer.service.ts
│   ├── rabbitmq-consumer.service.ts
│   └── rabbitmq.module.ts
├── config/                    # Configuration
│   ├── jwt.config.ts
│   └── rabbitmq.config.ts
├── common/                    # Shared utilities
│   └── decorators/
│       └── current-user.decorator.ts
├── app.module.ts
└── main.ts
```

## 🚀 Cài đặt

```bash
# Clone repository
git clone <your-repo>
cd rabbitmq-backend

# Install dependencies
yarn install

# Generate TypeScript SDKs (for Yarn PnP)
yarn dlx @yarnpkg/sdks vscode
```

## ⚙️ Configuration

Tạo file `.env` trong thư mục root:

```env
# Server
NODE_PORT=4000

# RabbitMQ
RABBITMQ_URL=amqps://your-rabbitmq-url
RABBITMQ_EXCHANGE_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_EXCHANGE_VALIDATE_JSON=topic_validateJSON
RABBITMQ_ROUTING_KEY_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_ROUTING_KEY_VALIDATE_JSON=topic_validateJSON
RABBITMQ_QUEUE_VALIDATE_JSON=topic_validateJSON

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
```

## 🏃 Chạy ứng dụng

```bash
# Development mode
yarn start:dev
# hoặc
yarn dev

# Production mode
yarn build
yarn start:prod

# Debug mode
yarn start:debug
```

Server sẽ chạy tại: **http://localhost:4000**

## 📡 API Endpoints

### 1️⃣ Đăng ký (Register)

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Phải là email hợp lệ
- `username`: Tối thiểu 3 ký tự
- `password`: Tối thiểu 6 ký tự

**Response:** `201 Created`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1729363200000_abc123",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**RabbitMQ Event:** Khi đăng ký thành công, thông tin user sẽ được push lên queue:
```json
{
  "event": "user.registered",
  "data": {
    "id": "user_1729363200000_abc123",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2025-10-19T21:00:00.000Z"
  },
  "timestamp": "2025-10-19T21:00:00.000Z"
}
```

**cURL:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "password123"
  }'
```

---

### 2️⃣ Đăng nhập (Login)

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "password123"
}
```

**Note:** `emailOrUsername` có thể là email hoặc username

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1729363200000_abc123",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "user@example.com",
    "password": "password123"
  }'
```

---

### 3️⃣ Get Me (Lấy thông tin user)

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "user_1729363200000_abc123",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4️⃣ Logout (Đăng xuất)

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

**Note:** Token sẽ được thêm vào blacklist và không thể sử dụng lại

**cURL:**
```bash
curl -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔒 Authentication Flow

```
1. User đăng ký → POST /auth/register
   ↓
2. Server tạo user + hash password
   ↓
3. Push event lên RabbitMQ
   ↓
4. Trả về JWT token
   ↓
5. User sử dụng token cho các request tiếp theo
   ↓
6. Token được verify bởi JwtAuthGuard
```

## 🛡️ Security Features

- ✅ **Password Hashing**: Sử dụng bcrypt với salt rounds = 10
- ✅ **JWT Tokens**: Token expire sau 24h (có thể config)
- ✅ **Token Blacklist**: Token bị vô hiệu sau logout
- ✅ **Input Validation**: Validate tất cả input với class-validator
- ✅ **Guard Protection**: Protected routes với JwtAuthGuard

## 📊 Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email or username already exists",
  "error": "Conflict"
}
```

## 🐰 RabbitMQ Integration

### Consumer Service
Consumer tự động lắng nghe messages từ queue khi app khởi động:

```typescript
// Logs trong console
[RabbitmqConsumerService] Consumer connected successfully
[RabbitmqConsumerService] Received message: {"event":"user.registered",...}
```

### Producer Service
Mỗi khi user đăng ký, event được push lên RabbitMQ:

```typescript
{
  event: 'user.registered',
  data: {
    id: string,
    email: string,
    username: string,
    createdAt: Date
  },
  timestamp: Date
}
```

## 🧪 Testing

### Sử dụng cURL

```bash
# 1. Đăng ký user mới
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"test123"}'

# 2. Lưu token từ response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Get user info
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Logout
curl -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### Sử dụng Postman

1. Import collection hoặc tạo requests thủ công
2. Sau khi login/register, copy `accessToken`
3. Thêm vào Headers: `Authorization: Bearer <token>`
4. Test các protected endpoints

## 📝 Development Notes

### In-Memory Storage
Hiện tại users được lưu trong memory (array). Trong production, nên sử dụng database:
- MongoDB + Mongoose
- PostgreSQL + TypeORM
- MySQL + Prisma

### Token Blacklist
Token blacklist cũng đang dùng Set trong memory. Trong production, nên dùng:
- Redis (recommended)
- Database table

### Extend Features
Có thể thêm:
- Refresh tokens
- Email verification
- Password reset
- Role-based access control (RBAC)
- OAuth2 integration
- Rate limiting
- API documentation với Swagger

## 🔧 Troubleshooting

### Build errors
```bash
yarn dlx @yarnpkg/sdks vscode
yarn build
```

### Port already in use
```bash
lsof -ti:4000 | xargs kill -9
```

### RabbitMQ connection issues
- Kiểm tra `RABBITMQ_URL` trong `.env`
- Check CloudAMQP dashboard
- Xem logs trong console

## 📚 Technologies

- **NestJS** - Framework
- **TypeScript** - Language
- **Passport + JWT** - Authentication
- **bcrypt** - Password hashing
- **class-validator** - Input validation
- **RabbitMQ** - Message queue
- **amqplib** - RabbitMQ client

## 🎯 Migration từ Express

Project này đã được migrate từ Express.js sang NestJS với những cải tiến:
- ✅ Full TypeScript support
- ✅ Modular architecture
- ✅ Dependency injection
- ✅ Built-in validation
- ✅ JWT authentication
- ✅ Better error handling
- ✅ RabbitMQ integration

## 📄 License

ISC

---

**Version:** 2.0.0 - Auth Server  
**Last Updated:** October 19, 2025
