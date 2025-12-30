import { Response } from 'express';
import {
  SuccessResponse,
  ErrorResponse,
  PaginationMeta,
} from '../types';

/* ---------- SUCCESS ---------- */
export const successResponse = <T>(
  res: Response,
  statusCode = 200,
  message: string,
  data?: T,
  meta?: PaginationMeta,
) => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    ...(data && {data}),
    ...(meta && { meta }),
  };

  return res.status(statusCode).json(response);
};

/* ---------- ERROR ---------- */
export const errorResponse = (
  res: Response,
  statusCode = 400,
  code: string,
  message: string,
  details?: { field?: string; message: string }[],
) => {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };

  return res.status(statusCode).json(response);
};
