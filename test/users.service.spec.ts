import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const result = await service.create(
        'test@example.com',
        'testuser',
        'password123',
      );

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException if email already exists', async () => {
      await service.create('test@example.com', 'testuser', 'password123');

      await expect(
        service.create('test@example.com', 'anotheruser', 'password456'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if username already exists', async () => {
      await service.create('test@example.com', 'testuser', 'password123');

      await expect(
        service.create('another@example.com', 'testuser', 'password456'),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash password before storing', async () => {
      const user = await service.create(
        'test@example.com',
        'testuser',
        'password123',
      );

      const foundUser = await service.findByEmail('test@example.com');
      expect(foundUser.password).not.toBe('password123');
      expect(foundUser.password).toHaveLength(60); // bcrypt hash length
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      await service.create('test@example.com', 'testuser', 'password123');

      const user = await service.findByEmail('test@example.com');
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should return undefined if user not found', async () => {
      const user = await service.findByEmail('nonexistent@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      await service.create('test@example.com', 'testuser', 'password123');

      const user = await service.findByUsername('testuser');
      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
    });

    it('should return undefined if user not found', async () => {
      const user = await service.findByUsername('nonexistent');
      expect(user).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const created = await service.create(
        'test@example.com',
        'testuser',
        'password123',
      );

      const user = await service.findById(created.id);
      expect(user).toBeDefined();
      expect(user.id).toBe(created.id);
      expect(user).not.toHaveProperty('password');
    });

    it('should return undefined if user not found', async () => {
      const user = await service.findById('nonexistent-id');
      expect(user).toBeUndefined();
    });
  });

  describe('findByEmailOrUsername', () => {
    beforeEach(async () => {
      await service.create('test@example.com', 'testuser', 'password123');
    });

    it('should find user by email', async () => {
      const user = await service.findByEmailOrUsername('test@example.com');
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should find user by username', async () => {
      const user = await service.findByEmailOrUsername('testuser');
      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
    });

    it('should return undefined if not found', async () => {
      const user = await service.findByEmailOrUsername('nonexistent');
      expect(user).toBeUndefined();
    });
  });

  describe('validatePassword', () => {
    it('should return true for correct password', async () => {
      await service.create('test@example.com', 'testuser', 'password123');
      const user = await service.findByEmail('test@example.com');

      const isValid = await service.validatePassword(user, 'password123');
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      await service.create('test@example.com', 'testuser', 'password123');
      const user = await service.findByEmail('test@example.com');

      const isValid = await service.validatePassword(user, 'wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users without passwords', async () => {
      await service.create('test1@example.com', 'user1', 'password123');
      await service.create('test2@example.com', 'user2', 'password456');

      const users = await service.getAllUsers();
      expect(users).toHaveLength(2);
      users.forEach((user) => {
        expect(user).not.toHaveProperty('password');
      });
    });

    it('should return empty array when no users', async () => {
      const users = await service.getAllUsers();
      expect(users).toEqual([]);
    });
  });
});
