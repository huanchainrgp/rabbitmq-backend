export declare class UserResponseDto {
    id: string;
    email: string;
    username: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: UserResponseDto;
}
