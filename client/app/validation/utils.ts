import { ZodType } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export const validateData = <T>(
  schema: ZodType<T>,
  data: unknown
): ValidationResult<T> => {
  try {
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    const errors: ValidationError[] = result.error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return {
      success: false,
      errors,
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      success: false,
      errors: [
        {
          field: 'general',
          message: 'Validation failed',
        },
      ],
    };
  }
};
