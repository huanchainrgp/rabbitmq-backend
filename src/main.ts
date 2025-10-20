import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Auth Server API')
    .setDescription('Authentication server with RabbitMQ integration')
    .setVersion('2.0.0')
    .addTag('auth', 'Authentication endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
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
