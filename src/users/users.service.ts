import { Injectable } from '@nestjs/common';
import { User, UserWithoutPassword } from './entities/user.entity';
import { UserAlreadyExistsException } from '../common/exceptions/api.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // In-memory storage (replace with database in production)
  private users: User[] = [];

  async create(
    email: string,
    username: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    // Check if user already exists
    const existingUser = this.users.find(
      (user) => user.email === email || user.username === username,
    );

    if (existingUser) {
      throw new UserAlreadyExistsException('Email hoặc username đã tồn tại');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: this.generateId(),
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    // Return user without password
    return this.excludePassword(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findById(id: string): Promise<UserWithoutPassword | undefined> {
    const user = this.users.find((user) => user.id === id);
    return user ? this.excludePassword(user) : undefined;
  }

  async findByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User | undefined> {
    return this.users.find(
      (user) =>
        user.email === emailOrUsername || user.username === emailOrUsername,
    );
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getAllUsers(): Promise<UserWithoutPassword[]> {
    return this.users.map((user) => this.excludePassword(user));
  }

  private excludePassword(user: User): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
