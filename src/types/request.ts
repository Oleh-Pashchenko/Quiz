import { User } from '../database/entities/user.entity';

export type UserRequest = Request & { user: User };
