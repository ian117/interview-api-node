import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // Ignorar datos que no esten en los DTO
      whitelist: true,
      // Lanzar error si existen datos prohibidos
      forbidNonWhitelisted: true,
      // Desabilitar mensajes de error
      disableErrorMessages:
        process.env.NODE_ENV == 'production' ? false : false,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Inversion Opportunities API')
    .setDescription('All the possible operations are here')
    .setVersion('1.0')
    .addTag('API Endpoints')
    .addBearerAuth(
      {
        description: 'JWT Authorization',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT Token',
    )
    .addBearerAuth(
      {
        description: 'JWT Authorization',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Admin base64 Bearer Token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
