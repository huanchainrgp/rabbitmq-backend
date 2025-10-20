import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    const mockResponse = {
      accessToken: 'jwt-token',
      user: {
        id: 'user_123',
        email: 'test@example.com',
        username: 'testuser',
      },
    };

    it('should register a new user', async () => {
      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    const loginDto = {
      emailOrUsername: 'test@example.com',
      password: 'password123',
    };

    const mockResponse = {
      accessToken: 'jwt-token',
      user: {
        id: 'user_123',
        email: 'test@example.com',
        username: 'testuser',
      },
    };

    it('should login user', async () => {
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getProfile', () => {
    it('should return current user profile', async () => {
      const mockUser = {
        userId: 'user_123',
        email: 'test@example.com',
        username: 'testuser',
      };

      const result = await controller.getProfile(mockUser);

      expect(result).toEqual({
        user: {
          id: mockUser.userId,
          email: mockUser.email,
          username: mockUser.username,
        },
      });
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const authorization = 'Bearer jwt-token';
      mockAuthService.logout.mockResolvedValue({
        message: 'Logged out successfully',
      });

      const result = await controller.logout(authorization);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.logout).toHaveBeenCalledWith('jwt-token');
    });

    it('should handle missing Bearer prefix', async () => {
      const authorization = 'jwt-token';
      mockAuthService.logout.mockResolvedValue({
        message: 'Logged out successfully',
      });

      await controller.logout(authorization);

      expect(mockAuthService.logout).toHaveBeenCalledWith('jwt-token');
    });
  });
});
