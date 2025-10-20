import { User, UserWithoutPassword } from './entities/user.entity';
export declare class UsersService {
    private users;
    create(email: string, username: string, password: string): Promise<UserWithoutPassword>;
    findByEmail(email: string): Promise<User | undefined>;
    findByUsername(username: string): Promise<User | undefined>;
    findById(id: string): Promise<UserWithoutPassword | undefined>;
    findByEmailOrUsername(emailOrUsername: string): Promise<User | undefined>;
    validatePassword(user: User, password: string): Promise<boolean>;
    getAllUsers(): Promise<UserWithoutPassword[]>;
    private excludePassword;
    private generateId;
}
