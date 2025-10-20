export enum ErrorCode {
  // Authentication Errors (1xxx)
  INVALID_CREDENTIALS = 'AUTH_1001',
  TOKEN_EXPIRED = 'AUTH_1002',
  TOKEN_INVALID = 'AUTH_1003',
  TOKEN_REVOKED = 'AUTH_1004',
  UNAUTHORIZED = 'AUTH_1005',
  
  // User Errors (2xxx)
  USER_NOT_FOUND = 'USER_2001',
  USER_ALREADY_EXISTS = 'USER_2002',
  EMAIL_ALREADY_EXISTS = 'USER_2003',
  USERNAME_ALREADY_EXISTS = 'USER_2004',
  
  // Validation Errors (3xxx)
  VALIDATION_ERROR = 'VAL_3001',
  INVALID_EMAIL = 'VAL_3002',
  INVALID_PASSWORD = 'VAL_3003',
  PASSWORD_TOO_SHORT = 'VAL_3004',
  USERNAME_TOO_SHORT = 'VAL_3005',
  
  // Server Errors (5xxx)
  INTERNAL_SERVER_ERROR = 'SRV_5001',
  DATABASE_ERROR = 'SRV_5002',
  RABBITMQ_ERROR = 'SRV_5003',
  
  // General Errors
  BAD_REQUEST = 'GEN_4001',
  NOT_FOUND = 'GEN_4002',
  FORBIDDEN = 'GEN_4003',
}

export const ErrorMessages = {
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
