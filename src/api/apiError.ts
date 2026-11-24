export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;
  public isNetworkError: boolean;

  constructor(message: string, statusCode: number = 500, details?: unknown, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.isNetworkError = isNetworkError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
