import { Injectable } from '@nestjs/common';
import { User, UserWithoutPassword } from './entities/user.entity';
import { UserAlreadyExistsException } from '../common/exceptions/api.exception';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    email: string,
    username: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new UserAlreadyExistsException('Email hoặc username đã tồn tại');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Return user without password
    return this.excludePassword(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user || undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return user || undefined;
  }

  async findById(id: string): Promise<UserWithoutPassword | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.excludePassword(user) : undefined;
  }

  async findByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
    return user || undefined;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getAllUsers(): Promise<UserWithoutPassword[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.excludePassword(user));
  }

  private excludePassword(user: User): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
