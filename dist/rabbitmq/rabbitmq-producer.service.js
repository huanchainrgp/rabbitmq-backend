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
var RabbitmqProducerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqProducerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqp = __importStar(require("amqplib"));
let RabbitmqProducerService = RabbitmqProducerService_1 = class RabbitmqProducerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RabbitmqProducerService_1.name);
    }
    async publish(exchange, routingKey, payload) {
        try {
            const rabbitMqUrl = this.configService.get('rabbitmq.server');
            const connection = await amqp.connect(rabbitMqUrl);
            const channel = await connection.createConfirmChannel();
            if (exchange === '') {
                await channel.assertQueue(routingKey, {
                    durable: true,
                    autoDelete: false,
                });
                this.logger.log(`Publishing message directly to queue: ${routingKey}`);
            }
            else {
                await channel.assertExchange(exchange, 'direct', {
                    durable: true,
                    autoDelete: false,
                });
                this.logger.log(`Publishing message to exchange: ${exchange} with routing key: ${routingKey}`);
            }
            const messageBuffer = Buffer.from(JSON.stringify(payload));
            return new Promise((resolve, reject) => {
                channel.publish(exchange, routingKey, messageBuffer, { contentType: 'application/json', persistent: true }, (err) => {
                    if (err) {
                        this.logger.error(`Failed to send message: ${err.message}`);
                        reject(err);
                    }
                    else {
                        this.logger.log('Message sent successfully');
                        resolve();
                    }
                    connection.close();
                });
            });
        }
        catch (error) {
            this.logger.error(`Error in publish: ${error.message}`);
            throw error;
        }
    }
};
exports.RabbitmqProducerService = RabbitmqProducerService;
exports.RabbitmqProducerService = RabbitmqProducerService = RabbitmqProducerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RabbitmqProducerService);
//# sourceMappingURL=rabbitmq-producer.service.js.map