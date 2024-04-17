import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // protege que um outro dominio acesse a api / pode ser limitado apenas para um dominio expecifico se necessario.
  app.enableCors();

  //Validação dos dados TDO
  app.useGlobalPipes(new ValidationPipe());

  //app.useGlobalInterceptors(new LogInterceptor());

  await app.listen(3000);
}
bootstrap();
