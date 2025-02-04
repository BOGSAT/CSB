import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: ['http://csb.jeroenvanrijsselt.com', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
