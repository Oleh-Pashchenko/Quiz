import {
  BadRequestException,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const logger = new Logger('Bootstrap');

  app.enableVersioning({
    defaultVersion: ['1'],
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );

  const isProd = config.get('NODE_ENV') === 'prod';

  if (!isProd) {
    const documentBuilder = new DocumentBuilder()
      .setTitle('Quiz')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, documentBuilder);
    SwaggerModule.setup('api', app, document);
  }

  const port = config.get<number>('PORT');
  logger.log(`Listening at http://localhost:${port}/`);

  await app.listen(port);
}
bootstrap();
