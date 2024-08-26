import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { configModuleOptions } from './shared/configs/module-options';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST, // Redis host
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    SharedModule,
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    ScheduleModule.forRoot(),
    AdminModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ]
})
export class AppModule { }
