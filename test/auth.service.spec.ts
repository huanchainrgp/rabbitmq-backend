import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RabbitmqProducerService } from '../src/rabbitmq/rabbitmq-producer.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let rabbitmqProducerService: RabbitmqProducerService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmailOrUsername: jest.fn(),
    findById: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockRabbitmqProducerService = {
    publish: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'rabbitmq.exchange.validateJson': 'validateJSON',
        'rabbitmq.routing.topicValidateJson': 'topic_validateJSON',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RabbitmqProducerService,
          useValue: mockRabbitmqProducerService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    rabbitmqProducerService = module.get<RabbitmqProducerService>(
      RabbitmqProducerService,
    );

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    const mockUser = {
      id: 'user_123',
      email: 'test@example.com',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should register a new user and return auth response', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');
      mockRabbitmqProducerService.publish.mockResolvedValue(undefined);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        accessToken: 'jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        },
      });

      expect(mockUsersService.create).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.username,
        registerDto.password,
      );

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });
    });

    it('should push user registration to RabbitMQ', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');
      mockRabbitmqProducerService.publish.mockResolvedValue(undefined);

      await service.register(registerDto);

      expect(mockRabbitmqProducerService.publish).toHaveBeenCalledWith(
        'validateJSON',
        'topic_validateJSON',
        expect.objectContaining({
          event: 'user.registered',
          data: expect.objectContaining({
            id: mockUser.id,
            email: mockUser.email,
            username: mockUser.username,
          }),
        }),
      );
    });

    it('should continue even if RabbitMQ publish fails', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');
      mockRabbitmqProducerService.publish.mockRejectedValue(
        new Error('RabbitMQ error'),
      );

      const result = await service.register(registerDto);

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('jwt-token');
    });
  });

  describe('login', () => {
    const loginDto = {
      emailOrUsername: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user_123',
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should login user and return auth response', async () => {
      mockUsersService.findByEmailOrUsername.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        },
      });

      expect(mockUsersService.findByEmailOrUsername).toHaveBeenCalledWith(
        loginDto.emailOrUsername,
      );
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        mockUser,
        loginDto.password,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmailOrUsername.mockResolvedValue(undefined);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findByEmailOrUsername.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: 'user_123',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.validateUser('user_123');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith('user_123');
    });
  });

  describe('logout', () => {
    it('should add token to blacklist', async () => {
      const token = 'jwt-token';

      const result = await service.logout(token);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(service.isTokenBlacklisted(token)).toBe(true);
    });
  });

  describe('isTokenBlacklisted', () => {
    it('should return false for non-blacklisted token', () => {
      expect(service.isTokenBlacklisted('some-token')).toBe(false);
    });

    it('should return true for blacklisted token', async () => {
      const token = 'jwt-token';
      await service.logout(token);

      expect(service.isTokenBlacklisted(token)).toBe(true);
    });
  });
});
