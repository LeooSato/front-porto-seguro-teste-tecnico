export type UserRole = 'ADMIN' | 'STUDENT';

export interface AuthUser {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
}
