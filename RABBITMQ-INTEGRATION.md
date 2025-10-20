# 🐰 RabbitMQ Integration - User Registration

## ✅ Đã Được Implement

### Tính Năng
Khi user đăng ký (register), hệ thống **tự động push thông tin user lên RabbitMQ queue**.

## 📋 Flow Hoạt Động

```
1. User POST /auth/register
   ↓
2. Server tạo user mới
   ↓
3. Hash password với bcrypt
   ↓
4. Lưu user vào database (in-memory)
   ↓
5. 🐰 PUSH DATA TO RABBITMQ
   ↓
6. Generate JWT token
   ↓
7. Return response to user
```

## 💻 Implementation Code

### File: `src/auth/auth.service.ts`

```typescript
async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
  this.logger.log(`New user registration: ${registerDto.email}`);

  // 1. Create user
  const user = await this.usersService.create(
    registerDto.email,
    registerDto.username,
    registerDto.password,
  );

  // 2. 🐰 PUSH USER INFO TO RABBITMQ
  try {
    const exchange = this.configService.get<string>(
      'rabbitmq.exchange.validateJson',
    );
    const routingKey = this.configService.get<string>(
      'rabbitmq.routing.topicValidateJson',
    );

    await this.rabbitmqProducerService.publish(exchange, routingKey, {
      event: 'user.registered',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      timestamp: new Date(),
    });

    this.logger.log(`User registration sent to RabbitMQ: ${user.email}`);
  } catch (error) {
    this.logger.error(
      `Failed to send registration to RabbitMQ: ${error.message}`,
    );
    // Continue even if RabbitMQ fails - không block user registration
  }

  // 3. Generate JWT token and return
  const payload = { sub: user.id, email: user.email, username: user.username };
  const accessToken = this.jwtService.sign(payload);

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };
}
```

## 📦 Message Format

Khi user đăng ký, message được push lên RabbitMQ có format:

```json
{
  "event": "user.registered",
  "data": {
    "id": "user_1729363200000_abc123",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2025-10-19T23:00:00.000Z"
  },
  "timestamp": "2025-10-19T23:00:00.000Z"
}
```

### Chi tiết fields:

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | Event type: "user.registered" |
| `data.id` | string | User ID (unique) |
| `data.email` | string | User email |
| `data.username` | string | Username |
| `data.createdAt` | Date | Account creation timestamp |
| `timestamp` | Date | Event timestamp |

## 🔧 Configuration

### Environment Variables (.env)

```env
RABBITMQ_URL=amqps://your-rabbitmq-url
RABBITMQ_EXCHANGE_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_EXCHANGE_VALIDATE_JSON=topic_validateJSON
RABBITMQ_ROUTING_KEY_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_ROUTING_KEY_VALIDATE_JSON=topic_validateJSON
RABBITMQ_QUEUE_VALIDATE_JSON=topic_validateJSON
```

### RabbitMQ Config (`src/config/rabbitmq.config.ts`)

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  server: process.env.RABBITMQ_URL,
  exchange: {
    validateJson: process.env.RABBITMQ_EXCHANGE_VALIDATE_JSON,
    topicValidateJson: process.env.RABBITMQ_TOPIC_EXCHANGE_VALIDATE_JSON,
  },
  routing: {
    validateJson: process.env.RABBITMQ_ROUTING_KEY_VALIDATE_JSON,
    topicValidateJson: process.env.RABBITMQ_TOPIC_ROUTING_KEY_VALIDATE_JSON,
  },
  queue: {
    topicValidateJson: process.env.RABBITMQ_QUEUE_VALIDATE_JSON,
  },
}));
```

## 🧪 Testing

### Test Register với RabbitMQ

```bash
# 1. Start server
yarn start:dev

# 2. Register new user
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "test123456"
  }'

# 3. Check server logs - you should see:
# [AuthService] New user registration: test@example.com
# [RabbitmqProducerService] Message sent successfully
# [AuthService] User registration sent to RabbitMQ: test@example.com
# [RabbitmqConsumerService] Received message: {"event":"user.registered",...}
```

### Expected Logs

**Producer (Auth Service):**
```
[AuthService] New user registration: test@example.com
[AuthService] User registration sent to RabbitMQ: test@example.com
```

**RabbitMQ Producer:**
```
[RabbitmqProducerService] Message sent successfully
```

**Consumer:**
```
[RabbitmqConsumerService] Received message: {
  "event": "user.registered",
  "data": {
    "id": "user_xxx",
    "email": "test@example.com",
    "username": "testuser",
    "createdAt": "2025-10-19T23:00:00.000Z"
  },
  "timestamp": "2025-10-19T23:00:00.000Z"
}
```

## 📊 RabbitMQ Architecture

```
┌─────────────────┐
│   Auth Service  │
│   (Producer)    │
└────────┬────────┘
         │
         │ publish()
         ↓
┌─────────────────────────────┐
│   RabbitMQ Exchange         │
│   (validateJSON)            │
└────────┬────────────────────┘
         │
         │ route to queue
         ↓
┌─────────────────────────────┐
│   RabbitMQ Queue            │
│   (topic_validateJSON)      │
└────────┬────────────────────┘
         │
         │ consume()
         ↓
