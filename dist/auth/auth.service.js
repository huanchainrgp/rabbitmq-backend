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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const rabbitmq_producer_service_1 = require("../rabbitmq/rabbitmq-producer.service");
const config_1 = require("@nestjs/config");
const api_exception_1 = require("../common/exceptions/api.exception");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, rabbitmqProducerService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.rabbitmqProducerService = rabbitmqProducerService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.blacklistedTokens = new Set();
    }
    async register(registerDto) {
        this.logger.log(`New user registration: ${registerDto.email}`);
        const user = await this.usersService.create(registerDto.email, registerDto.username, registerDto.password);
        try {
            const backendnodeQueue = this.configService.get('rabbitmq.queue.backendnode');
            await this.rabbitmqProducerService.publish('', backendnodeQueue, {
                event: 'user.registered',
                data: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    createdAt: user.createdAt,
                },
                timestamp: new Date(),
            });
            this.logger.log(`User registration sent to RabbitMQ queue 'backendnode': ${user.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send registration to RabbitMQ: ${error.message}`);
        }
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
    async login(loginDto) {
        this.logger.log(`Login attempt: ${loginDto.emailOrUsername}`);
        const user = await this.usersService.findByEmailOrUsername(loginDto.emailOrUsername);
        if (!user) {
            throw new api_exception_1.InvalidCredentialsException();
        }
        const isPasswordValid = await this.usersService.validatePassword(user, loginDto.password);
        if (!isPasswordValid) {
            throw new api_exception_1.InvalidCredentialsException();
        }
        const payload = { sub: user.id, email: user.email, username: user.username };
        const accessToken = this.jwtService.sign(payload);
        this.logger.log(`User logged in successfully: ${user.email}`);
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        };
    }
    async validateUser(userId) {
        return this.usersService.findById(userId);
    }
    async logout(token) {
        this.blacklistedTokens.add(token);
        this.logger.log('User logged out, token blacklisted');
        return { message: 'Logged out successfully' };
    }
    isTokenBlacklisted(token) {
        return this.blacklistedTokens.has(token);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        rabbitmq_producer_service_1.RabbitmqProducerService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map