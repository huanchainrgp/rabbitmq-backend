import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    type: AuthResponseDto,
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        error: 'VAL_3001',
        message: ['email must be an email', 'password is too short'],
        timestamp: '2025-10-19T21:00:00.000Z',
        path: '/auth/register'
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email hoặc username đã tồn tại',
    schema: {
      example: {
        success: false,
        statusCode: 409,
        error: 'USER_2002',
        message: 'Email hoặc username đã tồn tại',
        timestamp: '2025-10-19T21:00:00.000Z',
        path: '/auth/register'
      }
    }
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    type: AuthResponseDto,
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Thông tin đăng nhập không đúng',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        error: 'AUTH_1001',
        message: 'Email/username hoặc mật khẩu không đúng',
        timestamp: '2025-10-19T21:00:00.000Z',
        path: '/auth/login'
      }
    }
  })
  @ApiBody({ type: LoginDto })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Lấy thông tin thành công',
        data: {
          user: {
            id: 'user_123',
            email: 'user@example.com',
            username: 'username'
          }
        },
        timestamp: '2025-10-19T21:00:00.000Z',
        path: '/auth/me'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token không hợp lệ hoặc đã hết hạn',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        error: 'AUTH_1003',
        message: 'Token không hợp lệ',
        timestamp: '2025-10-19T21:00:00.000Z',
        path: '/auth/me'
      }
    }
  })
  async getProfile(@CurrentUser() user: any) {
    return {
      user: {
        id: user.userId,
        email: user.email,
        username: user.username,
      },
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Đăng xuất' })
  @ApiResponse({
    status: 200,
    description: 'Đăng xuất thành công',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Đăng xuất thành công',
        data: {
          message: 'Logged out successfully'
        },
        timestamp: '2025-10-19T21:00:00.000Z',
        path: '/auth/logout'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token không hợp lệ hoặc đã hết hạn',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        error: 'AUTH_1003',
        message: 'Token không hợp lệ',
        timestamp: '2025-10-19T21:00:00.000Z',
        path: '/auth/logout'
      }
    }
  })
  async logout(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    return this.authService.logout(token);
  }
}
