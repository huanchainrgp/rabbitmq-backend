import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RabbitmqProducerService } from '../rabbitmq/rabbitmq-producer.service';
import { ConfigService } from '@nestjs/config';
import { InvalidCredentialsException } from '../common/exceptions/api.exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly blacklistedTokens: Set<string> = new Set();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rabbitmqProducerService: RabbitmqProducerService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`New user registration: ${registerDto.email}`);

    // Create user
    const user = await this.usersService.create(
      registerDto.email,
      registerDto.username,
      registerDto.password,
    );

    // Push user info to RabbitMQ
    try {
      const backendnodeQueue = this.configService.get<string>(
        'rabbitmq.queue.backendnode',
      );

      // Push to backendnode queue
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
    } catch (error) {
      this.logger.error(
        `Failed to send registration to RabbitMQ: ${(error as Error).message}`,
      );
      // Continue even if RabbitMQ fails
    }

    // Generate JWT token
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

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt: ${loginDto.emailOrUsername}`);

    // Find user by email or username
    const user = await this.usersService.findByEmailOrUsername(
      loginDto.emailOrUsername,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Validate password
    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generate JWT token
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

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  async logout(token: string): Promise<{ message: string }> {
    // Add token to blacklist
    this.blacklistedTokens.add(token);
    this.logger.log('User logged out, token blacklisted');

    return { message: 'Logged out successfully' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
