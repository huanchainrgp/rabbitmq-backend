"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Auth Server API')
        .setDescription('Authentication server with RabbitMQ integration')
        .setVersion('2.0.0')
        .addTag('auth', 'Authentication endpoints')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Auth Server API Documentation',
        customfavIcon: 'https://nestjs.com/img/logo_text.svg',
        customCss: '.swagger-ui .topbar { display: none }',
    });
    const port = process.env.NODE_PORT || 4000;
    await app.listen(port);
    logger.log(`🚀 Auth Server running at: http://localhost:${port}/`);
    logger.log(`📚 Swagger documentation: http://localhost:${port}/api`);
    logger.log(`📡 Available endpoints:`);
    logger.log(`   POST /auth/register - Register new user`);
    logger.log(`   POST /auth/login - Login user`);
    logger.log(`   GET  /auth/me - Get current user (protected)`);
    logger.log(`   POST /auth/logout - Logout user (protected)`);
}
bootstrap();
//# sourceMappingURL=main.js.map