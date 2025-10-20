"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('rabbitmq', () => ({
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
//# sourceMappingURL=rabbitmq.config.js.map