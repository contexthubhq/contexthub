export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, message?: string): ApiError {
    return new ApiError(
      message || `API request failed with status ${response.status}`,
      response.status
    );
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(message, 400);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(message, 403);
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, 404);
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(message, 500);
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
    };
  }
}
