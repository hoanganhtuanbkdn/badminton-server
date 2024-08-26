import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_KEY_FORGOT, REDIS_KEY_SIGNIN } from 'src/admin/constants';
import { BaseError } from 'src/shared/base-error';
import { generateRandomKey, generateRandomStringKey } from 'src/shared/constants';
import { AppLogger } from 'src/shared/logger/logger.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly logger: AppLogger,
    @InjectRedis()
    private readonly redis: Redis,
    private mailService: MailService,
  ) {
    this.logger.setContext(CommonService.name);
  }

  async sendOtpToEmail(
    email: string,
    firstName: string,
    lastName: string,
    key: string = null,
  ): Promise<{ email: string }> {
    try {
      switch (key) {
        case REDIS_KEY_FORGOT:
          // this.checkTimeDuringBetweenRequest(key_forgot, parseInt(process.env.TIME_DURING_BETWEEN_REQUEST_OTP));
          const key32digits = generateRandomStringKey();
          const key_forgot = `user:${key}:${key32digits}`;

          await this.redis.setex(key_forgot, parseInt(process.env.TIME_EXPIRED_OTP_EMAIL_FORGOT), email);
          await this.mailService.sendOtpVerifyEmailForgot(email, firstName + ' ' + lastName, key32digits);
          break;
        case REDIS_KEY_SIGNIN:
          const key_signin = `user:${email}:${key}`;

          this.checkTimeDuringBetweenRequest(key_signin, parseInt(process.env.TIME_DURING_BETWEEN_REQUEST_OTP));
          const key6digits = generateRandomKey(6);
          await this.redis.setex(key_signin, parseInt(process.env.TIME_EXPIRED_OTP_EMAIL_SIGNUP), key6digits);
          await this.mailService.sendVerifyAdminEmail(email, firstName + ' ' + lastName, key6digits);
          break;
        default:
        // code block
      }
      // send email

      return {
        email,
      };
    } catch (err) {
      console.log(err, 'email');
      throw new BadRequestException(err.message);
    }
  }

  async checkTimeDuringBetweenRequest(keyRedis, time) {
    const checkTime = await this.redis.object('IDLETIME', keyRedis);
    // if (checkTime && checkTime < process.env.TIME_DURING_BETWEEN_REQUEST_OTP) {
    console.log(checkTime, 'checkTimecheckTime');

    if (checkTime && checkTime < time) {
      throw BaseError.NOT_SEND_OTP_EMAIL();
    }
    return;
  }


}
