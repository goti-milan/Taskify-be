import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/api-response';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => ({
      field: (err as any).param || (err as any).path,
      message: err.msg,
    }));

    errorResponse(
      res,
      400,
      'VALIDATION_ERROR',
      'Validation failed',
      errorDetails
    );
    return;
  }
  next();
};;