# 🐰 RabbitMQ Integration - User Registration

## 📋 Tổng Quan

Hệ thống đã được tích hợp **RabbitMQ** để tự động push thông tin user lên message queue mỗi khi có tài khoản mới được tạo.

## ✅ Đã Implement

### 1. **Producer Service** (`src/rabbitmq/rabbitmq-producer.service.ts`)
- Kết nối tới RabbitMQ server
- Publish message lên exchange khi có event
- Sử dụng confirm channel để đảm bảo message được gửi thành công

### 2. **Consumer Service** (`src/rabbitmq/rabbitmq-consumer.service.ts`)
- Lắng nghe messages từ RabbitMQ queue
- Tự động khởi động khi server start
- Log thông tin nhận được

### 3. **Auth Service Integration** (`src/auth/auth.service.ts`)

Trong method `register()`, sau khi tạo user thành công, hệ thống sẽ:

```typescript
// Push user info to RabbitMQ
try {
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
  this.logger.error(`Failed to send registration to RabbitMQ: ${error.message}`);
  // Continue even if RabbitMQ fails
}
```

## 📦 Message Format

Khi user đăng ký thành công, message được gửi lên RabbitMQ có format:

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

## 🔧 Configuration

File `.env` chứa các config cho RabbitMQ:

```bash
RABBITMQ_URL=amqps://mkqxvoob:YCyat4Y-LZSP1hvFnjcA65DjyFn9wluw@chimpanzee.rmq.cloudamqp.com/mkqxvoob
RABBITMQ_EXCHANGE_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_EXCHANGE_VALIDATE_JSON=topic_validateJSON
RABBITMQ_ROUTING_KEY_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_ROUTING_KEY_VALIDATE_JSON=topic_validateJSON
RABBITMQ_QUEUE_VALIDATE_JSON=topic_validateJSON
```

## 🧪 Cách Test

### Option 1: Sử dụng Quick Test Script

```bash
# 1. Start server
yarn start:dev

# 2. Trong terminal khác, chạy test script
./quick-test.sh
```

### Option 2: Manual Test với curl

```bash
# 1. Start server
yarn start:dev

# 2. Tạo user mới
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "test123456"
  }'
```

### Option 3: Sử dụng Swagger UI

1. Mở trình duyệt: http://localhost:4000/api
2. Tìm endpoint `POST /auth/register`
3. Click "Try it out"
4. Nhập thông tin user
5. Click "Execute"

## 📊 Logs Expected

Sau khi tạo user thành công, bạn sẽ thấy các logs trong server terminal:

```
[AuthService] New user registration: test@example.com
[RabbitmqProducerService] Publishing message to exchange: topic_validateJSON
[RabbitmqProducerService] Message sent successfully
[AuthService] User registration sent to RabbitMQ: test@example.com
```

Và nếu consumer đang chạy:

```
[RabbitmqConsumerService] Consumer connected successfully
[RabbitmqConsumerService] Received message: {
  "event": "user.registered",
  "data": {
    "id": "user_xxx",
    "email": "test@example.com",
    "username": "testuser",
    "createdAt": "2025-10-19T..."
  },
  "timestamp": "2025-10-19T..."
}
```

## 🎯 Use Cases

Message này có thể được sử dụng cho:

1. **Email Verification**: Service khác lắng nghe và gửi email xác thực
2. **Welcome Email**: Gửi email chào mừng user mới
3. **Analytics**: Track số lượng user đăng ký
4. **CRM Integration**: Đồng bộ user data sang hệ thống CRM
5. **Notification Service**: Gửi thông báo cho admin
6. **Data Warehouse**: Sync data vào warehouse cho reporting

## ⚡ Advantages

1. **Asynchronous**: Không block request của user
2. **Decoupled**: Auth service không phụ thuộc vào các service khác
3. **Scalable**: Có thể có nhiều consumer xử lý song song
4. **Reliable**: Message được persist, không mất khi service crash
5. **Error Handling**: Nếu RabbitMQ fail, user vẫn được tạo thành công

## 🔍 Troubleshooting

### Issue: Consumer không nhận được message

**Check:**
1. Consumer service có start không?
   - Log: `[RabbitmqConsumerService] Consumer connected successfully`

2. Exchange và Queue có được tạo đúng không?
   - Kiểm tra RabbitMQ Management UI

3. Routing key có match không?
   - Exchange: `topic_validateJSON`
   - Routing key: `topic_validateJSON`

### Issue: Connection failed

**Check:**
1. RABBITMQ_URL trong .env có đúng không?
2. Internet connection
3. CloudAMQP service có hoạt động không?

## 📝 Summary

✅ **RabbitMQ integration đã hoàn thành**
✅ **Tự động push data khi tạo tài khoản**
✅ **Message format chuẩn**
✅ **Error handling tốt**
✅ **Logging đầy đủ**

---

**Tài liệu chi tiết**: Xem thêm `RABBITMQ-INTEGRATION.md`
**Test script**: Chạy `./quick-test.sh` hoặc `./test-rabbitmq.sh`
