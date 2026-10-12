import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // retire les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // renvoie une erreur si un champ inconnu est envoyé
      transform: true,            // convertit en instance de classe
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
