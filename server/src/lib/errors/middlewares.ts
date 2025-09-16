import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { createErrorResponse } from './index.js';
import { config } from '../../config/index.js';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error occurred:', {
    error: err,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
  });

  const errorResponse = createErrorResponse(err);

  if (config.nodeEnv === 'development') {
    errorResponse.details = {
      stack: err instanceof Error ? err.stack : undefined,
      originalError: err,
    };
  }

  res.status(errorResponse.statusCode).json(errorResponse);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = createHttpError.NotFound(`Route ${req.originalUrl} not found`);
  next(error);
};

export const validationErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error && err.name === 'ZodError') {
    const zodError = createHttpError.BadRequest('Validation failed');
    zodError.details = err.message;
    return next(zodError);
  }
  next(err);
};
