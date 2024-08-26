import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { AuthService } from './services';
import { JwtAuthStrategy, JwtRefreshStrategy } from './strategies';


@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'SALESFORCE_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: 'salesforce_service',
    //         brokers: [process.env.KAFKA_BROKERS_1, process.env.KAFKA_BROKERS_2],
    //       },
    //       consumer: {
    //         groupId: 'salesforce-service-group',
    //       },
    //       producerOnlyMode: true,
    //     },
    //   },
    // ]),
    SharedModule,
    // PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH, JwtRefreshStrategy: JwtRefreshStrategy }),
    // JwtModule.registerAsync({
    //   imports: [SharedModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('jwt.privateKey'),
    //     signOptions: { expiresIn: configService.get<string>('jwt.accessTokenExpiresInSec') + 's' },
    //   }),
    //   inject: [ConfigService],
    // }),
    // JwtModule.registerAsync({
    //   imports: [SharedModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('jwt.privateKeyrefresh'),
    //     signOptions: { expiresIn: configService.get<string>('jwt.refreshTokenExpiresInSec') + 's' },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [],
  providers: [AuthService, JwtRefreshStrategy, JwtAuthStrategy],
})
export class AuthModule { }
