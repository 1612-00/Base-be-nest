import { getConfig } from './modules/config/config.provider';
// registers aliases, DON'T REMOVE THIS LINE!
import 'module-alias/register';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import AppModule from './modules/app/app.module';

import ValidationExceptions from './exceptions/validation.exceptions';

import {
  BadRequestExceptionFilter,
  UnauthorizedExceptionFilter,
  ForbiddenExceptionFilter,
  ValidationExceptionsFilter,
  NotFoundExceptionFilter,
  AllExceptionsFilter,
} from './filters';
import initializeApp from './common/init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  //const config: IConfig = app.get(CONFIG_SERVICE_PROVIDER_TOKEN);
  initializeApp(app);
  await app.listen(process.env.SERVER_PORT!);
}
bootstrap().then(() => {
  const config = getConfig();
  console.info(
    `Started on http://${process.env.SERVER_HOSTNAME!}${process.env.SERVICE_NAME_BASEURL}`,
  );
  console.info(
    `Docs available on http://${process.env.SERVER_HOSTNAME}${process.env.SERVICE_NAME_DOCSBASEURL}`,
  );
});
