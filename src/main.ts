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
  
  app.enableCors({
    origin: 'http://localhost:3000', // URL de ton frontend Next.js
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
