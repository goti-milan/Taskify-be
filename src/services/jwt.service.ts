import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET } from '../config';
import jwt from 'jsonwebtoken';

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('JWT secrets must be defined in environment variables');
}

export const generateTokens = (payload: object) => {
  try {
    const accessToken = (jwt as any).sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN || '15m' });
    const refreshToken = (jwt as any).sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN || '7d' });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error('Failed to generate tokens');
  }
}

export const verifyAccessToken = (token: string) => {
  try {
    return (jwt as any).verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return (jwt as any).verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}
