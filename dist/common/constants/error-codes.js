"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["INVALID_CREDENTIALS"] = "AUTH_1001";
    ErrorCode["TOKEN_EXPIRED"] = "AUTH_1002";
    ErrorCode["TOKEN_INVALID"] = "AUTH_1003";
    ErrorCode["TOKEN_REVOKED"] = "AUTH_1004";
    ErrorCode["UNAUTHORIZED"] = "AUTH_1005";
    ErrorCode["USER_NOT_FOUND"] = "USER_2001";
    ErrorCode["USER_ALREADY_EXISTS"] = "USER_2002";
    ErrorCode["EMAIL_ALREADY_EXISTS"] = "USER_2003";
    ErrorCode["USERNAME_ALREADY_EXISTS"] = "USER_2004";
    ErrorCode["VALIDATION_ERROR"] = "VAL_3001";
    ErrorCode["INVALID_EMAIL"] = "VAL_3002";
    ErrorCode["INVALID_PASSWORD"] = "VAL_3003";
    ErrorCode["PASSWORD_TOO_SHORT"] = "VAL_3004";
    ErrorCode["USERNAME_TOO_SHORT"] = "VAL_3005";
    ErrorCode["INTERNAL_SERVER_ERROR"] = "SRV_5001";
    ErrorCode["DATABASE_ERROR"] = "SRV_5002";
    ErrorCode["RABBITMQ_ERROR"] = "SRV_5003";
    ErrorCode["BAD_REQUEST"] = "GEN_4001";
    ErrorCode["NOT_FOUND"] = "GEN_4002";
    ErrorCode["FORBIDDEN"] = "GEN_4003";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
exports.ErrorMessages = {
    [ErrorCode.INVALID_CREDENTIALS]: 'Email/username hoặc mật khẩu không đúng',
    [ErrorCode.TOKEN_EXPIRED]: 'Token đã hết hạn',
    [ErrorCode.TOKEN_INVALID]: 'Token không hợp lệ',
    [ErrorCode.TOKEN_REVOKED]: 'Token đã bị thu hồi',
    [ErrorCode.UNAUTHORIZED]: 'Không có quyền truy cập',
    [ErrorCode.USER_NOT_FOUND]: 'Không tìm thấy người dùng',
    [ErrorCode.USER_ALREADY_EXISTS]: 'Email hoặc username đã tồn tại',
    [ErrorCode.EMAIL_ALREADY_EXISTS]: 'Email đã được sử dụng',
    [ErrorCode.USERNAME_ALREADY_EXISTS]: 'Username đã được sử dụng',
    [ErrorCode.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ',
    [ErrorCode.INVALID_EMAIL]: 'Email không hợp lệ',
    [ErrorCode.INVALID_PASSWORD]: 'Mật khẩu không hợp lệ',
    [ErrorCode.PASSWORD_TOO_SHORT]: 'Mật khẩu phải có ít nhất 6 ký tự',
    [ErrorCode.USERNAME_TOO_SHORT]: 'Username phải có ít nhất 3 ký tự',
    [ErrorCode.INTERNAL_SERVER_ERROR]: 'Lỗi hệ thống',
    [ErrorCode.DATABASE_ERROR]: 'Lỗi cơ sở dữ liệu',
    [ErrorCode.RABBITMQ_ERROR]: 'Lỗi kết nối RabbitMQ',
    [ErrorCode.BAD_REQUEST]: 'Yêu cầu không hợp lệ',
    [ErrorCode.NOT_FOUND]: 'Không tìm thấy',
    [ErrorCode.FORBIDDEN]: 'Truy cập bị từ chối',
};
//# sourceMappingURL=error-codes.js.map