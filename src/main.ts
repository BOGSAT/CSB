import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: true, // temporarily allow all origins for testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours in seconds
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", 'http://csb.jeroenvanrijsselt.com'],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'http://csb.jeroenvanrijsselt.com',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'http://csb.jeroenvanrijsselt.com',
          ],
          imgSrc: [
            "'self'",
            'data:',
            'https:',
            'http://csb.jeroenvanrijsselt.com',
          ],
          connectSrc: [
            "'self'",
            'http://csb.jeroenvanrijsselt.com',
            'http://api.csb.jeroenvanrijsselt.com',
          ],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    }),
  );

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
