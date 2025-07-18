import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Validation cho DTOs
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // CORS cho phép frontend gọi API từ domain khác
  app.enableCors({
    origin: true, // Cho phép tất cả các domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Cho phép gửi cookies
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });


  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
    }),
  );


  const config = new DocumentBuilder()
    .setTitle('Shopery organic ecommerce')
    .setDescription(
      `This is the official API documentation for the Shopery Organic E-commerce platform.
It provides a comprehensive set of RESTful endpoints for managing users, authentication, products, attributes, categories, orders, reviews, and more.

### 🔐 Authentication
All protected endpoints require a Bearer Token (JWT). Please log in to obtain a token and include it in the "Authorize" header to access secured resources.

### 📦 Features
- User registration, login, and profile management
- Product creation, listing, and filtering
- Attribute and variant management
- Order creation and status updates
- Review system
- Admin and user role separation

For questions or support, please contact the development team.`
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger will be available at /api

  // Tăng giới hạn request body lên 10MB
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const port = process.env.PORT || 5000;
  await app.listen(port);
  Logger.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap();
