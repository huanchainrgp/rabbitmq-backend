import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => {
        // If data already has the standard format, return as is
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'statusCode' in data
        ) {
          return data;
        }

        // Transform to standard format
        return {
          success: true,
          statusCode,
          message: this.getSuccessMessage(request.url, request.method),
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }

  private getSuccessMessage(url: string, method: string): string {
    if (url.includes('/register')) {
      return 'Đăng ký thành công';
    }
    if (url.includes('/login')) {
      return 'Đăng nhập thành công';
    }
    if (url.includes('/logout')) {
      return 'Đăng xuất thành công';
    }
    if (url.includes('/me')) {
      return 'Lấy thông tin thành công';
    }

    const messages = {
      GET: 'Lấy dữ liệu thành công',
      POST: 'Tạo mới thành công',
      PUT: 'Cập nhật thành công',
      PATCH: 'Cập nhật thành công',
      DELETE: 'Xóa thành công',
    };

    return messages[method] || 'Thành công';
  }
}
