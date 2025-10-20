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
    backendnode: process.env.RABBITMQ_QUEUE_BACKENDNODE || 'backendnode',
  },
}));
