import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

const PORT = 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Thêm tiền tố `/api` trước tất cả các route
  app.setGlobalPrefix('api');

  // Validation cho DTOs
  app.useGlobalPipes(new ValidationPipe());

  // CORS cho phép frontend gọi API từ domain khác
  app.enableCors({
    origin: '*', // Cho phép mọi domain truy cập
    credentials: true, // Cho phép gửi cookie (nếu có)
  });

  await app.listen(PORT);
  console.log(`🚀 Server is running on http://localhost:${PORT}/api`);
}

bootstrap();

