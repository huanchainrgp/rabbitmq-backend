"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRevokedException = exports.TokenExpiredException = exports.UserNotFoundException = exports.UserAlreadyExistsException = exports.InvalidCredentialsException = exports.ApiException = void 0;
const common_1 = require("@nestjs/common");
const error_codes_1 = require("../constants/error-codes");
class ApiException extends common_1.HttpException {
    constructor(errorCode, statusCode = common_1.HttpStatus.BAD_REQUEST, customMessage) {
        const message = customMessage || error_codes_1.ErrorMessages[errorCode];
        super({
            error: errorCode,
            message,
            statusCode,
        }, statusCode);
    }
}
exports.ApiException = ApiException;
class InvalidCredentialsException extends ApiException {
    constructor(message) {
        super(error_codes_1.ErrorCode.INVALID_CREDENTIALS, common_1.HttpStatus.UNAUTHORIZED, message);
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
class UserAlreadyExistsException extends ApiException {
    constructor(message) {
        super(error_codes_1.ErrorCode.USER_ALREADY_EXISTS, common_1.HttpStatus.CONFLICT, message);
    }
}
exports.UserAlreadyExistsException = UserAlreadyExistsException;
class UserNotFoundException extends ApiException {
    constructor(message) {
        super(error_codes_1.ErrorCode.USER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND, message);
    }
}
exports.UserNotFoundException = UserNotFoundException;
class TokenExpiredException extends ApiException {
    constructor(message) {
        super(error_codes_1.ErrorCode.TOKEN_EXPIRED, common_1.HttpStatus.UNAUTHORIZED, message);
    }
}
exports.TokenExpiredException = TokenExpiredException;
class TokenRevokedException extends ApiException {
    constructor(message) {
        super(error_codes_1.ErrorCode.TOKEN_REVOKED, common_1.HttpStatus.UNAUTHORIZED, message);
    }
}
exports.TokenRevokedException = TokenRevokedException;
//# sourceMappingURL=api.exception.js.map