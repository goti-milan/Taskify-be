import { Request, Response, NextFunction } from 'express';
import { JWTPayload, User } from '../types';
import { errorResponse } from '../utils/api-response';
import { verifyAccessToken } from '../services/jwt.service';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      errorResponse(res, 401, 'UNAUTHORIZED', 'Access token is required');
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token) as JWTPayload;
    req.user = decoded;

    next();
  } catch (error) {
    errorResponse(res, 403, 'FORBIDDEN', 'Invalid or expired token');
  }
};
