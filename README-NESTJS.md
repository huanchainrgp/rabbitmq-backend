# RabbitMQ Backend - NestJS

A modern RabbitMQ backend application built with NestJS framework, featuring producer-consumer pattern for message queue processing.

## 🚀 Features

- **NestJS Framework**: Modern, TypeScript-based Node.js framework
- **RabbitMQ Integration**: Producer and Consumer services with automatic reconnection
- **Environment Configuration**: Centralized configuration using `.env` file
- **Health Check Endpoint**: Monitor service status
- **Modular Architecture**: Clean separation of concerns with modules, services, and controllers
- **TypeScript**: Full type safety and modern JavaScript features

## 📁 Project Structure

```
rabbitmq-backend/
├── src/
│   ├── api/
│   │   ├── dto/
│   │   │   └── save-data.dto.ts
│   │   ├── api.controller.ts
│   │   └── api.module.ts
│   ├── rabbitmq/
│   │   ├── rabbitmq-producer.service.ts
│   │   ├── rabbitmq-consumer.service.ts
│   │   └── rabbitmq.module.ts
│   ├── config/
│   │   └── rabbitmq.config.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── nest-cli.json
├── tsconfig.json
└── package.json
```

## 🛠️ Installation

```bash
# Install dependencies
yarn install

# Generate TypeScript SDK for Yarn PnP (if using Yarn PnP)
yarn dlx @yarnpkg/sdks vscode
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
NODE_PORT=4000
RABBITMQ_URL=amqps://your-rabbitmq-url
RABBITMQ_EXCHANGE_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_EXCHANGE_VALIDATE_JSON=topic_validateJSON
RABBITMQ_ROUTING_KEY_VALIDATE_JSON=validateJSON
RABBITMQ_TOPIC_ROUTING_KEY_VALIDATE_JSON=topic_validateJSON
RABBITMQ_QUEUE_VALIDATE_JSON=topic_validateJSON
```

## 🚀 Running the Application

```bash
# Development mode with watch
yarn start:dev
# or
yarn dev

# Production mode
yarn build
yarn start:prod

# Debug mode
yarn start:debug
```

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:4000/api/v1/
```

**Response:**
```json
{
  "code": 200,
  "message": "Service is healthy",
  "data": {
    "status": "success",
    "timestamp": "2025-10-19T00:00:00.000Z"
  }
}
```

### Save Data (Publish to Queue)
```bash
POST http://localhost:4000/api/v1/save
Content-Type: application/json

{
  "data": "your data here"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Data received",
  "data": {
    "name": "api_c1 - 1",
    "timestamp": "2025-10-19T00:00:00.000Z",
    "metric": false
  }
}
```

### Using cURL
```bash
curl --location --request POST 'http://localhost:4000/api/v1/save' \
--header 'Content-Type: application/json' \
--data-raw '{
    "postId": 1,
    "id": 1,
    "name": "Test message",
    "email": "foo@bar.biz",
    "body": "Message content"
}'
```

## 🏗️ Architecture

### Modules

1. **ApiModule**: Handles HTTP endpoints
2. **RabbitmqModule**: Manages RabbitMQ producer and consumer
3. **ConfigModule**: Global configuration management

### Services

- **RabbitmqProducerService**: Publishes messages to RabbitMQ
- **RabbitmqConsumerService**: Consumes messages from RabbitMQ queue
  - Auto-starts on module initialization
  - Automatic reconnection on connection loss
  - Error handling and logging

### Controllers

- **ApiController**: REST API endpoints for health check and message publishing

## 🔄 Migration from Express

This project has been migrated from Express.js to NestJS with the following improvements:

### Old Structure (Express)
```
direct/
├── index.js          # Express server
├── producer.js       # Producer logic
├── consumer.js       # Consumer logic
└── api_calls.js      # Testing script
config/
└── index.js          # Configuration
```

### New Structure (NestJS)
- ✅ TypeScript support
- ✅ Dependency injection
- ✅ Modular architecture
- ✅ Built-in logging
- ✅ Environment-based configuration
- ✅ Better error handling
- ✅ Auto-reconnection for RabbitMQ
- ✅ Clean separation of concerns

## 📚 Technologies

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **RabbitMQ** - Message broker
- **amqplib** - RabbitMQ client library
- **Yarn PnP** - Fast, reliable package management

## 🔍 Development

### Build
```bash
yarn build
```

### Format Code
```bash
yarn format
```

### Start in Watch Mode
```bash
yarn start:dev
```

## 🐰 RabbitMQ Management

View your RabbitMQ queues and messages:
- URL: Your CloudAMQP dashboard URL
- Navigate to Queues tab to see messages

## 🧪 Testing

Use the included test script (update port to 4000):

```bash
node direct/api_calls.js
```

Or use tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

## 📝 Notes

- The consumer service starts automatically when the application boots
- Messages are logged in the console
- Connection errors trigger automatic reconnection after 5 seconds
- Health check endpoint is useful for monitoring and load balancers

## 🤝 Contributing

1. Keep the modular structure
2. Follow NestJS best practices
3. Use TypeScript features
4. Add proper error handling
5. Update this README for new features

## 📄 License

ISC

---

**Previous Version**: Express.js implementation available in `direct/` folder for reference.
