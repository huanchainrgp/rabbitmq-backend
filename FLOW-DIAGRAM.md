# 🔄 RabbitMQ Flow - User Registration

```
┌─────────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

    1. Client Request
         │
         │  POST /auth/register
         │  { email, username, password }
         ▼
    ┌─────────────────────┐
    │  Auth Controller    │
    │  (auth.controller)  │
    └──────────┬──────────┘
               │
               │ registerDto
               ▼
    ┌─────────────────────┐
    │   Auth Service      │ ◄──── UsersService.create()
    │  (auth.service)     │
    └──────────┬──────────┘
               │
               │ User created successfully
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   ┌─────────┐   ┌──────────────────────────┐
   │ Return  │   │  RabbitMQ Producer       │
   │  JWT    │   │  (rabbitmq-producer)     │
   │ Token   │   └───────────┬──────────────┘
   └─────────┘               │
        │                    │ publish()
        │                    ▼
        │           ┌────────────────────┐
        │           │  RabbitMQ Server   │
        │           │  (CloudAMQP)       │
        │           └─────────┬──────────┘
        │                     │
        │                     │ Message Queue
        │                     ▼
        │           ┌────────────────────┐
        │           │  RabbitMQ Consumer │
        │           │  (rabbitmq-consumer│
        │           └─────────┬──────────┘
        │                     │
        │                     ▼
        │              ┌─────────────┐
        ▼              │  Log/Process │
   ┌─────────┐        │   Message    │
   │ Client  │        └──────────────┘
   │Response │
   └─────────┘

═══════════════════════════════════════════════════════════════════════

📦 MESSAGE STRUCTURE

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

═══════════════════════════════════════════════════════════════════════

🔧 RABBITMQ CONFIGURATION

┌─────────────────────────────────────────────────────────────────┐
│  Exchange:     topic_validateJSON                                │
│  Type:         topic                                             │
│  Routing Key:  topic_validateJSON                                │
│  Queue:        topic_validateJSON                                │
│  Durable:      true                                              │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

📊 TIMELINE EXAMPLE

[00:00.000] Client sends POST /auth/register
[00:00.050] AuthController receives request
[00:00.100] AuthService.register() called
[00:00.150] UsersService.create() - User created in DB
[00:00.200] RabbitmqProducer.publish() - Message sent to queue
            ↳ LOG: "User registration sent to RabbitMQ: user@email.com"
[00:00.250] JWT token generated
[00:00.300] Response sent to client
            ↳ { accessToken: "...", user: {...} }

[00:00.350] RabbitmqConsumer receives message
            ↳ LOG: "Received message: {...}"
[00:00.400] Message processed/logged

═══════════════════════════════════════════════════════════════════════

🎯 BENEFITS

✅ Asynchronous     → Non-blocking user registration
✅ Decoupled        → Services don't depend on each other
✅ Scalable         → Multiple consumers can process messages
✅ Reliable         → Messages persisted in queue
✅ Error Tolerant   → User still created if RabbitMQ fails
✅ Event-Driven     → Easy to add more listeners

═══════════════════════════════════════════════════════════════════════

🔮 POTENTIAL CONSUMERS

┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  1. Email Service     → Send verification email                  │
│  2. Welcome Service   → Send welcome email                       │
│  3. Analytics Service → Track registration metrics               │
│  4. CRM Service       → Sync user to CRM system                  │
│  5. Audit Service     → Log user activity                        │
│  6. Notification      → Notify admin of new user                 │
│  7. Data Warehouse    → Sync to reporting database               │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
```
