export class AppException extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'AppException';
  }
}

export class AuthenticationException extends AppException {
  constructor(message: string = '認証に失敗しました', details?: any) {
    super('AUTH_FAILED', message, 401, details);
  }
}

export class ValidationException extends AppException {
  constructor(message: string = 'バリデーションエラーです', details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class ExternalServiceException extends AppException {
  constructor(
    service: string,
    message: string = '外部サービスでエラーが発生しました',
    details?: any,
  ) {
    super('EXTERNAL_SERVICE_ERROR', `${service}: ${message}`, 500, details);
  }
}

export class DatabaseException extends AppException {
  constructor(message: string, details?: any) {
    super('DATABASE_ERROR', message, 500, details);
  }
}
