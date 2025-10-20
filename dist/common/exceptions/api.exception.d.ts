import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes';
export declare class ApiException extends HttpException {
    constructor(errorCode: ErrorCode, statusCode?: HttpStatus, customMessage?: string);
}
export declare class InvalidCredentialsException extends ApiException {
    constructor(message?: string);
}
export declare class UserAlreadyExistsException extends ApiException {
    constructor(message?: string);
}
export declare class UserNotFoundException extends ApiException {
    constructor(message?: string);
}
export declare class TokenExpiredException extends ApiException {
    constructor(message?: string);
}
export declare class TokenRevokedException extends ApiException {
    constructor(message?: string);
}
