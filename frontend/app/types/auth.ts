export interface AuthTokens {
  access: string;
  refresh?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}