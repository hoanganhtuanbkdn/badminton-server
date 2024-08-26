import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { requireFieldLength, requireFieldNotEmpty } from 'src/shared/constants';

export class OTPEmailDTO {
  @ApiProperty({ example: '012345' })
  @IsString()
  @IsNotEmpty({ message: requireFieldNotEmpty('otpCode') })
  otpCode: string;

  @MaxLength(250, { message: requireFieldLength('email', '250') })
  @ApiProperty({
    type: String,
    default: 'hungvu.it.94@gmail.com',
    description: 'email',
  })
  @IsEmail()
  @IsNotEmpty({ message: requireFieldNotEmpty('email') })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
