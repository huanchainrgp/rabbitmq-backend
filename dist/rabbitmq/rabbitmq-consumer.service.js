"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RabbitmqConsumerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqConsumerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqp = __importStar(require("amqplib"));
let RabbitmqConsumerService = RabbitmqConsumerService_1 = class RabbitmqConsumerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RabbitmqConsumerService_1.name);
    }
    async onModuleInit() {
        await this.listen();
    }
    async listen() {
        try {
            const rabbitMqUrl = this.configService.get('rabbitmq.server');
            const routingKey = this.configService.get('rabbitmq.routing.validateJson');
            const topicRoutingKey = this.configService.get('rabbitmq.routing.topicValidateJson');
            this.connection = await amqp.connect(rabbitMqUrl);
            this.channel = await this.connection.createChannel();
            this.logger.log('Consumer connected successfully');
            await this.channel.assertExchange(routingKey, 'direct', {
                durable: true,
                autoDelete: false,
            });
            await this.channel.assertQueue(topicRoutingKey, {
                durable: true,
                autoDelete: false,
                exclusive: false,
            });
            await this.channel.bindQueue(topicRoutingKey, routingKey, topicRoutingKey);
            this.channel.consume(topicRoutingKey, (message) => {
                if (message) {
                    const content = message.content.toString();
                    this.logger.log(`Received message: ${content}`);
                }
            }, { noAck: true });
            this.connection.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                this.reconnect();
            });
            this.connection.on('close', () => {
                this.logger.warn('Connection closed, reconnecting...');
                this.reconnect();
            });
        }
        catch (error) {
            this.logger.error(`Error in listen: ${error.message}`);
            setTimeout(() => this.listen(), 5000);
        }
    }
    async reconnect() {
        if (this.connection) {
            try {
                await this.connection.close();
            }
            catch (err) {
            }
        }
        setTimeout(() => this.listen(), 5000);
    }
    async onModuleDestroy() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
};
exports.RabbitmqConsumerService = RabbitmqConsumerService;
exports.RabbitmqConsumerService = RabbitmqConsumerService = RabbitmqConsumerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RabbitmqConsumerService);
//# sourceMappingURL=rabbitmq-consumer.service.js.map