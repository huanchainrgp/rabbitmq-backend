import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '2025-10-19T21:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/auth/register' })
  path?: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string | string[];

  @ApiProperty({ example: 'BAD_REQUEST' })
  error: string;

  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: '2025-10-19T21:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/auth/login' })
  path: string;
}
