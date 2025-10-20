export declare enum ErrorCode {
    INVALID_CREDENTIALS = "AUTH_1001",
    TOKEN_EXPIRED = "AUTH_1002",
    TOKEN_INVALID = "AUTH_1003",
    TOKEN_REVOKED = "AUTH_1004",
    UNAUTHORIZED = "AUTH_1005",
    USER_NOT_FOUND = "USER_2001",
    USER_ALREADY_EXISTS = "USER_2002",
    EMAIL_ALREADY_EXISTS = "USER_2003",
    USERNAME_ALREADY_EXISTS = "USER_2004",
    VALIDATION_ERROR = "VAL_3001",
    INVALID_EMAIL = "VAL_3002",
    INVALID_PASSWORD = "VAL_3003",
    PASSWORD_TOO_SHORT = "VAL_3004",
    USERNAME_TOO_SHORT = "VAL_3005",
    INTERNAL_SERVER_ERROR = "SRV_5001",
    DATABASE_ERROR = "SRV_5002",
    RABBITMQ_ERROR = "SRV_5003",
    BAD_REQUEST = "GEN_4001",
    NOT_FOUND = "GEN_4002",
    FORBIDDEN = "GEN_4003"
}
export declare const ErrorMessages: {
    AUTH_1001: string;
    AUTH_1002: string;
    AUTH_1003: string;
    AUTH_1004: string;
    AUTH_1005: string;
    USER_2001: string;
    USER_2002: string;
    USER_2003: string;
    USER_2004: string;
    VAL_3001: string;
    VAL_3002: string;
    VAL_3003: string;
    VAL_3004: string;
    VAL_3005: string;
    SRV_5001: string;
    SRV_5002: string;
    SRV_5003: string;
    GEN_4001: string;
    GEN_4002: string;
    GEN_4003: string;
};
