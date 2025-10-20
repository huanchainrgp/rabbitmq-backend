import { User, UserWithoutPassword } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(email: string, username: string, password: string): Promise<UserWithoutPassword>;
    findByEmail(email: string): Promise<User | undefined>;
    findByUsername(username: string): Promise<User | undefined>;
    findById(id: string): Promise<UserWithoutPassword | undefined>;
    findByEmailOrUsername(emailOrUsername: string): Promise<User | undefined>;
    validatePassword(user: User, password: string): Promise<boolean>;
    getAllUsers(): Promise<UserWithoutPassword[]>;
    private excludePassword;
}
