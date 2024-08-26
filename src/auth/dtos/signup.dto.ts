import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import {
  ERR_MSG_FORMAT_PASSWORD,
  REGEX_PASSWORD,
  requireFieldLength,
  requireFieldNotEmpty,
} from 'src/shared/constants';

export class SignUpDTO {
  @MaxLength(250, { message: requireFieldLength('firstName', '250') })
  @IsString()
  @ApiProperty({
    type: String,
    default: 'Hung',
    description: 'firstName',
  })
  @IsNotEmpty({ message: requireFieldNotEmpty('firstName') })
  firstName: string;

  @ApiProperty({
    type: String,
    default: 'Vu',
    description: 'lastName',
  })
  @MaxLength(250, { message: requireFieldLength('lastName', '250') })
  @IsString()
  @IsNotEmpty({ message: requireFieldNotEmpty('lastName') })
  lastName: string;

  @IsEmail()
  @MaxLength(250, { message: requireFieldLength('email', '250') })
  @IsNotEmpty({ message: requireFieldNotEmpty('email') })
  @ApiProperty({
    type: String,
    default: 'vnhung1@cmcglobal.vn',
    description: 'email',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
    default: 'Welcome321!',
    description: 'password',
  })
  @Matches(REGEX_PASSWORD, { message: ERR_MSG_FORMAT_PASSWORD })
  @MinLength(8, { message: requireFieldLength('password', '8') })
  @MaxLength(16, { message: requireFieldLength('password', '16') })
  @IsString()
  @IsNotEmpty({ message: requireFieldNotEmpty('password') })
  password: string;
}
