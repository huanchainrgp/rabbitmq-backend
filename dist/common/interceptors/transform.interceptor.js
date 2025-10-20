"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const statusCode = context.switchToHttp().getResponse().statusCode;
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data &&
                typeof data === 'object' &&
                'success' in data &&
                'statusCode' in data) {
                return data;
            }
            return {
                success: true,
                statusCode,
                message: this.getSuccessMessage(request.url, request.method),
                data,
                timestamp: new Date().toISOString(),
                path: request.url,
            };
        }));
    }
    getSuccessMessage(url, method) {
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
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map