import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CoreModule } from './core/core.module';

import * as configSequelize from '../src/database/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development')
          .required(),
        PORT: Joi.number().required(),
        DATABASE_DEVELOPMENT: Joi.alternatives().conditional('NODE_ENV', {
          is: 'development',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        DATABASE_TEST: Joi.alternatives().conditional('NODE_ENV', {
          is: 'test',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        DATABASE_URL: Joi.alternatives().conditional('NODE_ENV', {
          is: 'production',
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        SECRET_TOKEN: Joi.string().required(),
        DOCS_PASSWORD: Joi.string().required(),
      }),
    }),
    SequelizeModule.forRoot({
      ...configSequelize[process.env.NODE_ENV],
      uri: process.env[
        configSequelize[process.env.NODE_ENV]['use_env_variable']
      ],
      autoLoadModels: true,
      synchronize: false,
    }),
    AuthModule,
    CoreModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
