import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import {
  ERR_MSG_FORMAT_PASSWORD,
  REGEX_PASSWORD,
  requireFieldLength,
  requireFieldMinLength,
  requireFieldNotEmpty,
} from 'src/shared/constants';

export class ResetPasswordDTO {
  @ApiProperty({
    type: String,
    default: 'vnhung1706',
    description: 'resetKey',
  })
  @IsString()
  @IsNotEmpty({ message: requireFieldNotEmpty('resetKey') })
  resetKey: string;

  @ApiProperty({
    type: String,
    default: 'Welcome321!',
    description: 'password',
  })
  @Matches(REGEX_PASSWORD, { message: ERR_MSG_FORMAT_PASSWORD })
  @MinLength(8, { message: requireFieldMinLength('newPassword', '8') })
  @MaxLength(16, { message: requireFieldLength('newPassword', '16') })
  @IsString()
  @IsNotEmpty({ message: requireFieldNotEmpty('newPassword') })
  newPassword: string;
}