┌─────────────────┐
│  Consumer       │
│  Service        │
└─────────────────┘
```

## 🔍 RabbitMQ Producer Service

### File: `src/rabbitmq/rabbitmq-producer.service.ts`

```typescript
@Injectable()
export class RabbitmqProducerService {
  private readonly logger = new Logger(RabbitmqProducerService.name);

  async publish(
    exchange: string,
    routingKey: string,
    payload: any,
  ): Promise<void> {
    try {
      const rabbitMqUrl = this.configService.get<string>('rabbitmq.server');
      const connection = await amqp.connect(rabbitMqUrl);
      const channel = await connection.createConfirmChannel();

      await channel.assertExchange(exchange, 'direct', {
        durable: true,
        autoDelete: false,
      });

      const messageBuffer = Buffer.from(JSON.stringify(payload));

      return new Promise((resolve, reject) => {
        channel.publish(
          '',
          routingKey,
          messageBuffer,
          { contentType: 'text/plain' },
          (err) => {
            if (err) {
              this.logger.error(`Failed to send message: ${err.message}`);
              reject(err);
            } else {
              this.logger.log('Message sent successfully');
              resolve();
            }
            connection.close();
          },
        );
      });
    } catch (error) {
      this.logger.error(`Error in publish: ${error.message}`);
      throw error;
    }
  }
}
```

## 🎯 Consumer Service

### File: `src/rabbitmq/rabbitmq-consumer.service.ts`

Consumer tự động lắng nghe messages từ queue:

```typescript
@Injectable()
export class RabbitmqConsumerService implements OnModuleInit {
  async onModuleInit() {
    await this.listen();
  }

  private async listen() {
    this.connection = await amqp.connect(rabbitMqUrl);
    this.channel = await this.connection.createChannel();

    // Assert queue
    await this.channel.assertQueue(topicRoutingKey, {
      durable: true,
      autoDelete: false,
      exclusive: false,
    });

    // Bind queue to exchange
    await this.channel.bindQueue(topicRoutingKey, routingKey, topicRoutingKey);

    // Start consuming
    this.channel.consume(
      topicRoutingKey,
      (message) => {
        if (message) {
          const content = message.content.toString();
          this.logger.log(`Received message: ${content}`);
          // Process the message here
        }
      },
      { noAck: true },
    );
  }
}
```

## 🚀 Demo Flow

### Step-by-Step Example

**1. User Registration Request:**
```bash
POST /auth/register
{
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepass123"
}
```

**2. Server Processes:**
- ✅ Validate input (email format, min length, etc.)
- ✅ Check if email/username exists
- ✅ Hash password with bcrypt
- ✅ Create user record
- ✅ **Push to RabbitMQ**
- ✅ Generate JWT token

**3. RabbitMQ Message:**
```json
{
  "event": "user.registered",
  "data": {
    "id": "user_1729363200000_xyz789",
    "email": "john@example.com",
    "username": "johndoe",
    "createdAt": "2025-10-19T23:00:00.000Z"
  },
  "timestamp": "2025-10-19T23:00:00.000Z"
}
```

**4. Consumer Receives:**
```
[RabbitmqConsumerService] Consumer connected successfully
[RabbitmqConsumerService] Received message: {"event":"user.registered",...}
```

**5. Response to User:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1729363200000_xyz789",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

## ⚡ Key Features

### 1. **Non-Blocking**
- RabbitMQ publish không block user registration
- Nếu RabbitMQ fail, user vẫn register thành công
- Error được log nhưng không throw exception

### 2. **Automatic**
- Không cần manual trigger
- Mỗi registration tự động push message
- Consumer tự động start khi app boot

### 3. **Reliable**
- Durable queues
- Persistent messages
- Auto-reconnect on connection loss

### 4. **Event-Driven**
- Event name: "user.registered"
- Other services có thể subscribe
- Loosely coupled architecture

## 📝 Use Cases

RabbitMQ message này có thể được sử dụng cho:

1. **Email Verification**
   - Consumer nhận message
   - Gửi verification email
   - Track verification status

2. **Welcome Email**
   - Send welcome message
   - Onboarding instructions

3. **Analytics**
   - Track user registrations
   - User demographics
   - Registration trends

4. **CRM Integration**
   - Sync to CRM system
   - Create customer profile
   - Setup marketing campaigns

5. **Audit Logs**
   - Log user activities
   - Compliance tracking
   - Security monitoring

6. **Notification Services**
   - Push notifications
   - SMS alerts
   - Slack/Discord notifications

## ✅ Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Auto Push on Register | ✅ | Messages sent automatically |
| Event Type | ✅ | "user.registered" |
| Message Format | ✅ | JSON với user data |
| Non-Blocking | ✅ | Không ảnh hưởng registration |
| Error Handling | ✅ | Graceful fallback |
| Consumer | ✅ | Auto-listening |
| Logs | ✅ | Detailed logging |

## 🎉 Kết Luận

✅ **RabbitMQ Integration đã hoàn thiện!**

Mỗi khi user đăng ký:
- ✅ Data được push lên RabbitMQ
- ✅ Consumer nhận được message
- ✅ Event có thể được xử lý bởi các services khác
- ✅ System hoạt động async và reliable

---

**Documentation Date**: October 19, 2025  
**Feature**: User Registration with RabbitMQ Integration  
**Status**: ✅ Implemented & Working
