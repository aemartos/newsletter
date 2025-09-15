export interface ApiError {
  success: false;
  error: {
    message: string;
    status: number;
    type: string;
  };
}

export class AppError extends Error {
  public readonly status: number;
  public readonly type: string;

  constructor(
    message: string,
    status: number = 500,
    type: string = 'UNKNOWN_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.type = type;
  }

  static fromApiError(apiError: ApiError): AppError {
    return new AppError(
      apiError.error.message,
      apiError.error.status,
      apiError.error.type
    );
  }
}

export const handleApiError = async (response: Response): Promise<never> => {
  let errorData: unknown;

  try {
    errorData = await response.json();
  } catch {
    throw new AppError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }

  if (
    errorData &&
    typeof errorData === 'object' &&
    'success' in errorData &&
    errorData.success === false &&
    'error' in errorData &&
    errorData.error &&
    typeof errorData.error === 'object' &&
    'message' in errorData.error &&
    'status' in errorData.error
  ) {
    throw AppError.fromApiError(errorData as ApiError);
  }

  const message =
    errorData &&
    typeof errorData === 'object' &&
    'message' in errorData &&
    typeof errorData.message === 'string'
      ? errorData.message
      : `HTTP ${response.status}: ${response.statusText}`;

  throw new AppError(message, response.status);
};
