import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtGuard } from './auth/guard';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }
  ));
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000'
  });
  await app.listen(5000);
}
bootstrap();
