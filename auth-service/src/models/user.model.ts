export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface UserCreateInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  created_at: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserResponse;
}

// Función para convertir User a UserResponse (sin password)
export const toUserResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at
  };
};