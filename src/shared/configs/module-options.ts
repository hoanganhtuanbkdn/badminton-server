import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: `.env.${process.env.NODE_ENV}`,
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string().valid('development', 'production', 'stagging').default('production'),
    APP_PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().optional(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    JWT_ACCECC_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXP_IN_SEC: Joi.number().required(),
    JWT_REFRESH_TOKEN_EXP_IN_SEC: Joi.number().required(),
  }),
};
