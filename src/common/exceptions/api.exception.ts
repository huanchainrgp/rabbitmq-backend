import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessages } from '../constants/error-codes';

export class ApiException extends HttpException {
  constructor(
    errorCode: ErrorCode,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    customMessage?: string,
  ) {
    const message = customMessage || ErrorMessages[errorCode];
    super(
      {
        error: errorCode,
        message,
        statusCode,
      },
      statusCode,
    );
  }
}

// Specific exceptions
export class InvalidCredentialsException extends ApiException {
  constructor(message?: string) {
    super(
      ErrorCode.INVALID_CREDENTIALS,
      HttpStatus.UNAUTHORIZED,
      message,
    );
  }
}

export class UserAlreadyExistsException extends ApiException {
  constructor(message?: string) {
    super(
      ErrorCode.USER_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      message,
    );
  }
}

export class UserNotFoundException extends ApiException {
  constructor(message?: string) {
    super(
      ErrorCode.USER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      message,
    );
  }
}

export class TokenExpiredException extends ApiException {
  constructor(message?: string) {
    super(
      ErrorCode.TOKEN_EXPIRED,
      HttpStatus.UNAUTHORIZED,
      message,
    );
  }
}

export class TokenRevokedException extends ApiException {
  constructor(message?: string) {
    super(
      ErrorCode.TOKEN_REVOKED,
      HttpStatus.UNAUTHORIZED,
      message,
    );
  }
}
