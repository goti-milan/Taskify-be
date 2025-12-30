export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User response interface (excludes sensitive data)
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

// JWT Token payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/* ---------------------------------- */
/* Success Response                   */
/* ---------------------------------- */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

/* ---------------------------------- */
/* Error Response                     */
/* ---------------------------------- */

export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}
