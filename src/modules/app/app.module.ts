import { getConfig } from './../config/config.provider';
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import AppController from './app.controller';
import AppService from './app.service';
import ConfigsModule from '../config/config.module';
import V1Module from '@v1/v1.module';

@Module({
  imports: [
    ConfigsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        autoReconnect: true, useCreateIndex: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        uri: config.get<string>('MONGODB_URI') , // Loaded from .ENV
      }),

    }),
    RedisModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        config: {
          url: cfg.get('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        transport: {
          host: cfg.get('MAILER_HOST'),
          port: Number(cfg.get('MAILER_PORT')),
          secure: true,
          auth: {
            user: cfg.get('MAILER_USERNAME'),
            pass: cfg.get('MAILER_PASSWORD'),
          },
        },
        defaults: {
          from: cfg.get('MAILER_FROM_EMAIL'),
        },
        template: {
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    V1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
