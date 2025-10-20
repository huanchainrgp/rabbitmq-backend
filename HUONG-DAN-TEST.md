# 🧪 HƯỚNG DẪN TEST RABBITMQ

## 🎯 Mục đích

Kiểm tra xem khi **tạo tài khoản mới**, hệ thống có **tự động push thông tin user lên RabbitMQ** không.

## ✅ Những gì đã implement

Trong file `src/auth/auth.service.ts`, method `register()` đã có code tự động push:

```typescript
// Tự động push sau khi tạo user thành công
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
```

## 🚀 Cách test

### Cách 1: Dùng Script Tự Động (Khuyên dùng)

```bash
# Bước 1: Start server trong 1 terminal
yarn start:dev

# Bước 2: Mở terminal mới, chạy test script
./quick-test.sh
```

**Kết quả mong đợi:**
- ✅ Response trả về accessToken và thông tin user
- ✅ Check terminal server sẽ thấy logs RabbitMQ

### Cách 2: Test Bằng curl

```bash
# Bước 1: Start server
yarn start:dev

# Bước 2: Tạo user mới
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "test123456"
  }'
```

### Cách 3: Dùng Swagger UI (Dễ nhất)

```bash
# Bước 1: Start server
yarn start:dev

# Bước 2: Mở trình duyệt
http://localhost:4000/api

# Bước 3: Tìm endpoint POST /auth/register
# Bước 4: Click "Try it out"
# Bước 5: Nhập data:
{
  "email": "demo@test.com",
  "username": "demouser",
  "password": "demo123456"
}

# Bước 6: Click "Execute"
```

## 📊 Kiểm tra kết quả

### 1. Response từ API

Bạn sẽ nhận được response như này:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1729360635123_abc",
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

### 2. Logs trong Server Terminal

Quan trọng nhất, check terminal nơi server đang chạy, bạn sẽ thấy:

```bash
# ✅ Bước 1: User được tạo
[AuthService] New user registration: test@example.com

# ✅ Bước 2: Message được gửi lên RabbitMQ
[RabbitmqProducerService] Publishing message to exchange: topic_validateJSON
[RabbitmqProducerService] Message sent successfully

# ✅ Bước 3: Xác nhận đã push thành công
[AuthService] User registration sent to RabbitMQ: test@example.com

# ✅ Bước 4: Consumer nhận được message
[RabbitmqConsumerService] Received message: {
  "event": "user.registered",
  "data": {
    "id": "user_1729360635123_abc",
    "email": "test@example.com",
    "username": "testuser",
    "createdAt": "2025-10-19T16:37:15.123Z"
  },
  "timestamp": "2025-10-19T16:37:15.456Z"
}
```

### 3. Check trên CloudAMQP Dashboard (Optional)

1. Đăng nhập: https://chimpanzee.rmq.cloudamqp.com
2. Vào menu "Queues"
3. Click vào queue `topic_validateJSON`
4. Bạn sẽ thấy message mới được thêm vào

## ✅ Checklist

Sau khi test, đảm bảo bạn thấy tất cả các điểm sau:

- [ ] API trả về HTTP 201 Created
- [ ] Response có accessToken
- [ ] Response có thông tin user (id, email, username)
- [ ] Log: "New user registration: ..."
- [ ] Log: "Message sent successfully"
- [ ] Log: "User registration sent to RabbitMQ: ..."
- [ ] Log: "Received message: ..." (từ consumer)

## 🎉 Kết quả

Nếu bạn thấy tất cả logs trên → **RabbitMQ integration hoạt động hoàn hảo!** ✅

## 🔧 Troubleshooting

### Lỗi: Port 4000 đã được sử dụng

```bash
lsof -ti:4000 | xargs kill -9
yarn start:dev
```

### Lỗi: Cannot connect to RabbitMQ

- Check file `.env` có đúng RABBITMQ_URL không
- Kiểm tra internet connection
- Test connection trên CloudAMQP dashboard

### Consumer không nhận message

- Đảm bảo server vẫn đang chạy
- Check logs có "Consumer connected successfully" không
- Verify exchange và queue name có đúng không

## 📚 Tài liệu thêm

- **SUMMARY.md** - Tóm tắt nhanh
- **README.md** - Hướng dẫn đầy đủ
- **FLOW-DIAGRAM.md** - Sơ đồ flow
- **RABBITMQ-USER-REGISTRATION.md** - Chi tiết technical

## 💡 Tips

1. **Dùng Swagger UI** là cách dễ nhất để test
2. **Check logs** là cách tốt nhất để verify RabbitMQ
3. **Dùng random email** mỗi lần test để tránh duplicate
4. **Giữ server chạy** để thấy consumer logs

---

**Câu hỏi?** Check file README.md hoặc các file docs khác nhé! 📖
