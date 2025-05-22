import { User } from 'src/database/entities/user/user.entity';

export interface LoginResponse {
    user: Omit<User, 'password'>;
    accessToken: string;
}