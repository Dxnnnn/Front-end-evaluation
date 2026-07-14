export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  name: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}
