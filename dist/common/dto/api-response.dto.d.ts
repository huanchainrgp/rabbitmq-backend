export declare class ApiResponseDto<T> {
    statusCode: number;
    message: string;
    data?: T;
    success: boolean;
    timestamp: string;
    path?: string;
}
export declare class ApiErrorResponseDto {
    statusCode: number;
    message: string | string[];
    error: string;
    success: boolean;
    timestamp: string;
    path: string;
}
