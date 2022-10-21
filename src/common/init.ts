import { CONFIG_SERVICE_PROVIDER_TOKEN, getConfig } from './../modules/config/config.provider';
import { INestApplication, ValidationPipe, ValidationError } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IConfig } from 'config';
import * as bodyParser from 'body-parser';
import ValidationExceptions from '../exceptions/validation.exceptions';
import {
  BadRequestExceptionFilter,
  UnauthorizedExceptionFilter,
  ForbiddenExceptionFilter,
  ValidationExceptionsFilter,
  NotFoundExceptionFilter,
  AllExceptionsFilter,
} from '../filters';
import helmet from "helmet";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import process from 'process';
dotenv.config()

export default async function initializeApp(app: INestApplication): Promise<any> {
const config = getConfig();
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => new ValidationExceptions(errors),
  }));
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new UnauthorizedExceptionFilter(),
    new ForbiddenExceptionFilter(),
    new BadRequestExceptionFilter(),
    new NotFoundExceptionFilter(),
    new ValidationExceptionsFilter(),
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(helmet.xssFilter())
  app.setGlobalPrefix(process.env.SERVICE_NAME_BASEURL!);

  const options = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('The template API for nestjs devs')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.setGlobalPrefix(process.env.SERVICE_NAME_BASEURL!);
  SwaggerModule.setup(process.env.SERVICE_NAME_DOCSBASEURL!, app, document);

}