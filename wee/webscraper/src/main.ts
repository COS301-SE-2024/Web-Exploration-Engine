/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import logger from "../logging/webscraperlogger"
import { NestFactory } from '@nestjs/core';
import { PerformanceInterceptor } from './performance.interceptor';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3003;

  // Use Interceptor Globally
  app.useGlobalInterceptors(new PerformanceInterceptor());
  
   // Enable CORS with specific origin
  app.enableCors({
    origin: true,
  });

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  logger.info('the app is starting',globalPrefix,'honey what is happening','maria mariaaa');
}

bootstrap();
