"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ApiController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_producer_service_1 = require("../rabbitmq/rabbitmq-producer.service");
const config_1 = require("@nestjs/config");
let ApiController = ApiController_1 = class ApiController {
    constructor(rabbitmqProducerService, configService) {
        this.rabbitmqProducerService = rabbitmqProducerService;
        this.configService = configService;
        this.logger = new common_1.Logger(ApiController_1.name);
        this.count = 0;
    }
    healthCheck() {
        return {
            code: 200,
            message: 'Service is healthy',
            data: {
                status: 'success',
                timestamp: new Date(),
            },
        };
    }
    async save(body) {
        this.count++;
        this.logger.log(`Request received - ${this.count}`);
        try {
            const payload = {
                name: `api_c1 - ${this.count}`,
                timestamp: new Date(),
                metric: false,
            };
            const exchange = this.configService.get('rabbitmq.exchange.validateJson');
            const routingKey = this.configService.get('rabbitmq.routing.topicValidateJson');
            await this.rabbitmqProducerService.publish(exchange, routingKey, payload);
            return {
                code: 200,
                message: 'Data received',
                data: payload,
            };
        }
        catch (error) {
            this.logger.error(`Error processing request: ${error.message}`);
            return {
                code: 400,
                message: 'Bad request',
            };
        }
    }
};
exports.ApiController = ApiController;
__decorate([
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)('save'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "save", null);
exports.ApiController = ApiController = ApiController_1 = __decorate([
    (0, common_1.Controller)('api/v1'),
    __metadata("design:paramtypes", [rabbitmq_producer_service_1.RabbitmqProducerService,
        config_1.ConfigService])
], ApiController);
//# sourceMappingURL=api.controller.js.map