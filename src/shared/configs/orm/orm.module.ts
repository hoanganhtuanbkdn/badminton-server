import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number | undefined>('database.port'),
          database: configService.get<string>('database.name'),
          username: configService.get<string>('database.user'),
          password: configService.get<string>('database.pass'),
          entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],

          // Timezone configured on the Postgres server.
          // This is used to typecast server date/time values to JavaScript Date object and vice versa.
          timezone: 'Z',
          synchronize: true,
          debug: configService.get<string>('env') === 'development',
          logging: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class ORMModule { }
