import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Validation cho DTOs
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // CORS cho phép frontend gọi API từ domain khác
  app.enableCors({
    origin: '*', // Cho phép mọi domain truy cập
    credentials: true, // Cho phép gửi cookie (nếu có)
  });

  const config = new DocumentBuilder()
    .setTitle('My API Shopery organic')
    .setDescription('API Shopery organic')
    .setVersion('1.0')
    .addBearerAuth() // Optional: if you're using JWT Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger will be available at /api

  // Tăng giới hạn request body lên 10MB
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap();
