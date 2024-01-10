import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
