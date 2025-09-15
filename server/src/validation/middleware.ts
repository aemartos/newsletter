import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: ValidationError[];
  data?: unknown;
}

const createValidator = <T>(
  schema: ZodType<T>,
  property: keyof Request,
  errorMessage: string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[property]);

      if (!result.success) {
        const errors: ValidationError[] = result.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: errorMessage,
          errors,
        });
      }

      (req as any)[property] = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
      });
    }
  };
};

export const validate = <T>(schema: ZodType<T>, property: keyof Request) =>
  createValidator(schema, property, 'Validation failed');
