import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './transform.intersector';

// console.log(process.env.STAGE);
async function bootstrap() {
  const logger = new Logger('Main', {timestamp: true});

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors( new TransformInterceptor())

  const port:number = 3000;
  await app.listen(port);

  logger.log(`Application listening on PORT ${port}`)
}
bootstrap();
