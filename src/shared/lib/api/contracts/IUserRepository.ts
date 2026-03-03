import { User, UserRole } from '@/lib/types/auth';

export interface UserFilters {
    role?: UserRole;
    search?: string;
}

export interface UpdateUserInput {
    display_name?: string;
    email?: string;
    avatar?: string;
}

export interface IUserRepository {
    getCurrentUser(): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    getUsers(filters?: UserFilters): Promise<User[]>;
    getUsersByRole(role: UserRole): Promise<User[]>;
    updateUser(id: number, input: UpdateUserInput): Promise<User>;
    deleteUser(id: number): Promise<boolean>;
}
