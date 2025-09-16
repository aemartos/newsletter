import createHttpError from 'http-errors';

export class ValidationError extends createHttpError.BadRequest {
  public name = 'ValidationError';

  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
  }
}

export class NotFoundError extends createHttpError.NotFound {
  public name = 'NotFoundError';

  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

export class ConflictError extends createHttpError.Conflict {
  public name = 'ConflictError';

  constructor(message: string) {
    super(message);
  }
}

export class DatabaseError extends createHttpError.InternalServerError {
  public name = 'DatabaseError';
  public cause?: unknown;

  constructor(operation: string, originalError?: unknown) {
    super(`Database ${operation} failed`);
    this.cause = originalError;
  }
}

export class EmailError extends createHttpError.InternalServerError {
  public name = 'EmailError';
  public cause?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(`Email sending failed: ${message}`);
    this.cause = originalError;
  }
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export function createErrorResponse(error: unknown): ErrorResponse {
  if (createHttpError.isHttpError(error)) {
    return {
      success: false,
      error: error.name,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof ConflictError ||
    error instanceof DatabaseError ||
    error instanceof EmailError
  ) {
    return {
      success: false,
      error: error.name,
      message: error.message,
      statusCode: error.statusCode,
      details: error.cause,
    };
  }

  return {
    success: false,
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
    statusCode: 500,
    details: error instanceof Error ? error.message : 'Unknown error',
  };
}
