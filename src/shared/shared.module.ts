import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MailModule } from 'src/shared/configs/mail/mail.module';

import { JwtService } from '@nestjs/jwt';
import { ORMModule } from './configs/orm/orm.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppLoggerModule } from './logger/logger.module';
import { CommonService } from './services/common/common.service';
import { FilesService } from './services/file/files.service';
import { MailService } from './services/mail/mail.service';

@Module({
  imports: [ConfigModule, ORMModule, AppLoggerModule, MailModule],
  exports: [AppLoggerModule, ConfigModule, CommonService, MailService, FilesService, JwtService],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    CommonService,
    MailService,
    FilesService,
    JwtService
  ],
})
export class SharedModule { }
