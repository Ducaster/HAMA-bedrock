import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ✅ CORS 활성화 (필요한 경우)
  app.enableCors({});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
