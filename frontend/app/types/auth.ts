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

export interface RequestPasswordResetPayload {
  email: string;
}

export interface ConfirmPasswordResetPayload {
  uid: string;
  token: string;
  password: string;
}
