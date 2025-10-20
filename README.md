# 🚀 NestJS Authentication Server with RabbitMQ Integration

Modern authentication server built with **NestJS**, **JWT**, and **RabbitMQ** message queue.

## ✨ Features

- ✅ **User Authentication** - Register, Login, Logout with JWT
- ✅ **RabbitMQ Integration** - Auto-push user data to message queue on registration
- ✅ **Password Security** - bcrypt hashing
- ✅ **Swagger Documentation** - Interactive API docs at `/api`
- ✅ **TypeScript** - Full type safety
- ✅ **Unit Tests** - Comprehensive test coverage
- ✅ **Validation** - class-validator for request validation

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────▶│ Auth Server  │─────▶│  RabbitMQ   │
│  (Browser)  │◀─────│  (NestJS)    │      │   (Queue)   │
└─────────────┘      └──────────────┘      └─────────────┘
                             │
                             ▼
                      ┌─────────────┐
                      │  Consumer   │
                      │  (Listener) │
                      └─────────────┘
```

## 📋 Prerequisites

- Node.js v22.20.0+
- Yarn 4.10.3+
- RabbitMQ account (CloudAMQP)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment

Create or update `.env` file:

```bash
NODE_PORT=4000
RABBITMQ_URL=amqps://your-rabbitmq-url
RABBITMQ_EXCHANGE_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_EXCHANGE_VALIDATE_JSON=topic_validateJSON
RABBITMQ_ROUTING_KEY_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_ROUTING_KEY_VALIDATE_JSON=topic_validateJSON
RABBITMQ_QUEUE_VALIDATE_JSON=topic_validateJSON

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
```

### 3. Start Server

```bash
# Development mode with hot reload
yarn start:dev

# Production mode
yarn start:prod
```

Server will start at: **http://localhost:4000**

### 4. Access Swagger Documentation

Open your browser: **http://localhost:4000/api**

## 🧪 Testing RabbitMQ Integration

### Quick Test Script

```bash
./quick-test.sh
```

### Manual Test with curl

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "test123456"
  }'
```

### Expected Server Logs

```
[AuthService] New user registration: test@example.com
[RabbitmqProducerService] Message sent successfully
[AuthService] User registration sent to RabbitMQ: test@example.com
[RabbitmqConsumerService] Received message: {
  "event": "user.registered",
  "data": { ... }
}
```

## 📡 API Endpoints

### 🔓 Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### 🔒 Protected Endpoints (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me` | Get current user info |
| POST | `/auth/logout` | Logout user |

## 📦 RabbitMQ Message Format

When a user registers, this message is sent to RabbitMQ:

```json
{
  "event": "user.registered",
  "data": {
    "id": "user_1729360635123_abc",
    "email": "newuser@example.com",
    "username": "newuser",
    "createdAt": "2025-10-19T16:37:15.123Z"
  },
  "timestamp": "2025-10-19T16:37:15.456Z"
}
```

## 🧪 Run Tests

```bash
# Unit tests
yarn test

# Test coverage
yarn test:cov

# E2E tests
yarn test:e2e
```

## 📚 Documentation

- **[RABBITMQ-USER-REGISTRATION.md](RABBITMQ-USER-REGISTRATION.md)** - RabbitMQ integration details
- **[FLOW-DIAGRAM.md](FLOW-DIAGRAM.md)** - Visual flow diagram
- **[RABBITMQ-INTEGRATION.md](RABBITMQ-INTEGRATION.md)** - Complete integration guide

## 🔧 RabbitMQ Setup

### Create CloudAMQP Account

1. Go to https://www.cloudamqp.com/
2. Sign up with GitHub
3. Create a new instance
4. Copy your AMQP URL to `.env`

### View Messages in Queue

Access CloudAMQP Management UI:
- URL: https://chimpanzee.rmq.cloudamqp.com
- Navigate to Queues → `topic_validateJSON`

## 🛠️ Tech Stack

- **Framework**: NestJS v11.1.6
- **Language**: TypeScript v5.9.3
- **Authentication**: JWT with Passport
- **Password Hashing**: bcrypt v6.0.0
- **Message Queue**: RabbitMQ (amqplib v0.5.5)
- **API Documentation**: Swagger/OpenAPI v11.2.1
- **Validation**: class-validator v0.14.2
- **Testing**: Jest v30.2.0
- **Package Manager**: Yarn v4.10.3 (PnP)

## 📂 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # REST API endpoints
│   ├── auth.service.ts      # Business logic + RabbitMQ
│   ├── auth.module.ts       # Module definition
│   ├── dto/                 # Data transfer objects
│   ├── guards/              # JWT auth guard
│   └── strategies/          # Passport strategies
├── users/                   # Users module
│   ├── users.service.ts     # User CRUD operations
│   └── entities/            # User entity
├── rabbitmq/                # RabbitMQ module
│   ├── rabbitmq-producer.service.ts
│   ├── rabbitmq-consumer.service.ts
│   └── rabbitmq.module.ts
├── common/                  # Shared utilities
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   ├── interceptors/        # Response interceptors
│   └── exceptions/          # Custom exceptions
├── config/                  # Configuration
│   └── index.ts             # Config loader
└── main.ts                  # Application entry point
```

## 🎯 Use Cases

Messages in RabbitMQ queue can be consumed by:

1. **Email Service** - Send verification/welcome emails
2. **Analytics Service** - Track user registration metrics
3. **CRM Service** - Sync users to CRM system
4. **Notification Service** - Send notifications to admins
5. **Data Warehouse** - Sync to reporting database
6. **Audit Service** - Log user activities

## 🔐 Security Features

- ✅ JWT authentication with configurable expiration
- ✅ Password hashing with bcrypt
- ✅ Token blacklisting on logout
- ✅ Request validation with class-validator
- ✅ Protected routes with Guards
- ✅ CORS enabled

## 🐛 Troubleshooting

### Port already in use

```bash
lsof -ti:4000 | xargs kill -9
```

### RabbitMQ connection failed

Check your `.env` file and ensure `RABBITMQ_URL` is correct.

### Consumer not receiving messages

Verify:
1. Consumer service is running
2. Exchange and queue are properly configured
3. Routing key matches

## 📝 Scripts

```json
{
  "start:dev": "Start development server with hot reload",
  "start:prod": "Start production server",
  "test": "Run unit tests",
  "test:cov": "Run tests with coverage",
  "test:e2e": "Run end-to-end tests"
}
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

### References

1. https://nestjs.com/
2. https://www.rabbitmq.com/
3. https://www.cloudamqp.com/
4. https://jwt.io/
5. https://swagger.io/

---

**Made with ❤️ using NestJS and RabbitMQ**
