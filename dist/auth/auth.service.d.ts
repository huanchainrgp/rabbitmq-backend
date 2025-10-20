import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RabbitmqProducerService } from '../rabbitmq/rabbitmq-producer.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private usersService;
    private jwtService;
    private rabbitmqProducerService;
    private configService;
    private readonly logger;
    private readonly blacklistedTokens;
    constructor(usersService: UsersService, jwtService: JwtService, rabbitmqProducerService: RabbitmqProducerService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(userId: string): Promise<import("../users/entities/user.entity").UserWithoutPassword>;
    logout(token: string): Promise<{
        message: string;
    }>;
    isTokenBlacklisted(token: string): boolean;
}
