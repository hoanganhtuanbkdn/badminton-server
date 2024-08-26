import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { requireFieldLength, requireFieldNotEmpty } from 'src/shared/constants';

export class AuthLoginAdminDto {
  @IsEmail()
  @MaxLength(250, { message: requireFieldLength('email', '250') })
  @IsNotEmpty({ message: requireFieldNotEmpty('email') })
  @ApiProperty({
    type: String,
    default: 'hungvu.it.94@gmail.com',
    description: 'email',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
    default: 'Welcome321!',
    description: 'password',
  })
  @MinLength(8, { message: requireFieldLength('password', '8') })
  @MaxLength(16, { message: requireFieldLength('password', '16') })
  @IsString()
  @IsNotEmpty({ message: requireFieldNotEmpty('password') })
  password: string;
}
