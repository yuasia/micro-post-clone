import { ApiResponse } from 'src/types/api.types';

export class ResponseHelper {
  static success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }

  static error<T>(message: string, errors?: string[]) {
    return {
      success: false,
      message,
      errors,
    };
  }
}
